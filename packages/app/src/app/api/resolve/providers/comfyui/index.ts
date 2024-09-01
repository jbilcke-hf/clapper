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

  if (
    [ClapSegmentCategory.IMAGE, ClapSegmentCategory.VIDEO].includes(
      request.segment.category
    )
  ) {
    const clapWorkflow = {
      [ClapSegmentCategory.IMAGE]: request.settings.imageGenerationWorkflow,
      [ClapSegmentCategory.VIDEO]: request.settings.videoGenerationWorkflow,
    }[request.segment.category]

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
        `This workflow doesn't seem to have a node output required by Clapper (e.g. a 'Save Image' node)`
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

    const getAssetPaths = (rawOutput) => {
      if (clapWorkflow.category == ClapWorkflowCategory.VIDEO_GENERATION) {
        return (
          rawOutput[ClapperComfyUiInputIds.OUTPUT]?.videos ||
          rawOutput[ClapperComfyUiInputIds.OUTPUT]?.gifs ||
          rawOutput[ClapperComfyUiInputIds.OUTPUT]?.images
        ).map((asset: any) => api.getPathImage(asset))
      } else {
        return rawOutput[ClapperComfyUiInputIds.OUTPUT]?.images.map(
          (img: any) => api.getPathImage(img)
        )
      }
    }
    const assetPaths = getAssetPaths(rawOutput)

    console.log(`assetPaths:`, assetPaths)

    const assetPath = assetPaths.at(0)
    if (!assetPath) {
      throw new Error(`failed to run the pipeline (no image)`)
    }

    // TODO: check what the imagePath looks like exactly
    const assetUrl = await decodeOutput(assetPath)

    console.log(`assetUrl:`, assetPath)
    segment.assetUrl = assetUrl
    segment.assetSourceType = ClapAssetSource.DATA

    // TODO:
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "ComfyUI". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
