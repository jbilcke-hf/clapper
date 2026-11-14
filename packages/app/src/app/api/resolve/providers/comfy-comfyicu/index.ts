import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { ComfyIcuApiRequestRunWorkflow } from './types'
import {
  fetchComfyIcuRun,
  isComfyIcuRunComplete,
  pollComfyIcuRun,
} from './runLifecycle'

type ComfyWorkflowNode = {
  inputs?: Record<string, unknown>
  [key: string]: unknown
}

type ComfyWorkflowGraph = Record<string, ComfyWorkflowNode>

/**
 * Comfy.icu workflow field IDs are not always serialized in the same shape.
 * Support explicit API paths (nodeId.inputs.field) and the simple input names
 * exposed by Comfy.icu. Never silently submit a workflow if the selected
 * Clapper value could not be injected.
 */
function setWorkflowInput(
  graph: ComfyWorkflowGraph,
  fieldId: string,
  value: unknown
): boolean {
  const parts = fieldId.split('.')

  if (parts.length >= 3 && parts[1] === 'inputs') {
    const node = graph[parts[0]]
    const inputName = parts.slice(2).join('.')
    if (node?.inputs && inputName in node.inputs) {
      node.inputs[inputName] = value
      return true
    }
  }

  if (parts.length >= 2 && graph[parts[0]]?.inputs) {
    const inputName = parts.slice(1).join('.')
    const node = graph[parts[0]]
    if (node?.inputs && inputName in node.inputs) {
      node.inputs[inputName] = value
      return true
    }
  }

  for (const node of Object.values(graph)) {
    if (node.inputs && Object.prototype.hasOwnProperty.call(node.inputs, fieldId)) {
      node.inputs[fieldId] = value
      return true
    }
  }

  return false
}

function getPromptField(inputFields: Array<{ id: string; type?: string }>) {
  return (
    inputFields.find((field) => field.id.toLowerCase() === 'prompt') ||
    inputFields.find((field) => field.id.toLowerCase().includes('prompt')) ||
    inputFields.find((field) => field.type === 'string')
  )
}

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
  const promptField = getPromptField(inputFields)

  if (!promptField) {
    throw new Error('This Comfy.icu workflow does not expose a prompt input field')
  }

  let graph: ComfyWorkflowGraph
  try {
    graph = JSON.parse(workflow.data) as ComfyWorkflowGraph
  } catch {
    throw new Error('The configured Comfy.icu workflow is not valid JSON')
  }

  if (!graph || typeof graph !== 'object' || Array.isArray(graph)) {
    throw new Error('The configured Comfy.icu workflow is not a valid node graph')
  }

  // Apply saved workflow values and defaults before overriding the prompt.
  const { workflowDefaultValues, workflowValues } =
    getWorkflowInputValues(workflow)

  for (const [fieldId, value] of Object.entries({
    ...workflowDefaultValues,
    ...workflowValues,
  })) {
    if (value !== undefined) setWorkflowInput(graph, fieldId, value)
  }

  if (!setWorkflowInput(graph, promptField.id, request.prompts.image.positive)) {
    throw new Error(
      `Could not map Comfy.icu prompt field "${promptField.id}" to a workflow node input`
    )
  }

  const payload: ComfyIcuApiRequestRunWorkflow = {
    workflow_id: workflowId,
    prompt: JSON.stringify(graph),
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
  segment.status = ClapSegmentStatus.COMPLETED

  return segment
}
