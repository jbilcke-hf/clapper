import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  generateSeed,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { BasicCredentials, CallWrapper, ComfyApi } from '@saintno/comfyui-sdk'
import { decodeOutput } from '@/lib/utils/decodeOutput'
import {
  ClapperComfyUiInputIds,
  ComfyUIWorkflowApiGraph,
  createPromptBuilder,
} from './utils'

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

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
    const imageGenerationWorkflow = request.settings.imageGenerationWorkflow

    if (!imageGenerationWorkflow.inputValues[ClapperComfyUiInputIds.PROMPT]) {
      throw new Error(
        `This workflow doesn't seem to have an input required by Clapper (e.g. a node with an input called "prompt")`
      )
    }

    if (!imageGenerationWorkflow.inputValues[ClapperComfyUiInputIds.OUTPUT]) {
      throw new Error(
        `This workflow doesn't seem to have a node output required by Clapper (e.g. a 'Save Image' node)`
      )
    }

    const comfyApiWorkflowPromptBuilder = createPromptBuilder(
      ComfyUIWorkflowApiGraph.fromString(imageGenerationWorkflow.data)
    )

    const { inputFields, inputValues } =
      request.settings.imageGenerationWorkflow

    inputFields.forEach((inputField) => {
      comfyApiWorkflowPromptBuilder.input(
        inputField.id,
        inputValues[inputField.id]
      )
    })

    // Set main inputs
    comfyApiWorkflowPromptBuilder
      .input(
        (inputValues[ClapperComfyUiInputIds.PROMPT] as any).id,
        request.prompts.image.positive
      )
      .input(
        (inputValues[ClapperComfyUiInputIds.NEGATIVE_PROMPT] as any).id,
        request.prompts.image.negative
      )
      .input(
        (inputValues[ClapperComfyUiInputIds.WIDTH] as any).id,
        request.meta.width
      )
      .input(
        (inputValues[ClapperComfyUiInputIds.HEIGHT] as any).id,
        request.meta.height
      )
      .input(
        (inputValues[ClapperComfyUiInputIds.SEED] as any).id,
        generateSeed()
      )

    // Set output
    comfyApiWorkflowPromptBuilder.setOutputNode(
      ClapperComfyUiInputIds.OUTPUT,
      (inputValues[ClapperComfyUiInputIds.OUTPUT] as any).id
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

    const imagePaths = rawOutput[ClapperComfyUiInputIds.OUTPUT]?.images.map(
      (img: any) => api.getPathImage(img)
    )

    console.log(`imagePaths:`, imagePaths)

    const imagePath = imagePaths.at(0)
    if (!imagePath) {
      throw new Error(`failed to run the pipeline (no image)`)
    }

    // TODO: check what the imagePath looks like exactly
    const assetUrl = await decodeOutput(imagePath)

    console.log(`assetUrl:`, imagePaths)
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
