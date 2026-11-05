import { ResolveRequest } from '@aitube/clapper-services'
import { ClapAssetSource, ClapWorkflowCategory } from '@aitube/clap'
import { ClapInputValueObject } from '@aitube/clap/dist/types'

import { TimelineSegment } from '@aitube/timeline'

import { BasicCredentials, CallWrapper, ComfyApi } from '@saintno/comfyui-sdk'

import { decodeOutput } from '@/lib/utils/decodeOutput'
import { getSegmentWorkflowProviderAndEngine } from '@/services/editors/workflow-editor/getSegmentWorkflowProviderAndEngine'
import { ClapperComfyUiInputIds } from './types'
import { createPromptBuilder } from './createPromptBuilder'
import { ComfyUIWorkflowApiGraph } from './graph'
import { getClapperInputs, getMainInputs } from './getClapperInputs'
import { getOutputFiles } from './getOutputFiles'

/**
 * Runs the ComfyUI workflow of the current segment category
 * (image, video, voice, sound or music) on a local or remote ComfyUI server.
 */
export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyUiClientId) {
    throw new Error(`Missing client id for "ComfyUI"`)
  }

  const category = request.segment.category

  const { generationWorkflow: clapWorkflow } =
    getSegmentWorkflowProviderAndEngine(request)

  if (!clapWorkflow) {
    throw new Error(
      `Clapper doesn't support ${category} generation for provider "ComfyUI". Please open a pull request with (working code) to solve this!`
    )
  }

  if (
    !ComfyUIWorkflowApiGraph.isValidWorkflow(clapWorkflow.data) ||
    ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data).getNodes().length ===
      0
  ) {
    throw new Error(
      `There is no valid ComfyUI workflow for ${category}. Please paste a workflow (in API format) in the settings.`
    )
  }

  const mainInputs = getMainInputs(clapWorkflow)

  if (!mainInputs[ClapperComfyUiInputIds.OUTPUT]) {
    throw new Error(
      `This workflow doesn't seem to have a node output required by Clapper (e.g. a 'Save Image' node)`
    )
  }

  // video workflows only need an image to animate
  if (
    clapWorkflow.category !== ClapWorkflowCategory.VIDEO_GENERATION &&
    !mainInputs[ClapperComfyUiInputIds.PROMPT]
  ) {
    throw new Error(
      `This workflow doesn't seem to have an input required by Clapper (e.g. a node with an input called "prompt"). You can also set the value of a text input to "${ClapperComfyUiInputIds.PROMPT}" to tell Clapper where to put the prompt.`
    )
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

  // Put the prompts, size, seed etc. of the segment in the workflow.
  // Careful: a PromptBuilder is immutable, each call returns a new builder.
  const comfyApiWorkflowPromptBuilder = getClapperInputs(request, mainInputs)
    .reduce(
      (builder, [inputId, value]) => builder.input(inputId, value),
      createPromptBuilder(ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data))
    )
    .setOutputNode(
      ClapperComfyUiInputIds.OUTPUT,
      (mainInputs[ClapperComfyUiInputIds.OUTPUT] as ClapInputValueObject)
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

  // an image, a video or an audio file, depending on the workflow
  const assetPath = getOutputFiles(rawOutput[ClapperComfyUiInputIds.OUTPUT])
    .map((file) => api.getPathImage(file))
    .at(0)

  if (!assetPath) {
    throw new Error(`failed to run the pipeline (no ${category} file)`)
  }

  console.log(`assetPath:`, assetPath)

  segment.assetUrl = await decodeOutput(assetPath)
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}
