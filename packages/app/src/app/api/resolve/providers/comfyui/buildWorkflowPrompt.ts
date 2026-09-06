import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapInputField,
  ClapSegmentCategory,
  ClapWorkflow,
  generateSeed,
} from '@aitube/clap'
import { ClapInputValueObject } from '@aitube/clap/dist/types'

import { ComfyUIWorkflowApiGraph } from './graph'
import { ClapperComfyUiInputIds } from './types'
import { normalizeComfyUiPromptValue } from './client'

export function buildComfyUiWorkflowPrompt({
  request,
  clapWorkflow,
}: {
  request: ResolveRequest
  clapWorkflow: ClapWorkflow
}): Record<string, unknown> {
  const workflowGraph = ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data)

  applyWorkflowDefaults(workflowGraph, clapWorkflow)
  applyMainInputs({
    workflowGraph,
    clapWorkflow,
    request,
  })

  return workflowGraph.toJson()
}

export function getMappedComfyUiInputId(
  clapWorkflow: ClapWorkflow,
  inputId: ClapperComfyUiInputIds
): string {
  const mappedInput = clapWorkflow.inputValues?.[inputId]

  if (typeof mappedInput === 'string') {
    return mappedInput
  }

  if (mappedInput && typeof mappedInput === 'object' && 'id' in mappedInput) {
    return `${mappedInput.id}`
  }

  return ''
}

function applyWorkflowDefaults(
  workflowGraph: ComfyUIWorkflowApiGraph,
  clapWorkflow: ClapWorkflow
) {
  flattenInputFields(clapWorkflow.inputFields).forEach((inputField) => {
    if (isClapperReservedInput(inputField.id)) return
    const value = normalizeComfyUiPromptValue(
      clapWorkflow.inputValues?.[inputField.id] ?? inputField.defaultValue
    )
    workflowGraph.setInputValue(inputField.id, value, { ignoreErrors: true })
  })
}

function applyMainInputs({
  workflowGraph,
  clapWorkflow,
  request,
}: {
  workflowGraph: ComfyUIWorkflowApiGraph
  clapWorkflow: ClapWorkflow
  request: ResolveRequest
}) {
  const mainInputs = getMainInputs(request)

  for (const [mainInputId, value] of mainInputs) {
    const mappedInput = clapWorkflow.inputValues?.[
      mainInputId
    ] as ClapInputValueObject
    const mappedInputId =
      typeof mappedInput?.id === 'string' ? mappedInput.id : ''

    if (!mappedInputId || mappedInputId === ClapperComfyUiInputIds.NULL) {
      continue
    }

    workflowGraph.setInputValue(mappedInputId, value, { ignoreErrors: true })
  }
}

function getMainInputs(
  request: ResolveRequest
): [ClapperComfyUiInputIds, unknown][] {
  const seed = generateSeed()
  const shared: [ClapperComfyUiInputIds, unknown][] = [
    [ClapperComfyUiInputIds.WIDTH, request.meta.width],
    [ClapperComfyUiInputIds.HEIGHT, request.meta.height],
    [ClapperComfyUiInputIds.SEED, seed],
  ]

  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.image.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.image.negative,
        ],
        ...shared,
      ]
    case ClapSegmentCategory.VIDEO:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.image.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.image.negative,
        ],
        [ClapperComfyUiInputIds.IMAGE, request.prompts.video.image],
        ...shared,
      ]
    case ClapSegmentCategory.DIALOGUE:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.voice.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.voice.negative,
        ],
        ...shared,
      ]
    case ClapSegmentCategory.SOUND:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.audio.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.audio.negative,
        ],
        ...shared,
      ]
    case ClapSegmentCategory.MUSIC:
      return [
        [ClapperComfyUiInputIds.PROMPT, request.prompts.music.positive],
        [
          ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          request.prompts.music.negative,
        ],
        ...shared,
      ]
    default:
      return shared
  }
}

function flattenInputFields(inputFields: ClapInputField[]): ClapInputField[] {
  return inputFields.flatMap((inputField: any) => [
    inputField,
    ...(Array.isArray(inputField.inputFields)
      ? flattenInputFields(inputField.inputFields)
      : []),
  ])
}

function isClapperReservedInput(inputId: string): boolean {
  return Object.values(ClapperComfyUiInputIds).includes(
    inputId as ClapperComfyUiInputIds
  )
}
