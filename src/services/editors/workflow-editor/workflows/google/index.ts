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
export const googleWorkflows: ClapWorkflow[] = [
  {
    id: 'google://claude-3.5-20240620',
    label: 'Claude 3.5 (Sonnet)',
    description: '',
    tags: ['Claude', 'Sonnet'],
    author: 'Google (GCP Vertex AI)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'claude-3-5-sonnet@20240620',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'google://claude-3-opus@20240229',
    label: 'Claude 3 (Opus)',
    description: '',
    tags: ['Claude', 'Opus'],
    author: 'Google (GCP Vertex AI)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'claude-3-opus@20240229',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'google://claude-3-haiku@20240307',
    label: 'Claude 3 (Haiku)',
    description: '',
    tags: ['Claude', 'Haiku'],
    author: 'Google (GCP Vertex AI)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'claude-3-haiku@20240307',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
]
