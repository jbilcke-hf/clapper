import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  ClapWorkflowCategory,
  generateSeed,
} from '@aitube/clap'
import { ClapInputValueObject } from '@aitube/clap/dist/types'

import { TimelineSegment } from '@aitube/timeline'

import { BasicCredentials, CallWrapper, ComfyApi } from '@saintno/comfyui-sdk'

import { decodeOutput } from '@/lib/utils/decodeOutput'
import { ClapperComfyUiInputIds } from './types'
import { createPromptBuilder } from './createPromptBuilder'
import { ComfyUIWorkflowApiGraph } from './graph'

/**
 * Map a ClapSegmentCategory to the appropriate ClapWorkflowCategory
 * for looking up the correct workflow from settings.
 */
function getWorkflowCategoryForSegment(
  category: ClapSegmentCategory
): ClapWorkflowCategory {
  switch (category) {
    case ClapSegmentCategory.IMAGE:
      return ClapWorkflowCategory.IMAGE_GENERATION
    case ClapSegmentCategory.VIDEO:
      return ClapWorkflowCategory.VIDEO_GENERATION
    case ClapSegmentCategory.SOUND:
      return ClapWorkflowCategory.SOUND_GENERATION
    case ClapSegmentCategory.VOICE:
    case ClapSegmentCategory.DIALOGUE:
      return ClapWorkflowCategory.VOICE_GENERATION
    case ClapSegmentCategory.MUSIC:
      return ClapWorkflowCategory.MUSIC_GENERATION
    default:
      return ClapWorkflowCategory.IMAGE_GENERATION
  }
}

/**
 * Map a ClapSegmentCategory to the appropriate settings key for the workflow.
 */
function getWorkflowForSegment(
  request: ResolveRequest,
  category: ClapSegmentCategory
) {
  switch (category) {
    case ClapSegmentCategory.IMAGE:
      return request.settings.imageGenerationWorkflow
    case ClapSegmentCategory.VIDEO:
      return request.settings.videoGenerationWorkflow
    case ClapSegmentCategory.SOUND:
      return request.settings.soundGenerationWorkflow
    case ClapSegmentCategory.VOICE:
    case ClapSegmentCategory.DIALOGUE:
      return request.settings.voiceGenerationWorkflow
    case ClapSegmentCategory.MUSIC:
      return request.settings.musicGenerationWorkflow
    default:
      return request.settings.imageGenerationWorkflow
  }
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyUiClientId) {
    throw new Error(`Missing client id for "ComfyUI"`)
  }

  const segment: TimelineSegment = { ...request.segment }

  const credentials: BasicCredentials = {
    type: 'basic',
    username: request.settings.comfyUiHttpAuthLogin,
    password: request.settings.comfyUiHttpAuthPassword,
  }

  // Initialize the ComfyApi client
  // For API docs see: https://github.com/tctien342/comfyui-sdk
  const api = new ComfyApi(
    request.settings.comfyUiApiUrl || 'http://localhost:8188',
    request.settings.comfyUiClientId,

    // HTTP Auth is optional
    request.settings.comfyUiHttpAuthLogin
      ? {
          credentials,
        }
      : undefined
  ).init()

  // Get the workflow for this segment category
  const clapWorkflow = getWorkflowForSegment(request, request.segment.category)

  if (!clapWorkflow?.data) {
    throw new Error(
      `No ComfyUI workflow configured for segment category "${request.segment.category}". Please configure one in the settings.`
    )
  }

  if (
    !clapWorkflow.inputValues[ClapperComfyUiInputIds.PROMPT] &&
    [
      ClapSegmentCategory.IMAGE,
      ClapSegmentCategory.VIDEO,
    ].includes(request.segment.category)
  ) {
    // Prompt is not strictly required for all workflows (e.g. some might use only
    // image inputs), so we log a warning instead of throwing.
    console.warn(
      `This workflow doesn't seem to have an input explicitly marked for "prompt". Generation may still work if the prompt is wired differently.`
    )
  }

  if (!clapWorkflow.inputValues[ClapperComfyUiInputIds.OUTPUT]) {
    throw new Error(
      `This workflow doesn't seem to have a node output required by Clapper (e.g. a 'Save Image' node or similar output node). Please ensure an output node is configured.`
    )
  }

  const comfyApiWorkflowPromptBuilder = createPromptBuilder(
    ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data)
  )

  const { inputFields, inputValues } = clapWorkflow

  inputFields.forEach((inputField) => {
    comfyApiWorkflowPromptBuilder.input(
      inputField.id,
      inputValues[inputField.id]
    )
  })

  const mainInputs = [
    [ClapperComfyUiInputIds.PROMPT, request.prompts.image.positive],
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT, request.prompts.image.negative],
    [ClapperComfyUiInputIds.WIDTH, request.meta.width],
    [ClapperComfyUiInputIds.HEIGHT, request.meta.height],
    [ClapperComfyUiInputIds.SEED, generateSeed()],
    [
      ClapperComfyUiInputIds.IMAGE,
      request.prompts.video.image.split(';base64,')?.[1],
    ],
  ]

  mainInputs.forEach((mainInput) => {
    if (
      inputValues[mainInput[0]]?.id &&
      inputValues[mainInput[0]]?.id != ClapperComfyUiInputIds.NULL
    ) {
      comfyApiWorkflowPromptBuilder.input(
        inputValues[mainInput[0]]?.id,
        mainInput[1]
      )
    }
  })

  // Set output
  comfyApiWorkflowPromptBuilder.setOutputNode(
    ClapperComfyUiInputIds.OUTPUT,
    (inputValues[ClapperComfyUiInputIds.OUTPUT] as ClapInputValueObject)
      .id as string
  )

  const pipeline = new CallWrapper(api, comfyApiWorkflowPromptBuilder)
    .onPending(() => console.log('ComfyUI task is pending'))
    .onStart(() => console.log('ComfyUI task is started'))
    .onPreview((blob) => {
      // Can be used for live preview in the future
      console.log('ComfyUI preview received', blob)
    })
    .onFinished((data) => {
      console.log('ComfyUI pipeline finished')
    })
    .onProgress((info) =>
      console.log('ComfyUI processing node', info.node, `${info.value}/${info.max}`)
    )
    .onFailed((err) => console.log('ComfyUI task is failed', err))

  const rawOutput = await pipeline.run()

  if (!rawOutput) {
    throw new Error(`Failed to run the pipeline (no output)`)
  }

  const getAssetPaths = (rawOutput: any) => {
    if (clapWorkflow.category === ClapWorkflowCategory.VIDEO_GENERATION) {
      const output = rawOutput[ClapperComfyUiInputIds.OUTPUT]
      return (
        output?.videos ||
        output?.gifs ||
        output?.images ||
        []
      ).map((asset: any) => api.getPathImage(asset))
    } else {
      return (rawOutput[ClapperComfyUiInputIds.OUTPUT]?.images || []).map(
        (img: any) => api.getPathImage(img)
      )
    }
  }

  const assetPaths = getAssetPaths(rawOutput)

  if (!assetPaths.length) {
    throw new Error(`Failed to run the pipeline (no output assets)`)
  }

  const assetPath = assetPaths[0]
  const assetUrl = await decodeOutput(assetPath)

  segment.assetUrl = assetUrl
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}
