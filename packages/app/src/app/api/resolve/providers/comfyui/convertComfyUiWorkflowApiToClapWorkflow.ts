import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { getInputsFromComfyUiWorkflow } from './getInputsFromComfyUiWorkflow'

export function convertComfyUiWorkflowApiToClapWorkflow(
  workflowString: string,
  category: ClapWorkflowCategory = ClapWorkflowCategory.IMAGE_GENERATION
): ClapWorkflow {
  const { inputFields, inputValues } = getInputsFromComfyUiWorkflow(
    workflowString,
    category
  )
  const name =
    (
      {
        [ClapWorkflowCategory.IMAGE_GENERATION]: 'Image',
        [ClapWorkflowCategory.VIDEO_GENERATION]: 'Video',
        [ClapWorkflowCategory.VOICE_GENERATION]: 'Voice',
        [ClapWorkflowCategory.SOUND_GENERATION]: 'Sound',
        [ClapWorkflowCategory.MUSIC_GENERATION]: 'Music',
      } as Partial<Record<ClapWorkflowCategory, string>>
    )[category] || 'Media'
  return {
    id: `comfyui://settings.comfyWorkflowFor${name}`,
    label: `Custom ${name} Workflow`,
    description: `Custom ComfyUI workflow to generate ${name.toLowerCase()}`,
    tags: ['custom', `${name.toLowerCase()} generation`],
    author: 'You',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
    provider: ClapWorkflowProvider.COMFYUI,
    category,
    data: workflowString,
    schema: '',
    inputFields,
    inputValues,
  }
}

/** Accept legacy raw graph settings and newer saved graph + input/output mappings. */
export function readConfiguredComfyWorkflow(
  value: string,
  category: ClapWorkflowCategory
): ClapWorkflow | undefined {
  try {
    const saved = JSON.parse(value)
    const converted = convertComfyUiWorkflowApiToClapWorkflow(
      typeof saved.data === 'string' ? saved.data : value,
      category
    )
    if (
      typeof saved.data === 'string' &&
      saved.inputValues &&
      typeof saved.inputValues === 'object'
    ) {
      converted.inputValues = { ...converted.inputValues, ...saved.inputValues }
    }
    return converted
  } catch {
    return undefined
  }
}
