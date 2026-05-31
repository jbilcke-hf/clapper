import { ResolveRequest } from '@aitube/clapper-services'
import { TimelineSegment } from '@aitube/timeline'

import {
  configureComfyWorkflow,
  getComfyOutputAssetPaths,
  getComfyWorkflowForSegment,
} from '../comfyui/runtime'
import { ComfyIcuApiRequestRunWorkflow, ComfyIcuApiRunResponse } from './types'

const RUN_POLL_INTERVAL_MS = 2_000
const RUN_TIMEOUT_MS = 4 * 60_000

const COMPLETE_STATUSES = new Set([
  'complete',
  'completed',
  'success',
  'succeeded',
  'done',
])

const FAILED_STATUSES = new Set([
  'error',
  'failed',
  'failure',
  'cancelled',
  'canceled',
])

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  const segment: TimelineSegment = { ...request.segment }
  const clapWorkflow = getComfyWorkflowForSegment(request)
  const workflowId = getWorkflowId(clapWorkflow.id, 'comfyicu')

  if (!workflowId) {
    throw new Error(`The Comfy.icu workflow ID is missing`)
  }

  const configuredWorkflow = configureComfyWorkflow(request, clapWorkflow)
  const payload: ComfyIcuApiRequestRunWorkflow = {
    workflow_id: workflowId,
    prompt: configuredWorkflow.workflowGraph.toString(),
    files: {},
  }

  const run = await postComfyIcuRun(
    request.settings.comfyIcuApiKey,
    workflowId,
    payload
  )
  const runId = run.run_id || run.id

  if (!runId) {
    throw new Error(`Comfy.icu did not return a run ID`)
  }

  const completedRun = isCompleteStatus(run.status)
    ? run
    : await pollComfyIcuRun(request.settings.comfyIcuApiKey, workflowId, runId)

  const assetPaths = getComfyOutputAssetPaths(completedRun, {
    outputNodeId: configuredWorkflow.outputNodeId,
  })

  const assetPath = assetPaths.at(0)
  if (!assetPath) {
    throw new Error(`Comfy.icu completed without returning an output asset`)
  }

  segment.assetUrl = assetPath

  return segment
}

async function postComfyIcuRun(
  apiKey: string,
  workflowId: string,
  payload: ComfyIcuApiRequestRunWorkflow
): Promise<ComfyIcuApiRunResponse> {
  const response = await fetch(
    `https://comfy.icu/api/v1/workflows/${workflowId}/runs`,
    {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      method: 'POST',
    }
  )

  return parseComfyIcuResponse(response)
}

async function pollComfyIcuRun(
  apiKey: string,
  workflowId: string,
  runId: string,
  timeoutMs = RUN_TIMEOUT_MS
): Promise<ComfyIcuApiRunResponse> {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    await sleep(RUN_POLL_INTERVAL_MS)

    const response = await fetch(
      `https://comfy.icu/api/v1/workflows/${workflowId}/runs/${runId}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        method: 'GET',
      }
    )
    const run = await parseComfyIcuResponse(response)

    if (isCompleteStatus(run.status)) {
      return run
    }

    if (isFailedStatus(run.status)) {
      throw new Error(run.message || run.error || `Comfy.icu run failed`)
    }
  }

  throw new Error(`Timed out waiting for Comfy.icu run ${runId}`)
}

async function parseComfyIcuResponse(
  response: Response
): Promise<ComfyIcuApiRunResponse> {
  const json = (await response.json()) as ComfyIcuApiRunResponse

  if (!response.ok || isFailedStatus(json.status)) {
    throw new Error(json.message || json.error || `Comfy.icu request failed`)
  }

  return json
}

function getWorkflowId(workflowId: string, expectedProvider: string): string {
  const [provider, id] = workflowId.split('://')
  return provider === expectedProvider ? id || '' : ''
}

function isCompleteStatus(status?: string): boolean {
  return !!status && COMPLETE_STATUSES.has(status.toLowerCase())
}

function isFailedStatus(status?: string): boolean {
  return !!status && FAILED_STATUSES.has(status.toLowerCase())
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
