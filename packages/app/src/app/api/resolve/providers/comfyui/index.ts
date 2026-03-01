import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  ClapWorkflow,
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
 * Get the appropriate ClapWorkflow for a given segment category
 */
function getWorkflowForCategory(
  request: ResolveRequest
): ClapWorkflow | null {
  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      return request.settings.imageGenerationWorkflow
    case ClapSegmentCategory.VIDEO:
      return request.settings.videoGenerationWorkflow
    case ClapSegmentCategory.VOICE:
      return request.settings.voiceGenerationWorkflow
    case ClapSegmentCategory.SOUND:
      return request.settings.soundGenerationWorkflow
    case ClapSegmentCategory.MUSIC:
      return request.settings.musicGenerationWorkflow
    default:
      return null
  }
}

/**
 * Get the prompt text for a given segment category
 */
function getPromptForCategory(request: ResolveRequest): {
  positive: string
  negative: string
} {
  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      return {
        positive: request.prompts.image.positive,
        negative: request.prompts.image.negative,
      }
    case ClapSegmentCategory.VIDEO:
      return {
        positive: request.prompts.image.positive,
        negative: request.prompts.image.negative,
      }
    case ClapSegmentCategory.VOICE:
      return {
        positive: request.prompts.voice.positive,
        negative: request.prompts.voice.negative,
      }
    case ClapSegmentCategory.SOUND:
      return {
        positive: request.prompts.audio.positive,
        negative: request.prompts.audio.negative,
      }
    case ClapSegmentCategory.MUSIC:
      return {
        positive: request.prompts.music.positive,
        negative: request.prompts.music.negative,
      }
    default:
      return { positive: '', negative: '' }
  }
}

/**
 * Extract asset paths from ComfyUI output based on workflow category
 */
function getAssetPaths(
  rawOutput: any,
  clapWorkflow: ClapWorkflow,
  api: ComfyApi
): string[] {
  const outputData = rawOutput[ClapperComfyUiInputIds.OUTPUT]
  if (!outputData) return []

  switch (clapWorkflow.category) {
    case ClapWorkflowCategory.VIDEO_GENERATION:
      return (
        outputData.videos ||
        outputData.gifs ||
        outputData.images ||
        []
      ).map((asset: any) => api.getPathImage(asset))

    case ClapWorkflowCategory.VOICE_GENERATION:
    case ClapWorkflowCategory.SOUND_GENERATION:
    case ClapWorkflowCategory.MUSIC_GENERATION:
      // Audio outputs can come as audio files or generic files
      return (
        outputData.audio ||
        outputData.files ||
        outputData.images || // some nodes save audio as "images" output
        []
      ).map((asset: any) => api.getPathImage(asset))

    case ClapWorkflowCategory.IMAGE_GENERATION:
    default:
      return (outputData.images || []).map((img: any) =>
        api.getPathImage(img)
      )
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

  // for API doc please see:
  // https://github.com/tctien342/comfyui-sdk/blob/main/examples/example-t2i.ts
  const api = new ComfyApi(
    request.settings.comfyUiApiUrl || 'http://localhost:8188',
    request.settings.comfyUiClientId,

    // HTTP Auth is optional
    // also in the future, we might support other things (bearer tokens?)
    request.settings.comfyUiHttpAuthLogin
      ? {
          credentials,
        }
      : undefined
  ).init()

  const clapWorkflow = getWorkflowForCategory(request)

  if (!clapWorkflow || !clapWorkflow.data) {
    throw new Error(
      `No ComfyUI workflow configured for ${request.segment.category} generation. ` +
      `Please configure a workflow in Settings > ${request.segment.category}.`
    )
  }

  const prompts = getPromptForCategory(request)

  // For image generation, a prompt input is required
  if (
    clapWorkflow.category === ClapWorkflowCategory.IMAGE_GENERATION &&
    !clapWorkflow.inputValues[ClapperComfyUiInputIds.PROMPT]
  ) {
    throw new Error(
      `This workflow doesn't seem to have an input required by Clapper (e.g. a node with an input called "prompt")`
    )
  }

  if (!clapWorkflow.inputValues[ClapperComfyUiInputIds.OUTPUT]) {
    throw new Error(
      `This workflow doesn't seem to have a node output required by Clapper (e.g. a 'Save Image' or 'Save Audio' node)`
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
    [ClapperComfyUiInputIds.PROMPT, prompts.positive],
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT, prompts.negative],
    [ClapperComfyUiInputIds.WIDTH, request.meta.width],
    [ClapperComfyUiInputIds.HEIGHT, request.meta.height],
    [ClapperComfyUiInputIds.SEED, generateSeed()],
    [
      ClapperComfyUiInputIds.IMAGE,
      request.prompts.video?.image?.split(';base64,')?.[1] || '',
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
    .onPending(() => console.log('Task is pending'))
    .onStart(() => console.log('Task is started'))
    .onPreview((blob) => console.log(blob))
    .onFinished((data) => {
      console.log('Pipeline finished')
    })
    .onProgress((info) =>
      console.log('Processing node', info.node, `${info.value}/${info.max}`)
    )
    .onFailed((err) => console.log('Task is failed', err))

  const rawOutput = await pipeline.run()

  if (!rawOutput) {
    throw new Error(`failed to run the pipeline (no output)`)
  }

  const assetPaths = getAssetPaths(rawOutput, clapWorkflow, api)

  console.log(`assetPaths:`, assetPaths)

  const assetPath = assetPaths.at(0)
  if (!assetPath) {
    throw new Error(`failed to run the pipeline (no output asset)`)
  }

  const assetUrl = await decodeOutput(assetPath)

  console.log(`assetUrl:`, assetPath)
  segment.assetUrl = assetUrl
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}
