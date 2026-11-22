import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { BasicCredentials, CallWrapper, ComfyApi } from '@saintno/comfyui-sdk'

import { decodeOutput } from '@/lib/utils/decodeOutput'
import { ClapperComfyUiInputIds, ComfyUiOutputAsset } from './types'
import { buildPopulatedComfyUiWorkflow } from './createPromptBuilder'
import { convertComfyUiWorkflowApiToClapWorkflow } from './convertComfyUiWorkflowApiToClapWorkflow'
import { validateComfyUiApiUrl } from './utils'

const SUPPORTED_SEGMENT_CATEGORIES = new Set<ClapSegmentCategory>([
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.MUSIC,
])

export function getWorkflowCategoryForSegment(
  segmentCategory: ClapSegmentCategory
): ClapWorkflowCategory {
  switch (segmentCategory) {
    case ClapSegmentCategory.VIDEO:
      return ClapWorkflowCategory.VIDEO_GENERATION
    case ClapSegmentCategory.DIALOGUE:
      return ClapWorkflowCategory.VOICE_GENERATION
    case ClapSegmentCategory.SOUND:
      return ClapWorkflowCategory.SOUND_GENERATION
    case ClapSegmentCategory.MUSIC:
      return ClapWorkflowCategory.MUSIC_GENERATION
    case ClapSegmentCategory.IMAGE:
    default:
      return ClapWorkflowCategory.IMAGE_GENERATION
  }
}

/**
 * Resolves and normalizes the ClapWorkflow for any supported segment category
 * from request.settings, falling back to category-specific ComfyUI settings.
 */
export function resolveClapWorkflowForSegment(
  request: ResolveRequest
): ClapWorkflow {
  const segmentCategory = request.segment.category
  if (!SUPPORTED_SEGMENT_CATEGORIES.has(segmentCategory)) {
    throw new Error(
      `Clapper doesn't support ${segmentCategory} generation for provider "ComfyUI". Please open a pull request with (working code) to solve this!`
    )
  }

  const workflowCategory = getWorkflowCategoryForSegment(segmentCategory)

  const primaryByCategory: Partial<Record<ClapSegmentCategory, ClapWorkflow>> =
    {
      [ClapSegmentCategory.IMAGE]: request.settings.imageGenerationWorkflow,
      [ClapSegmentCategory.VIDEO]: request.settings.videoGenerationWorkflow,
      [ClapSegmentCategory.DIALOGUE]: request.settings.voiceGenerationWorkflow,
      [ClapSegmentCategory.SOUND]: request.settings.soundGenerationWorkflow,
      [ClapSegmentCategory.MUSIC]: request.settings.musicGenerationWorkflow,
    }

  let candidate = primaryByCategory[segmentCategory]

  const hasValidData = (wf?: ClapWorkflow) =>
    Boolean(
      wf &&
        typeof wf.data === 'string' &&
        wf.data.trim() &&
        wf.data.trim() !== '{}'
    )

  if (
    !hasValidData(candidate) ||
    candidate?.engine !== ClapWorkflowEngine.COMFYUI_WORKFLOW
  ) {
    if (
      segmentCategory === ClapSegmentCategory.IMAGE &&
      hasValidData(request.settings.comfyClapWorkflowForImage)
    ) {
      candidate = request.settings.comfyClapWorkflowForImage
    } else if (
      segmentCategory === ClapSegmentCategory.VIDEO &&
      hasValidData(request.settings.comfyClapWorkflowForVideo)
    ) {
      candidate = request.settings.comfyClapWorkflowForVideo
    } else if (
      segmentCategory === ClapSegmentCategory.DIALOGUE &&
      request.settings.comfyWorkflowForVoice &&
      request.settings.comfyWorkflowForVoice.trim() !== '{}'
    ) {
      candidate = convertComfyUiWorkflowApiToClapWorkflow(
        request.settings.comfyWorkflowForVoice,
        ClapWorkflowCategory.VOICE_GENERATION
      )
    } else if (
      segmentCategory === ClapSegmentCategory.SOUND &&
      request.settings.comfyWorkflowForSound &&
      request.settings.comfyWorkflowForSound.trim() !== '{}'
    ) {
      candidate = convertComfyUiWorkflowApiToClapWorkflow(
        request.settings.comfyWorkflowForSound,
        ClapWorkflowCategory.SOUND_GENERATION
      )
    } else if (
      segmentCategory === ClapSegmentCategory.MUSIC &&
      request.settings.comfyWorkflowForMusic &&
      request.settings.comfyWorkflowForMusic.trim() !== '{}'
    ) {
      candidate = convertComfyUiWorkflowApiToClapWorkflow(
        request.settings.comfyWorkflowForMusic,
        ClapWorkflowCategory.MUSIC_GENERATION
      )
    }
  }

  if (!candidate || !hasValidData(candidate)) {
    throw new Error(
      `No valid ComfyUI workflow configured for ${segmentCategory} generation.`
    )
  }

  // Ensure @clapper/* inputValues are populated if only raw data was provided
  const hasClapperMappings = Boolean(
    candidate.inputValues &&
      (candidate.inputValues[ClapperComfyUiInputIds.OUTPUT] !== undefined ||
        candidate.inputValues[ClapperComfyUiInputIds.PROMPT] !== undefined ||
        candidate.inputValues[ClapperComfyUiInputIds.IMAGE] !== undefined)
  )

  if (!hasClapperMappings) {
    const converted = convertComfyUiWorkflowApiToClapWorkflow(
      candidate.data,
      workflowCategory
    )
    return {
      ...converted,
      id: candidate.id || converted.id,
      label: candidate.label || converted.label,
      provider: candidate.provider || converted.provider,
      category: workflowCategory,
      inputValues: {
        ...converted.inputValues,
        ...(candidate.inputValues || {}),
      },
    }
  }

  return {
    ...candidate,
    category: candidate.category || workflowCategory,
  }
}

async function executeComfyUiPromptViaHttp({
  baseUrl,
  clientId,
  workflowJson,
  outputNodeId,
  authHeader,
  pollIntervalMs = 500,
  maxPollAttempts = 120,
}: {
  baseUrl: string
  clientId: string
  workflowJson: Record<string, any>
  outputNodeId: string
  authHeader?: string
  pollIntervalMs?: number
  maxPollAttempts?: number
}): Promise<Record<string, any>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (authHeader) {
    headers.Authorization = authHeader
  }

  const promptResponse = await fetch(`${baseUrl}/prompt`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt: workflowJson,
      client_id: clientId,
    }),
  })

  if (!promptResponse.ok) {
    throw new Error(
      `ComfyUI /prompt request failed with status ${promptResponse.status}`
    )
  }

  const promptData = await promptResponse.json()
  if (promptData?.error) {
    const errMsg =
      typeof promptData.error === 'string'
        ? promptData.error
        : promptData.error.message || JSON.stringify(promptData.error)
    throw new Error(`ComfyUI prompt error: ${errMsg}`)
  }

  const promptId = promptData?.prompt_id
  if (!promptId) {
    throw new Error('ComfyUI /prompt response did not return a prompt_id')
  }

  for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
    const historyResponse = await fetch(`${baseUrl}/history/${promptId}`, {
      method: 'GET',
      headers,
    })

    if (historyResponse.ok) {
      const historyData = await historyResponse.json()
      const entry = historyData?.[promptId]
      if (entry?.status?.status_str === 'error') {
        throw new Error('ComfyUI workflow execution failed in history status.')
      }
      if (entry?.outputs && Object.keys(entry.outputs).length > 0) {
        const nodeOutput =
          entry.outputs[outputNodeId] || Object.values(entry.outputs)[0]
        return {
          ...entry.outputs,
          [ClapperComfyUiInputIds.OUTPUT]: nodeOutput,
        }
      }
    }

    if (attempt < maxPollAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    }
  }

  throw new Error(
    `Timed out waiting for ComfyUI prompt ${promptId} in /history`
  )
}

export function extractAssetPathsFromComfyUiOutput({
  rawOutput,
  outputNodeId,
  category,
  api,
  baseUrl,
}: {
  rawOutput: Record<string, any>
  outputNodeId: string
  category: ClapWorkflowCategory
  api?: { getPathImage?: (asset: any) => string }
  baseUrl: string
}): string[] {
  const outputNodeData =
    rawOutput?.[ClapperComfyUiInputIds.OUTPUT] ||
    rawOutput?.[outputNodeId] ||
    Object.values(rawOutput || {}).find(
      (v: any) =>
        v &&
        typeof v === 'object' &&
        (v.videos || v.gifs || v.audio || v.images || v.files)
    )

  if (!outputNodeData) {
    return []
  }

  let assets: (ComfyUiOutputAsset | string)[] = []
  if (category === ClapWorkflowCategory.VIDEO_GENERATION) {
    assets =
      outputNodeData.videos ||
      outputNodeData.gifs ||
      outputNodeData.images ||
      outputNodeData.files ||
      []
  } else if (
    category === ClapWorkflowCategory.VOICE_GENERATION ||
    category === ClapWorkflowCategory.SOUND_GENERATION ||
    category === ClapWorkflowCategory.MUSIC_GENERATION
  ) {
    assets =
      outputNodeData.audio ||
      outputNodeData.files ||
      outputNodeData.images ||
      []
  } else {
    assets =
      outputNodeData.images || outputNodeData.gifs || outputNodeData.files || []
  }

  if (!Array.isArray(assets)) {
    return []
  }

  return assets
    .map((asset) => {
      if (typeof asset === 'string') {
        if (
          asset.startsWith('http://') ||
          asset.startsWith('https://') ||
          asset.startsWith('data:')
        ) {
          return asset
        }
        return `${baseUrl}/view?filename=${encodeURIComponent(asset)}&type=output`
      }
      if (asset && typeof asset === 'object' && asset.filename) {
        if (typeof api?.getPathImage === 'function') {
          return api.getPathImage(asset)
        }
        const subfolder = encodeURIComponent(asset.subfolder || '')
        const type = encodeURIComponent(asset.type || 'output')
        return `${baseUrl}/view?filename=${encodeURIComponent(asset.filename)}&subfolder=${subfolder}&type=${type}`
      }
      return ''
    })
    .filter(Boolean)
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyUiClientId) {
    throw new Error(`Missing client id for "ComfyUI"`)
  }

  const baseUrl = validateComfyUiApiUrl(
    request.settings.comfyUiApiUrl || 'http://localhost:8188'
  )

  const clapWorkflow = resolveClapWorkflowForSegment(request)

  if (
    clapWorkflow.category !== ClapWorkflowCategory.VIDEO_GENERATION &&
    !clapWorkflow.inputValues?.[ClapperComfyUiInputIds.PROMPT] &&
    !clapWorkflow.data.includes('@clapper/prompt')
  ) {
    throw new Error(
      `This workflow doesn't seem to have an input required by Clapper (e.g. a node with an input called "prompt")`
    )
  }

  if (!clapWorkflow.inputValues?.[ClapperComfyUiInputIds.OUTPUT]) {
    throw new Error(
      `This workflow doesn't seem to have a node output required by Clapper (e.g. a 'Save Image' node)`
    )
  }

  const { promptBuilder, workflowJson, outputNodeId } =
    buildPopulatedComfyUiWorkflow(clapWorkflow, request)

  const segment: TimelineSegment = { ...request.segment }

  const credentials: BasicCredentials = {
    type: 'basic',
    username: request.settings.comfyUiHttpAuthLogin,
    password: request.settings.comfyUiHttpAuthPassword,
  }

  const authHeader = request.settings.comfyUiHttpAuthLogin
    ? `Basic ${Buffer.from(
        `${request.settings.comfyUiHttpAuthLogin}:${request.settings.comfyUiHttpAuthPassword || ''}`
      ).toString('base64')}`
    : undefined

  const api = new ComfyApi(
    baseUrl,
    request.settings.comfyUiClientId,
    request.settings.comfyUiHttpAuthLogin
      ? {
          credentials,
        }
      : undefined
  )

  let rawOutput: Record<string, any> | false | undefined = false

  if (api.isReady) {
    try {
      const pipeline = new CallWrapper(api, promptBuilder)
        .onPending(() => {})
        .onStart(() => {})
        .onPreview(() => {})
        .onFinished(() => {})
        .onProgress(() => {})
        .onFailed(() => {})

      rawOutput = (await pipeline.run()) as Record<string, any> | false
    } catch {
      rawOutput = false
    }
  }

  if (!rawOutput) {
    rawOutput = await executeComfyUiPromptViaHttp({
      baseUrl,
      clientId: request.settings.comfyUiClientId,
      workflowJson,
      outputNodeId,
      authHeader,
    })
  }

  if (!rawOutput) {
    throw new Error(`failed to run the pipeline (no output)`)
  }

  const assetPaths = extractAssetPathsFromComfyUiOutput({
    rawOutput,
    outputNodeId,
    category: clapWorkflow.category,
    api,
    baseUrl,
  })

  const assetPath = assetPaths.at(0)
  if (!assetPath) {
    throw new Error(`failed to run the pipeline (no image)`)
  }

  const assetUrl = await decodeOutput(assetPath)

  segment.assetUrl = assetUrl
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}
