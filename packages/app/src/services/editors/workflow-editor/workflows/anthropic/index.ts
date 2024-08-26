import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'

import {
  genericHeight1024,
  genericHeight2048,
  genericImage,
  genericPrompt,
  genericVideo,
  genericWidth1024,
  genericWidth2048,
} from '../common/defaultValues'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------

// you can find this list here: https://docs.anthropic.com/en/docs/models-overview
export const anthropicWorkflows: ClapWorkflow[] = [
  {
    id: 'anthropic://claude-3.5-20240620',
    label: 'Claude 3.5 (Sonnet)',
    description: '',
    tags: ['Claude', 'Sonnet'],
    author: 'Anthropic',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.ANTHROPIC,
    data: 'claude-3-5-sonnet-20240620',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'anthropic://claude-3-opus-20240229',
    label: 'Claude 3 (Opus)',
    description: '',
    tags: ['Claude', 'Opus'],
    author: 'Anthropic',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.ANTHROPIC,
    data: 'claude-3-opus-20240229',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'anthropic://claude-3-haiku-20240307',
    label: 'Claude 3 (Haiku)',
    description: '',
    tags: ['Claude', 'Haiku'],
    author: 'Anthropic',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.ANTHROPIC,
    data: 'claude-3-haiku-20240307',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
]
