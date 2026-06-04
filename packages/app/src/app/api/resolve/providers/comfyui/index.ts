import { ResolveRequest } from '@aitube/clapper-services'
import { ClapAssetSource, getClapAssetSourceType } from '@aitube/clap'

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
    .onPending(() => debugComfyUiRuntime('Task is pending'))
    .onStart(() => debugComfyUiRuntime('Task is started'))
    .onPreview((blob) => debugComfyUiRuntime('Preview blob', blob))
    .onFinished(() => {
      debugComfyUiRuntime('Pipeline finished')
    })
    .onProgress((info) =>
      debugComfyUiRuntime(
        'Processing node',
        info.node,
        `${info.value}/${info.max}`
      )
    )
    .onFailed((err) => debugComfyUiRuntime('Task is failed', err))

  const rawOutput = await pipeline.run()

  if (!rawOutput) {
    throw new Error(`failed to run the pipeline (no output)`)
  }

  const assetPaths = getComfyOutputAssetPaths(rawOutput, {
    outputNodeId: configuredWorkflow.outputNodeId,
    toLocalPath: (asset) => api.getPathImage(asset),
  })

  debugComfyUiRuntime('Output asset paths', assetPaths)

  const assetPath = assetPaths.at(0)
  if (!assetPath) {
    throw new Error(`failed to run the pipeline (no output asset)`)
  }

  const { assetUrl, assetSourceType } =
    await normalizeComfyUiOutputAsset(assetPath)

  debugComfyUiRuntime('Resolved output asset', assetPath)
  segment.assetUrl = assetUrl
  segment.assetSourceType = assetSourceType

  // TODO:

  return segment
}

async function normalizeComfyUiOutputAsset(assetPath: string): Promise<{
  assetUrl: string
  assetSourceType: ClapAssetSource
}> {
  const sourceType = getClapAssetSourceType(assetPath)

  if (sourceType === ClapAssetSource.REMOTE) {
    return {
      assetUrl: assetPath,
      assetSourceType: sourceType,
    }
  }

  const decodedOutput = await decodeOutput(assetPath)

  return {
    assetUrl: decodedOutput,
    assetSourceType: getClapAssetSourceType(decodedOutput),
  }
}

function debugComfyUiRuntime(...args: unknown[]) {
  if (process.env.CLAPPER_DEBUG_COMFYUI === 'true') {
    console.debug('[ComfyUI]', ...args)
  }
}
