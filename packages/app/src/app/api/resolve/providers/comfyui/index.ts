import { ResolveRequest } from '@aitube/clapper-services'
import { ClapAssetSource } from '@aitube/clap'

import { TimelineSegment } from '@aitube/timeline'

import { BasicCredentials, CallWrapper, ComfyApi } from '@saintno/comfyui-sdk'

import { decodeOutput } from '@/lib/utils/decodeOutput'
import {
  configureComfyWorkflow,
  createConfiguredPromptBuilder,
  getComfyOutputAssetPaths,
  getComfyWorkflowForSegment,
} from './runtime'

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

  const clapWorkflow = getComfyWorkflowForSegment(request)
  const configuredWorkflow = configureComfyWorkflow(request, clapWorkflow)

  const pipeline = new CallWrapper(
    api,
    createConfiguredPromptBuilder(configuredWorkflow)
  )
    .onPending(() => console.log('Task is pending'))
    .onStart(() => console.log('Task is started'))
    .onPreview((blob) => console.log(blob))
    .onFinished(() => {
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

  const assetPaths = getComfyOutputAssetPaths(rawOutput, {
    outputNodeId: configuredWorkflow.outputNodeId,
    toLocalPath: (asset) => api.getPathImage(asset),
  })

  console.log(`assetPaths:`, assetPaths)

  const assetPath = assetPaths.at(0)
  if (!assetPath) {
    throw new Error(`failed to run the pipeline (no output asset)`)
  }

  // TODO: check what the imagePath looks like exactly
  const assetUrl = await decodeOutput(assetPath)

  console.log(`assetUrl:`, assetPath)
  segment.assetUrl = assetUrl
  segment.assetSourceType = ClapAssetSource.DATA

  // TODO:

  return segment
}
