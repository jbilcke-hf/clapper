import unionBy from 'lodash/unionBy'

import { ClapperComfyUiInputIds, ComfyUiWorkflowApiNodeInput } from './types'
import { ComfyUIWorkflowApiGraph } from './graph'

/**
 * Shortcut methods to query Clapper related data from a workflow
 * @param workflow
 * @returns
 */
export function findPromptInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(positive).*/i,
      type: 'string',
    }),
    workflow.findInput({
      name: /.*(text|prompt).*/i,
      type: 'string',
      nodeOutputToNodeInput: /.*positive.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/prompt.*/i.test(value),
    }),
    'id'
  )
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
      value: (value) => /.*\@clapper\/prompt_negative.*/i.test(value),
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
      value: (value) => /.*\@clapper\/width.*/i.test(value),
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
      value: (value) => /.*\@clapper\/height.*/i.test(value),
    }),
    'id'
  )
}

export function findSeedInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(seed).*/i,
      type: 'number',
    }),
    workflow.findInput({
      type: 'number',
      nodeOutputToNodeInput: /.*seed.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/seed.*/i.test(value),
    }),
    'id'
  )
}

export function findImageInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      value: (value) => /.*\@clapper\/image.*/i.test(value),
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
