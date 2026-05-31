import { ResolveRequest } from '@aitube/clapper-services'
import { ClapWorkflow } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'

import {
  getComfyOutputAssetPaths,
  getComfyWorkflowForSegment,
  getMainComfyInputValues,
} from '../comfyui/runtime'
import { ClapperComfyUiInputIds } from '../comfyui/types'

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

type ComfyDeployRunResponse = {
  id?: string
  run_id?: string
  runId?: string
  status?: string
  live_status?: string
  message?: string
  error?: string
  outputs?: unknown[]
  output?: unknown
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyDeployApiKey) {
    throw new Error(`Missing API key for "ComfyDeploy"`)
  }

  const segment: TimelineSegment = { ...request.segment }
  const clapWorkflow = getComfyWorkflowForSegment(request)
  const deploymentId = getWorkflowId(clapWorkflow.id, 'comfydeploy')

  if (!deploymentId) {
    throw new Error(`The ComfyDeploy deployment ID is missing`)
  }

  const queuedRun = await queueComfyDeployRun(
    request.settings.comfyDeployApiKey,
    deploymentId,
    getComfyDeployInputs(request, clapWorkflow)
  )
  const runId = queuedRun.run_id || queuedRun.runId || queuedRun.id

  if (!runId) {
    throw new Error(`ComfyDeploy did not return a run ID`)
  }

  const completedRun = isCompleteStatus(
    queuedRun.status || queuedRun.live_status
  )
    ? queuedRun
    : await pollComfyDeployRun(request.settings.comfyDeployApiKey, runId)

  const assetPaths = getComfyOutputAssetPaths(completedRun)
  const assetPath = assetPaths.at(0)

  if (!assetPath) {
    throw new Error(`ComfyDeploy completed without returning an output asset`)
  }

  segment.assetUrl = assetPath

  return segment
}

function getComfyDeployInputs(
  request: ResolveRequest,
  clapWorkflow: ClapWorkflow
) {
  const inputs: Record<string, unknown> = {}

  Object.entries(clapWorkflow.inputValues || {}).forEach(
    ([inputId, inputValue]) => {
      if (inputId.startsWith('@clapper/')) return
      if (isNodeInputSelection(inputValue)) return
      inputs[inputId] = inputValue
    }
  )

  const mainInputValues = getMainComfyInputValues(request)
  const aliases: Partial<Record<ClapperComfyUiInputIds, string[]>> = {
    [ClapperComfyUiInputIds.PROMPT]: ['prompt'],
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT]: ['negative_prompt'],
    [ClapperComfyUiInputIds.WIDTH]: ['width'],
    [ClapperComfyUiInputIds.HEIGHT]: ['height'],
    [ClapperComfyUiInputIds.SEED]: ['seed'],
    [ClapperComfyUiInputIds.IMAGE]: ['image'],
    [ClapperComfyUiInputIds.AUDIO]: ['audio'],
    [ClapperComfyUiInputIds.VIDEO]: ['video'],
  }

  Object.entries(aliases).forEach(([mainInputId, inputNames]) => {
    const value = mainInputValues[mainInputId]
    if (value === undefined || value === null || value === '') return
    inputNames?.forEach((inputName) => {
      if (inputs[inputName] === undefined) {
        inputs[inputName] = value
      }
    })
  })

  return inputs
}

async function queueComfyDeployRun(
  apiKey: string,
  deploymentId: string,
  inputs: Record<string, unknown>
): Promise<ComfyDeployRunResponse> {
  const response = await fetch(
    'https://api.comfydeploy.com/api/run/deployment/queue',
    {
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
    }
  )

  return parseComfyDeployResponse(response)
}

async function pollComfyDeployRun(
  apiKey: string,
  runId: string,
  timeoutMs = RUN_TIMEOUT_MS
): Promise<ComfyDeployRunResponse> {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    await sleep(RUN_POLL_INTERVAL_MS)

    const response = await fetch(
      `https://api.comfydeploy.com/api/run/${runId}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        method: 'GET',
      }
    )
    const run = await parseComfyDeployResponse(response)
    const status = run.status || run.live_status

    if (isCompleteStatus(status)) {
      return run
    }

    if (isFailedStatus(status)) {
      throw new Error(run.message || run.error || `ComfyDeploy run failed`)
    }
  }

  throw new Error(`Timed out waiting for ComfyDeploy run ${runId}`)
}

async function parseComfyDeployResponse(
  response: Response
): Promise<ComfyDeployRunResponse> {
  const json = (await response.json()) as ComfyDeployRunResponse

  if (!response.ok || isFailedStatus(json.status || json.live_status)) {
    throw new Error(json.message || json.error || `ComfyDeploy request failed`)
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

function isNodeInputSelection(value: unknown): value is { id?: string } {
  return !!value && typeof value === 'object' && 'id' in value
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
