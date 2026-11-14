import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { ComfyIcuApiRequestRunWorkflow } from './types'
import {
  fetchComfyIcuRun,
  isComfyIcuRunComplete,
  pollComfyIcuRun,
} from './runLifecycle'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  if (request.segment.category !== ClapSegmentCategory.IMAGE) {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Comfy.icu" yet.`
    )
  }

  const workflow = request.settings.imageGenerationWorkflow
  const workflowId = workflow.id.split('://').pop() || ''

  if (!workflowId) {
    throw new Error('The Comfy.icu workflow ID is missing')
  }

  const inputFields = workflow.inputFields || []
  const promptField =
    inputFields.find((field) => field.id === 'prompt') ||
    inputFields.find((field) => field.id.toLowerCase().includes('prompt')) ||
    inputFields.find((field) => field.type === 'string')

  if (!promptField) {
    throw new Error(
      'This Comfy.icu workflow does not expose a prompt input field'
    )
  }

  let prompt: unknown
  try {
    prompt = JSON.parse(workflow.data)
  } catch {
    throw new Error('The configured Comfy.icu workflow is not valid JSON')
  }

  const promptPath = promptField.id.split('.')
  const promptNodeId = promptPath.shift() || ''
  if (promptPath[0] === 'inputs') promptPath.shift()
  const promptInputName = promptPath.join('.')
  const promptGraph = prompt as Record<
    string,
    { inputs?: Record<string, unknown> }
  >
  const promptNode = promptGraph[promptNodeId]

  if (!promptNode?.inputs || !promptInputName) {
    throw new Error(
      `The configured prompt field "${promptField.id}" does not match a ComfyUI API node input`
    )
  }

  promptNode.inputs[promptInputName] = request.prompts.image.positive

  const payload: ComfyIcuApiRequestRunWorkflow = {
    workflow_id: workflowId,
    prompt: JSON.stringify(promptGraph),
    files: {},
  }

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Bearer ${request.settings.comfyIcuApiKey}`,
  }

  // Never automatically retry this POST: an ambiguous timeout may still have
  // queued a billable Comfy.icu run.
  const queuedRun = await fetchComfyIcuRun(
    `https://comfy.icu/api/v1/workflows/${encodeURIComponent(workflowId)}/runs`,
    { headers, body: JSON.stringify(payload), method: 'POST' }
  )

  const runId = queuedRun.run_id || queuedRun.id
  if (!runId) {
    throw new Error('Comfy.icu did not return a run ID')
  }

  const completedRun = isComfyIcuRunComplete(queuedRun.status)
    ? queuedRun
    : await pollComfyIcuRun({
        apiKey: request.settings.comfyIcuApiKey,
        workflowId,
        runId,
      })

  const output = completedRun.output?.find(
    (asset) => asset.url || asset.thumbnail_url
  )
  const assetUrl = output?.url || output?.thumbnail_url

  if (!assetUrl) {
    throw new Error('Comfy.icu completed the run without returning an output URL')
  }

  const segment: TimelineSegment = { ...request.segment }
  segment.assetUrl = assetUrl
  segment.assetSourceType = getClapAssetSourceType(assetUrl)

  return segment
}
