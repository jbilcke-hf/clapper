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

  const workflowByCategory: Partial<Record<ClapSegmentCategory, ClapWorkflow>> = {
    [ClapSegmentCategory.IMAGE]: request.settings.imageGenerationWorkflow,
    [ClapSegmentCategory.VIDEO]: request.settings.videoGenerationWorkflow,
    [ClapSegmentCategory.DIALOGUE]: request.settings.voiceGenerationWorkflow,
    [ClapSegmentCategory.SOUND]: request.settings.soundGenerationWorkflow,
    [ClapSegmentCategory.MUSIC]: request.settings.musicGenerationWorkflow,
  }

  const clapWorkflow = workflowByCategory[request.segment.category]

  if (!clapWorkflow) {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "ComfyUI". Please open a pull request with (working code) to solve this!`
    )
  }

  const isVisualCategory = [
    ClapSegmentCategory.IMAGE,
    ClapSegmentCategory.VIDEO,
  ].includes(request.segment.category)

  const isAudioCategory = [
    ClapSegmentCategory.DIALOGUE,
    ClapSegmentCategory.SOUND,
    ClapSegmentCategory.MUSIC,
  ].includes(request.segment.category)

  if (!clapWorkflow.inputValues[ClapperComfyUiInputIds.PROMPT]) {
    throw new Error(
      `This workflow doesn't seem to have an input required by Clapper (e.g. a node with an input called "prompt")`
    )
  }

  if (
    isVisualCategory &&
    ClapperComfyUiInputIds.NEGATIVE_PROMPT in clapWorkflow.inputValues &&
    !clapWorkflow.inputValues[ClapperComfyUiInputIds.NEGATIVE_PROMPT]
  ) {
    throw new Error(
      `This visual workflow declares a "negative prompt" input required by Clapper (e.g. a node with an input called "negative_prompt") but it is not properly mapped`
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

  // Build main inputs based on segment category
  const segmentCategory = request.segment?.category

  let promptText: string
  let negativePromptText: string

  switch (segmentCategory) {
    case ClapSegmentCategory.DIALOGUE:
      promptText =
        request.prompts.voice?.positive || request.prompts.image.positive
      negativePromptText =
        request.prompts.voice?.negative ?? request.prompts.image.negative
      break
    case ClapSegmentCategory.SOUND:
      promptText =
        request.prompts.audio?.positive ||
        request.prompts.voice?.positive ||
        request.prompts.image.positive
      negativePromptText =
        request.prompts.audio?.negative ??
        request.prompts.voice?.negative ??
        request.prompts.image.negative
      break
    case ClapSegmentCategory.MUSIC:
      promptText =
        request.prompts.music?.positive ||
        request.prompts.audio?.positive ||
        request.prompts.voice?.positive ||
        request.prompts.image.positive
      negativePromptText =
        request.prompts.music?.negative ??
        request.prompts.audio?.negative ??
        request.prompts.voice?.negative ??
        request.prompts.image.negative
      break
    default:
      // Visual or other categories default to image prompts
      promptText = request.prompts.image.positive
      negativePromptText = request.prompts.image.negative
      break
  }

  const mainInputs: [string, any][] = [
    [ClapperComfyUiInputIds.PROMPT, promptText],
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT, negativePromptText],
    [ClapperComfyUiInputIds.SEED, generateSeed()],
  ]

  if (isVisualCategory) {
    mainInputs.push(
      [ClapperComfyUiInputIds.WIDTH, request.meta.width],
      [ClapperComfyUiInputIds.HEIGHT, request.meta.height],
      [
        ClapperComfyUiInputIds.IMAGE,
        request.prompts.video?.image?.split(';base64,')?.[1],
      ],
    )
  }

  mainInputs.forEach((mainInput) => {
    const val = inputValues[mainInput[0]]
    const valObj = typeof val === 'object' && val !== null && !Array.isArray(val)
      ? (val as ClapInputValueObject)
      : undefined
    if (valObj?.id && valObj.id !== ClapperComfyUiInputIds.NULL) {
      comfyApiWorkflowPromptBuilder.input(valObj.id, mainInput[1])
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

  const getAssetPaths = (rawOutput: any) => {
    const outputData = rawOutput[ClapperComfyUiInputIds.OUTPUT]
    if (clapWorkflow.category === ClapWorkflowCategory.VIDEO_GENERATION) {
      const assets =
        outputData?.videos ??
        outputData?.gifs ??
        outputData?.images ??
        []
      return assets.map((asset: any) => api.getPathImage(asset))
    } else if (isAudioCategory) {
      // Audio workflows may output via audio or images nodes
      const assets =
        outputData?.audio ??
        outputData?.files ??
        outputData?.images ??
        []
      return assets.map((asset: any) => api.getPathImage(asset))
    } else {
      const images = outputData?.images ?? []
      return images.map((img: any) => api.getPathImage(img))
    }
  }
  const assetPaths = getAssetPaths(rawOutput)

  console.log(`assetPaths:`, assetPaths)

  const assetPath = assetPaths.at(0)
  if (!assetPath) {
    throw new Error(`failed to run the pipeline (no asset output)`)
  }

  const assetUrl = await decodeOutput(assetPath)

  console.log(`assetUrl:`, assetPath)
  segment.assetUrl = assetUrl
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}
