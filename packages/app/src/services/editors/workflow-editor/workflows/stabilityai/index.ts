import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'

import {
  genericHeight1024,
  genericImage,
  genericPrompt,
  genericWidth1024,
  genericWidth2048,
} from '../common/defaultValues'

export const stabilityaiWorkflows: ClapWorkflow[] = [
  {
    id: 'stabilityai://image-to-video',
    label: 'Image To Video',
    description: '',
    tags: ['SVD'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.STABILITYAI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'image-to-video',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [genericImage],
    inputValues: {
      image: genericPrompt.defaultValue,
    },
  },
  {
    id: 'stabilityai://stable-image/generate/ultra',
    label: 'Stable Image Ultra',
    description: '',
    tags: ['SD', 'Ultra'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.STABILITYAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'stable-image/generate/ultra',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'stabilityai://stable-image/generate/core',
    label: 'Stable Image Core',
    description: '',
    tags: ['SD', 'Core'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.STABILITYAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'stable-image/generate/core',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'stabilityai://stable-image/generate/sd3',
    label: 'Stable Diffusion 3',
    description: '',
    tags: ['SD', 'SD3'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.STABILITYAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'stable-image/generate/sd3',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
]
