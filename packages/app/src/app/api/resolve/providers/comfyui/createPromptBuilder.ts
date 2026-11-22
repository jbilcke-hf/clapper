import { PromptBuilder } from '@saintno/comfyui-sdk'
import {
  ClapMeta,
  ClapSegmentCategory,
  ClapWorkflow,
  ClapWorkflowCategory,
  generateSeed,
} from '@aitube/clap'
import { ResolveRequest, ResolveRequestPrompts } from '@aitube/clapper-services'
import { TimelineSegment } from '@aitube/timeline'

import { ClapperComfyUiInputIds, ComfyUIWorkflowApiJson } from './types'
import { ComfyUIWorkflowApiGraph } from './graph'
import { getInputsFromComfyUiWorkflow } from './getInputsFromComfyUiWorkflow'

/**
 * Takes a workflow graph and converts it to PromptBuilder
 */
export function createPromptBuilder(
  workflowApiGraph: ComfyUIWorkflowApiGraph
): PromptBuilder<any, any, any> {
  const inputs = workflowApiGraph.getInputs()
  const outputNode = workflowApiGraph.getOutputNode()

  const inputKeys = Object.values(inputs)
    .map((input) => input.id)
    .concat([
      ClapperComfyUiInputIds.PROMPT,
      ClapperComfyUiInputIds.NEGATIVE_PROMPT,
      ClapperComfyUiInputIds.WIDTH,
      ClapperComfyUiInputIds.HEIGHT,
      ClapperComfyUiInputIds.SEED,
    ])

  const promptBuilder = new PromptBuilder(
    workflowApiGraph.toJson(),
    inputKeys,
    [ClapperComfyUiInputIds.OUTPUT]
  )

  // We don't need proper names for input keys,
  // as we just use PromptBuilder for its websocket api
  inputKeys.forEach((inputKey) => {
    promptBuilder.setInputNode(inputKey, inputKey)
  })

  if (outputNode) {
    promptBuilder.setOutputNode(ClapperComfyUiInputIds.OUTPUT, outputNode.id)
  }

  return promptBuilder
}

/**
 * Populates a ComfyUI workflow graph and PromptBuilder with node overrides,
 * category-specific prompts, dimensions, seed, image input, and @clapper/* tokens.
 * Properly reassigns the immutable PromptBuilder returned by `.input()`.
 */
export function populateComfyUiWorkflow({
  clapWorkflow,
  prompts,
  segment,
  meta,
  seed,
}: {
  clapWorkflow: ClapWorkflow
  prompts: ResolveRequestPrompts
  segment?: Partial<TimelineSegment>
  meta?: Partial<ClapMeta>
  seed?: number
}): {
  promptBuilder: PromptBuilder<any, any, any>
  workflowJson: ComfyUIWorkflowApiJson
  outputNodeId: string
} {
  const graph = ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data)
  const { inputValues: detectedInputValues } = getInputsFromComfyUiWorkflow(
    clapWorkflow.data,
    clapWorkflow.category || ClapWorkflowCategory.IMAGE_GENERATION
  )

  const effectiveInputValues: Record<string, any> = {
    ...detectedInputValues,
    ...(clapWorkflow.inputValues || {}),
  }

  let promptBuilder = createPromptBuilder(graph)

  // 1. Apply all leaf node setting overrides (<nodeId>.inputs.<inputName>)
  const graphInputs = graph.getInputs()
  for (const [key, val] of Object.entries(effectiveInputValues)) {
    if (key.startsWith('@clapper/')) continue
    if (val !== null && typeof val === 'object') continue
    if (val !== undefined && graphInputs[key]) {
      graph.setInputValue(key, val, { ignoreErrors: true })
      promptBuilder.setInputNode(key, key)
      promptBuilder = promptBuilder.input(key, val)
    }
  }

  // 2. Resolve category-specific prompts and parameters
  const segCategory = segment?.category
  const wfCategory = clapWorkflow.category

  let positivePrompt = ''
  let negativePrompt = ''

  if (
    segCategory === ClapSegmentCategory.DIALOGUE ||
    wfCategory === ClapWorkflowCategory.VOICE_GENERATION
  ) {
    positivePrompt =
      prompts?.voice?.positive ||
      segment?.prompt ||
      prompts?.image?.positive ||
      ''
    negativePrompt = prompts?.voice?.negative || ''
  } else if (
    segCategory === ClapSegmentCategory.SOUND ||
    wfCategory === ClapWorkflowCategory.SOUND_GENERATION
  ) {
    positivePrompt =
      prompts?.audio?.positive ||
      segment?.prompt ||
      prompts?.image?.positive ||
      ''
    negativePrompt = prompts?.audio?.negative || ''
  } else if (
    segCategory === ClapSegmentCategory.MUSIC ||
    wfCategory === ClapWorkflowCategory.MUSIC_GENERATION
  ) {
    positivePrompt =
      prompts?.music?.positive ||
      segment?.prompt ||
      prompts?.image?.positive ||
      ''
    negativePrompt = prompts?.music?.negative || ''
  } else {
    positivePrompt = prompts?.image?.positive || segment?.prompt || ''
    negativePrompt = prompts?.image?.negative || ''
  }

  const width = meta?.width || 1024
  const height = meta?.height || 576
  const resolvedSeed = seed ?? (segment?.seed || generateSeed())
  const rawVideoImage = prompts?.video?.image || ''
  const resolvedImage = rawVideoImage.includes(';base64,')
    ? rawVideoImage.split(';base64,')[1] || ''
    : rawVideoImage

  // 3. Apply main @clapper/* mapped inputs
  const mainInputs: [ClapperComfyUiInputIds, any][] = [
    [ClapperComfyUiInputIds.PROMPT, positivePrompt],
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT, negativePrompt],
    [ClapperComfyUiInputIds.WIDTH, width],
    [ClapperComfyUiInputIds.HEIGHT, height],
    [ClapperComfyUiInputIds.SEED, resolvedSeed],
    [ClapperComfyUiInputIds.IMAGE, resolvedImage],
  ]

  for (const [mainInputId, mainValue] of mainInputs) {
    const mapping = effectiveInputValues[mainInputId] as
      | { id?: string }
      | undefined
    const targetInputKey = mapping?.id
    if (
      targetInputKey &&
      targetInputKey !== ClapperComfyUiInputIds.NULL &&
      mainValue !== undefined &&
      mainValue !== ''
    ) {
      graph.setInputValue(targetInputKey, mainValue, { ignoreErrors: true })
      promptBuilder.setInputNode(targetInputKey, targetInputKey)
      promptBuilder = promptBuilder.input(targetInputKey, mainValue)
    }
  }

  // 4. Replace any remaining inline @clapper/* tokens in string inputs
  const currentInputs = graph.getInputs()
  for (const input of Object.values(currentInputs)) {
    if (typeof input.value === 'string' && input.value.includes('@clapper/')) {
      const trimmed = input.value.trim()
      let newValue: any = input.value
      if (/^@clapper\/width$/i.test(trimmed)) {
        newValue = width
      } else if (/^@clapper\/height$/i.test(trimmed)) {
        newValue = height
      } else if (/^@clapper\/seed$/i.test(trimmed)) {
        newValue = resolvedSeed
      } else {
        newValue = input.value
          .replace(/@clapper\/prompt_negative/gi, negativePrompt)
          .replace(/@clapper\/negative\/prompt/gi, negativePrompt)
          .replace(/@clapper\/negative/gi, negativePrompt)
          .replace(/@clapper\/prompt/gi, positivePrompt)
          .replace(/@clapper\/image/gi, resolvedImage)
          .replace(/@clapper\/width/gi, String(width))
          .replace(/@clapper\/height/gi, String(height))
          .replace(/@clapper\/seed/gi, String(resolvedSeed))
      }
      graph.setInputValue(input.id, newValue, { ignoreErrors: true })
      promptBuilder.setInputNode(input.id, input.id)
      promptBuilder = promptBuilder.input(input.id, newValue)
    }
  }

  // 5. Resolve and set output node
  const configuredOutput = effectiveInputValues[
    ClapperComfyUiInputIds.OUTPUT
  ] as { id?: string } | undefined
  const outputNodeId =
    (configuredOutput?.id && configuredOutput.id !== ClapperComfyUiInputIds.NULL
      ? configuredOutput.id
      : undefined) || graph.getOutputNode()?.id

  if (!outputNodeId) {
    throw new Error(
      `This workflow doesn't seem to have a node output required by Clapper (e.g. a 'Save Image' node)`
    )
  }

  promptBuilder.setOutputNode(ClapperComfyUiInputIds.OUTPUT, outputNodeId)

  const workflowJson = graph.toJson()
  ;(promptBuilder as any).prompt = workflowJson

  return {
    promptBuilder,
    workflowJson,
    outputNodeId,
  }
}

export function buildPopulatedComfyUiWorkflow(
  clapWorkflow: ClapWorkflow,
  request: ResolveRequest,
  seed?: number
) {
  return populateComfyUiWorkflow({
    clapWorkflow,
    prompts: request.prompts,
    segment: request.segment,
    meta: request.meta,
    seed,
  })
}
