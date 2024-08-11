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

// you can find this list here: https://docs.anthropic.com/en/docs/models-overview
export const anthropicWorkflows: ClapWorkflow[] = [
  {
    id: 'anthropic://claude-3.5-20240620',
    label: 'Claude 3.5 (Sonnet)',
    description: '',
    tags: ['Claude', 'Sonnet'],
    author: 'Anthropic',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.ANTHROPIC,
    data: 'claude-3-5-sonnet-20240620',
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
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.ANTHROPIC,
    data: 'claude-3-opus-20240229',
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
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.ANTHROPIC,
    data: 'claude-3-haiku-20240307',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
]
