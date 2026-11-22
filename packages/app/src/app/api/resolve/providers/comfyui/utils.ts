import unionBy from 'lodash/unionBy'

import { ClapperComfyUiInputIds, ComfyUiWorkflowApiNodeInput } from './types'
import { ComfyUIWorkflowApiGraph } from './graph'

const BLOCKED_METADATA_HOSTS = new Set([
  '169.254.169.254',
  'fd00:ec2::254',
  '[fd00:ec2::254]',
  'metadata.google.internal',
  'metadata.goog',
  '100.100.100.200',
])

/**
 * Validates and normalizes a ComfyUI server URL to prevent SSRF and protocol injection.
 */
export function validateComfyUiApiUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim()
  if (!trimmed) {
    throw new Error('ComfyUI API URL cannot be empty.')
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new Error(`Invalid ComfyUI API URL: "${trimmed}"`)
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `Unsupported protocol "${parsed.protocol}" in ComfyUI API URL. Only http: and https: are allowed.`
    )
  }

  if (parsed.username || parsed.password) {
    throw new Error(
      'Embedded credentials in ComfyUI API URL are not allowed. Use HTTP Auth settings instead.'
    )
  }

  const hostname = parsed.hostname.toLowerCase()
  if (BLOCKED_METADATA_HOSTS.has(hostname) || hostname.startsWith('169.254.')) {
    throw new Error(
      `Blocked ComfyUI API URL host "${hostname}" (cloud metadata endpoint is forbidden).`
    )
  }

  parsed.hash = ''
  const normalized = parsed.toString().replace(/\/+$/, '')
  return normalized
}

/**
 * Shortcut methods to query Clapper related data from a workflow
 * @param workflow
 * @returns
 */
export function findPromptInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  const primaryMatches = unionBy(
    workflow.findInput({
      name: /.*(positive).*/i,
      type: 'string',
    }),
    workflow.findInput({
      name: /.*(text|prompt).*/i,
      type: 'string',
      nodeOutputToNodeInput: /.*(positive|conditioning).*/i,
    }),
    workflow.findInput({
      value: (value) =>
        typeof value === 'string' && /.*\@clapper\/prompt(\b|$).*/i.test(value),
    }),
    workflow.findInput({
      name: /.*(text|prompt).*/i,
      type: 'string',
      nodeType:
        /.*(AudioGen|MusicGen|XTTS|Bark|SpeechT5|StableAudio|TTS|Voice|Music|Sound).*/i,
    }),
    'id'
  )

  if (primaryMatches.length > 0) {
    return primaryMatches
  }

  // Fallback for single-encoder or custom text nodes that aren't wired to a negative input
  const negativeIds = new Set(
    findNegativePromptInputsFromWorkflow(workflow).map((input) => input.id)
  )
  return workflow
    .findInput({
      name: /.*(text|prompt).*/i,
      type: 'string',
      nodeType: /.*(CLIPTextEncode|T5TextEncode|TextEncode|Prompt).*/i,
    })
    .filter((input) => !negativeIds.has(input.id))
}

export function findNegativePromptInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(text|prompt|negative).*/i,
      type: 'string',
      nodeOutputToNodeInput: /.*negative.*/i,
    }),
    workflow.findInput({
      name: /^negative(_prompt)?$/i,
      type: 'string',
    }),
    workflow.findInput({
      value: (value) =>
        typeof value === 'string' &&
        /.*\@clapper\/(prompt_negative|negative(\/prompt)?).*/i.test(value),
    }),
    'id'
  )
}

export function findWidthInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(width).*/i,
      type: 'number',
    }),
    workflow.findInput({
      type: 'number',
      nodeOutputToNodeInput: /.*width.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/width.*/i.test(String(value)),
    }),
    'id'
  )
}

export function findHeightInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(height).*/i,
      type: 'number',
    }),
    workflow.findInput({
      type: 'number',
      nodeOutputToNodeInput: /.*height.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/height.*/i.test(String(value)),
    }),
    'id'
  )
}

export function findSeedInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(seed|noise_seed).*/i,
      type: 'number',
    }),
    workflow.findInput({
      type: 'number',
      nodeOutputToNodeInput: /.*seed.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/seed.*/i.test(String(value)),
    }),
    'id'
  )
}

export function findImageInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      value: (value) =>
        typeof value === 'string' && /.*\@clapper\/image.*/i.test(value),
    }),
    workflow.findInput({
      nodeType: /.*LoadImageFromBase64.*/i,
      name: /.*(data|image|base64).*/i,
      type: 'string',
    }),
    workflow.findInput({
      nodeType: /^LoadImage$/i,
      name: /^image$/i,
      type: 'string',
    }),
    'id'
  )
}

export const MainClapWorkflowInputsLabels = {
  [ClapperComfyUiInputIds.PROMPT]: 'Prompt node input',
  [ClapperComfyUiInputIds.NEGATIVE_PROMPT]: 'Negative prompt node input',
  [ClapperComfyUiInputIds.WIDTH]: 'Width node input',
  [ClapperComfyUiInputIds.HEIGHT]: 'Height node input',
  [ClapperComfyUiInputIds.SEED]: 'Seed node input',
  [ClapperComfyUiInputIds.IMAGE]: 'Image node input',
  [ClapperComfyUiInputIds.OUTPUT]: 'Output node',
}
