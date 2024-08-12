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

export const openaiWorkflows: ClapWorkflow[] = [
  {
    id: 'openai://gpt-4o-mini',
    label: 'GPT-4o (mini)',
    description: '',
    tags: ['GPT-4o', 'mini'],
    author: 'OpenAI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.OPENAI,
    data: 'gpt-4o-mini',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'openai://gpt-4o',
    label: 'GPT-4o',
    description: '',
    tags: ['GPT-4o'],
    author: 'OpenAI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.OPENAI,
    data: 'gpt-4o',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'openai://gpt-4-mini',
    label: 'GPT-4 (mini)',
    description: '',
    tags: ['GPT-4', 'mini'],
    author: 'OpenAI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.OPENAI,
    data: 'gpt-4o-mini',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'openai://gpt-4-turbo',
    label: 'GPT-4 (Turbo)',
    description: '',
    tags: ['GPT-4', 'turbo'],
    author: 'OpenAI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.OPENAI,
    data: 'gpt-4-turbo',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
]