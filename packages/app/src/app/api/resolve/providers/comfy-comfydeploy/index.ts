import { ResolveRequest } from '@aitube/clapper-services'
import { ClapAssetSource } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'

import {
  extractCloudOutputUrl,
  getCloudWorkflowInputs,
  getGenerationWorkflowForSegment,
  getRunId,
  isTerminalFailureStatus,
  isTerminalSuccessStatus,
  readCloudAssetAsDataUri,
  sleep,
} from '../comfy-cloud'

const COMFY_DEPLOY_API_URL = 'https://api.comfydeploy.com/api'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyDeployApiKey) {
    throw new Error(`Missing API key for "ComfyDeploy"`)
  }

  const segment: TimelineSegment = { ...request.segment }
  const workflow = getGenerationWorkflowForSegment(request)
  const deploymentId =
    request.settings.comfyDeployDeploymentId ||
    workflow.id.split('://').pop() ||
    ''

  if (!deploymentId) {
    throw new Error(
      `Missing ComfyDeploy deployment id. Add one in provider settings or select a comfydeploy:// workflow.`
    )
  }

  const queued = await queueComfyDeployRun({
    apiKey: request.settings.comfyDeployApiKey,
    deploymentId,
    inputs: getCloudWorkflowInputs(request, workflow),
  })
  const runId = getRunId(queued)

  if (!runId) {
    throw new Error(
      `ComfyDeploy did not return a run id: ${JSON.stringify(queued)}`
    )
  }

  const result = await waitForComfyDeployRun({
    apiKey: request.settings.comfyDeployApiKey,
    runId,
  })
  const outputUrl = extractCloudOutputUrl(result)

  if (!outputUrl) {
    throw new Error(`ComfyDeploy run ${runId} finished without an output URL`)
  }

  segment.assetUrl = await readCloudAssetAsDataUri(outputUrl)
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}

async function queueComfyDeployRun({
  apiKey,
  deploymentId,
  inputs,
}: {
  apiKey: string
  deploymentId: string
  inputs: Record<string, unknown>
}): Promise<any> {
  const response = await fetch(`${COMFY_DEPLOY_API_URL}/run/deployment/queue`, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      deployment_id: deploymentId,
      inputs,
    }),
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(
      `ComfyDeploy queue failed (${response.status}): ${await response.text()}`
    )
  }

  return response.json()
}

async function waitForComfyDeployRun({
  apiKey,
  runId,
}: {
  apiKey: string
  runId: string
}): Promise<any> {
  const timeoutAt = Date.now() + 1000 * 60 * 60

  while (Date.now() < timeoutAt) {
    const response = await fetch(`${COMFY_DEPLOY_API_URL}/run/${runId}`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(
        `ComfyDeploy status failed (${response.status}): ${await response.text()}`
      )
    }

    const result = await response.json()
    const status = result.status || result.live_status || ''

    if (isTerminalFailureStatus(status)) {
      throw new Error(
        `ComfyDeploy run ${runId} failed: ${JSON.stringify(result)}`
      )
    }

    if (isTerminalSuccessStatus(status) || extractCloudOutputUrl(result)) {
      return result
    }

    await sleep(2000)
  }

  throw new Error(`Timed out waiting for ComfyDeploy run ${runId}`)
}
