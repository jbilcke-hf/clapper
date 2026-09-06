import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapInputField,
  ClapSegmentCategory,
  ClapWorkflow,
  ClapWorkflowCategory,
  generateSeed,
} from '@aitube/clap'
import { ClapInputValueObject } from '@aitube/clap/dist/types'

import { TimelineSegment } from '@aitube/timeline'

import { ClapperComfyUiInputIds } from './types'
import { ComfyUIWorkflowApiGraph } from './graph'
import {
  ComfyUiClient,
  extractComfyUiOutputAssets,
  normalizeComfyUiPromptValue,
} from './client'

type MainInput = [ClapperComfyUiInputIds, unknown]

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyUiClientId) {
    throw new Error(`Missing client id for "ComfyUI"`)
  }

  const segment: TimelineSegment = { ...request.segment }
  const clapWorkflow = getComfyWorkflowForSegment(request)

  if (!clapWorkflow?.data) {
    throw new Error(`Missing ComfyUI workflow for ${request.segment.category}`)
  }

  validateWorkflowBindings(clapWorkflow)

  const client = new ComfyUiClient({
    apiUrl: request.settings.comfyUiApiUrl || 'http://localhost:8188',
    clientId: request.settings.comfyUiClientId,
    credentials: {
      username: request.settings.comfyUiHttpAuthLogin,
      password: request.settings.comfyUiHttpAuthPassword,
      bearerToken: request.settings.comfyUiApiKey,
    },
  })

  const workflowGraph = ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data)

  applyWorkflowDefaults(workflowGraph, clapWorkflow)
  await applyMainInputs({
    workflowGraph,
    clapWorkflow,
    request,
    client,
  })

  const result = await client.runPrompt(workflowGraph.toJson())
  const outputNodeId = getMappedInputId(
    clapWorkflow,
    ClapperComfyUiInputIds.OUTPUT
  )
  const assets = extractComfyUiOutputAssets(result.history, outputNodeId)
  const asset = selectComfyUiAssetForCategory(
    assets,
    request.segment.category
  )

  if (!asset) {
    throw new Error(
      `ComfyUI finished prompt ${result.promptId} without an output asset`
    )
  }

  segment.assetUrl = await client.readAssetAsDataUri(asset)
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}

function getComfyWorkflowForSegment(request: ResolveRequest): ClapWorkflow {
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
        `Clapper doesn't support ${request.segment.category} generation for provider "ComfyUI" yet.`
      )
  }
}

function selectComfyUiAssetForCategory(
  assets: ComfyUiOutputAsset[],
  category: ClapSegmentCategory
): ComfyUiOutputAsset | undefined {
  const score = (asset: ComfyUiOutputAsset): number => {
    const filename = asset.filename.toLowerCase()
    const format = (asset.format || '').toLowerCase()
    const type = (asset.type || '').toLowerCase()
    const combined = `${filename} ${format} ${type}`

    const isAudio = /\.(mp3|wav|ogg|flac|m4a|aac)$/i.test(filename) ||
      /audio|sound/i.test(combined)
    const isVideo = /\.(mp4|webm|mov|mkv|avi)$/i.test(filename) ||
      /video|movie/i.test(combined)
    const isImage = /\.(png|jpe?g|webp|gif)$/i.test(filename) ||
      /image|photo|picture/i.test(combined)
    const isGenericFile = /\.(json|txt|csv|zip|bin)$/i.test(filename) ||
      /file|metadata/i.test(combined)

    switch (category) {
      case ClapSegmentCategory.VIDEO:
        if (isVideo) return 100
        if (isImage) return 40
        if (isAudio) return 10
        return isGenericFile ? 1 : 20

      case ClapSegmentCategory.DIALOGUE:
      case ClapSegmentCategory.SOUND:
      case ClapSegmentCategory.MUSIC:
        if (isAudio) return 100
        if (isVideo) return 20
        if (isImage) return 10
        return isGenericFile ? 1 : 15

      case ClapSegmentCategory.IMAGE:
      default:
        if (isImage) return 100
        if (isVideo) return 40
        if (isAudio) return 10
        return isGenericFile ? 1 : 20
    }
  }

  return assets
    .map((asset, index) => ({
      asset,
      index,
      score: score(asset),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .at(0)?.asset
}

function validateWorkflowBindings(clapWorkflow: ClapWorkflow) {
  const needsPrompt = [
    ClapWorkflowCategory.IMAGE_GENERATION,
    ClapWorkflowCategory.VOICE_GENERATION,
    ClapWorkflowCategory.SOUND_GENERATION,
    ClapWorkflowCategory.MUSIC_GENERATION,
  ].includes(clapWorkflow.category)

  if (
    needsPrompt &&
    !clapWorkflow.inputValues?.[ClapperComfyUiInputIds.PROMPT]
  ) {
    throw new Error(
      `This workflow doesn't seem to have a prompt input required by Clapper. Please map @clapper/prompt to the ComfyUI prompt input.`
    )
  }
}

function applyWorkflowDefaults(
  workflowGraph: ComfyUIWorkflowApiGraph,
  clapWorkflow: ClapWorkflow
) {
  flattenInputFields(clapWorkflow.inputFields).forEach((inputField) => {
    if (isClapperReservedInput(inputField.id)) return
    const value = normalizeComfyUiPromptValue(
      clapWorkflow.inputValues?.[inputField.id] ?? inputField.defaultValue
    )
    workflowGraph.setInputValue(inputField.id, value, { ignoreErrors: true })
  })
}

function getMappedInputId(
  clapWorkflow: ClapWorkflow,
  inputId: ClapperComfyUiInputIds
): string {
  const mappedInput = clapWorkflow.inputValues?.[inputId]

  if (typeof mappedInput === 'string') {
    return mappedInput
  }

  if (mappedInput && typeof mappedInput === 'object' && 'id' in mappedInput) {
    return `${mappedInput.id}`
  }

  return ''
}

async function applyMainInputs({
  workflowGraph,
  clapWorkflow,
  request,
  client,
}: {
  workflowGraph: ComfyUIWorkflowApiGraph
  clapWorkflow: ClapWorkflow
  request: ResolveRequest
  client: ComfyUiClient
}) {
  const mainInputs = await getMainInputs(request, client)

  for (const [mainInputId, value] of mainInputs) {
    const mappedInput = clapWorkflow.inputValues?.[
      mainInputId
    ] as ClapInputValueObject

    const mappedInputId =
      typeof mappedInput?.id === 'string' ? mappedInput.id : ''

    if (!mappedInputId || mappedInputId === ClapperComfyUiInputIds.NULL) {
      continue
    }

    workflowGraph.setInputValue(mappedInputId, value, { ignoreErrors: true })
  }
}

async function getMainInputs(
  request: ResolveRequest,
  client: ComfyUiClient
): Promise<MainInput[]> {
  const seed = generateSeed()
  const shared: MainInput[] = [
    [ClapperComfyUiInputIds.WIDTH, request.meta.width],
    [ClapperComfyUiInputIds.HEIGHT, request.meta.height],
    [ClapperComfyUiInputIds.SEED, seed],
  ]

  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.image.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.image.negative,
        ],
        ...shared,
      ]
    case ClapSegmentCategory.VIDEO: {
      const image = await prepareImageInput(request.prompts.video.image, client)
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.image.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.image.negative,
        ],
        [ClapperComfyUiInputIds.IMAGE, image],
        ...shared,
      ]
    }
    case ClapSegmentCategory.DIALOGUE:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.voice.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.voice.negative,
        ],
        ...shared,
      ]
    case ClapSegmentCategory.SOUND:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.audio.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.audio.negative,
        ],
        ...shared,
      ]
    case ClapSegmentCategory.MUSIC:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.music.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.music.negative,
        ],
        ...shared,
      ]
    default:
      return shared
  }
}

async function prepareImageInput(
  image: string,
  client: ComfyUiClient
): Promise<string> {
  if (!image) return ''
  if (!image.startsWith('data:')) return image
  return client.uploadImage({
    dataUri: image,
  })
}

function flattenInputFields(inputFields: ClapInputField[]): ClapInputField[] {
  return inputFields.flatMap((inputField: any) => [
    inputField,
    ...(Array.isArray(inputField.inputFields)
      ? flattenInputFields(inputField.inputFields)
      : []),
  ])
}

function isClapperReservedInput(inputId: string): boolean {
  return Object.values(ClapperComfyUiInputIds).includes(
    inputId as ClapperComfyUiInputIds
  )
}
