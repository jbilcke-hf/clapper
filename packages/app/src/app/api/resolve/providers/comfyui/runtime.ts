import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  ClapWorkflow,
  ClapWorkflowCategory,
  generateSeed,
} from '@aitube/clap'

import { createPromptBuilder } from './createPromptBuilder'
import { ComfyUIWorkflowApiGraph } from './graph'
import { getMainInputsFromComfyUiWorkflow } from './getMainInputsFromComfyUiWorkflow'
import { ClapperComfyUiInputIds } from './types'

type NodeInputSelection = {
  id?: string
}

export type ConfiguredComfyWorkflow = {
  workflowGraph: ComfyUIWorkflowApiGraph
  outputNodeId?: string
}

const DATA_URI_MARKER = ';base64,'

export function getComfyWorkflowForSegment(
  request: ResolveRequest
): ClapWorkflow {
  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      return request.settings.imageGenerationWorkflow
    case ClapSegmentCategory.VIDEO:
      return request.settings.videoGenerationWorkflow
    case ClapSegmentCategory.DIALOGUE:
      return request.settings.voiceGenerationWorkflow
    case ClapSegmentCategory.SOUND:
      return request.settings.soundGenerationWorkflow
    case ClapSegmentCategory.MUSIC:
      return request.settings.musicGenerationWorkflow
    default:
      throw new Error(
        `Clapper doesn't support ${request.segment.category} generation for provider "ComfyUI".`
      )
  }
}

export function getComfyWorkflowCategoryForSegment(
  category: ClapSegmentCategory
): ClapWorkflowCategory {
  switch (category) {
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

export function getMainComfyInputValues(request: ResolveRequest) {
  const category = request.segment.category
  const segmentPrompt = request.segment.prompt || ''

  const imagePrompt = request.prompts.image.positive || segmentPrompt
  const imageNegativePrompt = request.prompts.image.negative || ''
  const voicePrompt = request.prompts.voice.positive || segmentPrompt
  const voiceNegativePrompt = request.prompts.voice.negative || ''
  const audioPrompt = request.prompts.audio.positive || segmentPrompt
  const audioNegativePrompt = request.prompts.audio.negative || ''
  const musicPrompt = request.prompts.music.positive || segmentPrompt
  const musicNegativePrompt = request.prompts.music.negative || ''

  const values: Partial<Record<ClapperComfyUiInputIds, string | number>> = {
    [ClapperComfyUiInputIds.SEED]: generateSeed(),
  }

  switch (category) {
    case ClapSegmentCategory.VIDEO:
      values[ClapperComfyUiInputIds.PROMPT] = imagePrompt
      values[ClapperComfyUiInputIds.NEGATIVE_PROMPT] = imageNegativePrompt
      values[ClapperComfyUiInputIds.IMAGE] = stripDataUriPrefix(
        request.prompts.video.image || request.prompts.image.identity
      )
      values[ClapperComfyUiInputIds.AUDIO] = stripDataUriPrefix(
        request.prompts.video.voice || request.prompts.voice.identity
      )
      break
    case ClapSegmentCategory.DIALOGUE:
      values[ClapperComfyUiInputIds.PROMPT] = voicePrompt
      values[ClapperComfyUiInputIds.NEGATIVE_PROMPT] = voiceNegativePrompt
      values[ClapperComfyUiInputIds.AUDIO] = stripDataUriPrefix(
        request.prompts.voice.identity
      )
      break
    case ClapSegmentCategory.SOUND:
      values[ClapperComfyUiInputIds.PROMPT] = audioPrompt
      values[ClapperComfyUiInputIds.NEGATIVE_PROMPT] = audioNegativePrompt
      break
    case ClapSegmentCategory.MUSIC:
      values[ClapperComfyUiInputIds.PROMPT] = musicPrompt
      values[ClapperComfyUiInputIds.NEGATIVE_PROMPT] = musicNegativePrompt
      break
    case ClapSegmentCategory.IMAGE:
    default:
      values[ClapperComfyUiInputIds.PROMPT] = imagePrompt
      values[ClapperComfyUiInputIds.NEGATIVE_PROMPT] = imageNegativePrompt
      values[ClapperComfyUiInputIds.WIDTH] = request.meta.width
      values[ClapperComfyUiInputIds.HEIGHT] = request.meta.height
      values[ClapperComfyUiInputIds.IMAGE] = stripDataUriPrefix(
        request.prompts.image.identity
      )
      break
  }

  if (category === ClapSegmentCategory.VIDEO) {
    values[ClapperComfyUiInputIds.WIDTH] = request.meta.width
    values[ClapperComfyUiInputIds.HEIGHT] = request.meta.height
  }

  return values
}

export function configureComfyWorkflow(
  request: ResolveRequest,
  clapWorkflow = getComfyWorkflowForSegment(request)
): ConfiguredComfyWorkflow {
  if (!clapWorkflow?.data) {
    throw new Error(`Missing ComfyUI workflow data`)
  }

  const workflowGraph = ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data)
  const inputValues = getEffectiveComfyInputValues(clapWorkflow)
  const workflowInputs = workflowGraph.getInputs()

  Object.entries(inputValues).forEach(([inputId, inputValue]) => {
    if (!workflowInputs[inputId] || isNodeInputSelection(inputValue)) return
    workflowGraph.setInputValue(inputId, inputValue, { ignoreErrors: true })
  })

  const mainInputValues = getMainComfyInputValues(request)
  Object.entries(mainInputValues).forEach(([mainInputId, value]) => {
    const inputId = getNodeInputId(inputValues[mainInputId])
    if (!inputId || inputId === ClapperComfyUiInputIds.NULL) return
    if (value === undefined || value === null) return
    workflowGraph.setInputValue(inputId, value, { ignoreErrors: true })
  })

  const selectedOutputNodeId = getNodeInputId(
    inputValues[ClapperComfyUiInputIds.OUTPUT]
  )
  const outputNodeId =
    selectedOutputNodeId && selectedOutputNodeId !== ClapperComfyUiInputIds.NULL
      ? selectedOutputNodeId
      : workflowGraph.getOutputNode()?.id

  return {
    workflowGraph,
    outputNodeId,
  }
}

export function createConfiguredPromptBuilder(
  configuredWorkflow: ConfiguredComfyWorkflow
) {
  const promptBuilder = createPromptBuilder(configuredWorkflow.workflowGraph)

  if (configuredWorkflow.outputNodeId) {
    promptBuilder.setOutputNode(
      ClapperComfyUiInputIds.OUTPUT,
      configuredWorkflow.outputNodeId
    )
  }

  return promptBuilder
}

export function getComfyOutputAssetPaths(
  rawOutput: unknown,
  options: {
    outputNodeId?: string
    toLocalPath?: (asset: any) => string
  } = {}
): string[] {
  const outputs: unknown[] = []

  if (isRecord(rawOutput)) {
    outputs.push(rawOutput[ClapperComfyUiInputIds.OUTPUT])
    if (options.outputNodeId) {
      outputs.push(rawOutput[options.outputNodeId])
    }
  }
  outputs.push(rawOutput)

  return uniqueStrings(
    outputs.flatMap((output) =>
      collectOutputAssetPaths(output, options.toLocalPath)
    )
  )
}

function getEffectiveComfyInputValues(clapWorkflow: ClapWorkflow) {
  const inputValues = {
    ...(clapWorkflow.inputValues || {}),
  }

  try {
    const { inputValues: detectedInputValues } =
      getMainInputsFromComfyUiWorkflow(
        clapWorkflow.data,
        clapWorkflow.category || ClapWorkflowCategory.IMAGE_GENERATION
      )

    Object.entries(detectedInputValues).forEach(([inputId, inputValue]) => {
      if (!inputValues[inputId]) {
        inputValues[inputId] = inputValue
      }
    })
  } catch {
    // The caller will surface the parse error while building the graph.
  }

  return inputValues
}

function collectOutputAssetPaths(
  value: unknown,
  toLocalPath?: (asset: any) => string
): string[] {
  if (!value) return []

  if (typeof value === 'string') {
    return looksLikeAssetReference(value) ? [value] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectOutputAssetPaths(item, toLocalPath))
  }

  if (!isRecord(value)) return []

  const directStringKeys = [
    'url',
    'file_url',
    'image_url',
    'video_url',
    'audio_url',
    'path',
    'data',
  ]
  const directStringAssets = directStringKeys
    .map((key) => value[key])
    .filter((item): item is string => typeof item === 'string')
    .filter(looksLikeAssetReference)

  const localPath =
    value.filename && toLocalPath ? safeToLocalPath(value, toLocalPath) : ''

  const collectionKeys = [
    'images',
    'videos',
    'gifs',
    'audio',
    'audios',
    'files',
    'outputs',
    'output',
  ]
  const nestedAssets = collectionKeys.flatMap((key) =>
    collectOutputAssetPaths(value[key], toLocalPath)
  )

  return [localPath, ...directStringAssets, ...nestedAssets].filter(Boolean)
}

function getNodeInputId(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (isNodeInputSelection(value)) return value.id
  return undefined
}

function isNodeInputSelection(value: unknown): value is NodeInputSelection {
  return isRecord(value) && typeof value.id === 'string'
}

function stripDataUriPrefix(value?: string): string | undefined {
  if (!value) return undefined
  return value.includes(DATA_URI_MARKER)
    ? value.split(DATA_URI_MARKER).pop()
    : value
}

function looksLikeAssetReference(value: string): boolean {
  return /^(data:|https?:\/\/|file:\/\/|\/)/i.test(value)
}

function safeToLocalPath(
  asset: Record<string, unknown>,
  toLocalPath: (asset: Record<string, unknown>) => string
) {
  try {
    return toLocalPath(asset)
  } catch {
    return ''
  }
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

function isRecord(value: unknown): value is Record<string, any> {
  return !!value && typeof value === 'object'
}
