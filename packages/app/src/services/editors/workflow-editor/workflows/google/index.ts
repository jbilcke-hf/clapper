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

// you can find the list here: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versioning
// The auto-updated version of a Gemini model points to the most recent stable version
// google supports claude so you can also see the ids specific to Vertex AI here:
// https://docs.anthropic.com/en/docs/models-overview
export const googleWorkflows: ClapWorkflow[] = [
  {
    id: 'google://gemini-1.5-flash-001',
    label: 'Gemini 1.5 flash (001)',
    description: '',
    tags: ['Gemini', 'flash'],
    author: 'Google (GCP Vertex AI)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'gemini-1.5-flash-001',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'google://gemini-1.5-pro-001',
    label: 'Gemini 1.5 pro (001)',
    description: '',
    tags: ['Gemini', 'pro'],
    author: 'Google (GCP Vertex AI)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'gemini-1.5-pro-001',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'google://gemini-1.0-vision-001',
    label: 'Gemini 1.0 vision (001)',
    description: '',
    tags: ['Gemini', 'vision'],
    author: 'Google (GCP Vertex AI)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'gemini-1.0-vision-001',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'google://gemini-1.0-pro-002',
    label: 'Gemini 1.0 pro (002)',
    description: '',
    tags: ['Gemini', 'vision'],
    author: 'Google (GCP Vertex AI)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'gemini-1.0-pro-002',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'google://claude-3.5-20240620',
    label: 'Claude 3.5 (Sonnet)',
    description: '',
    tags: ['Claude', 'Sonnet'],
    author: 'Google (GCP Vertex AI)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'claude-3-5-sonnet@20240620',
    schema: '',
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'claude-3-opus@20240229',
    schema: '',
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.ASSISTANT,
    provider: ClapWorkflowProvider.GOOGLE,
    data: 'claude-3-haiku@20240307',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
]
