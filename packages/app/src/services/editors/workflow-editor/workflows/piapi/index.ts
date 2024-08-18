import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { genericImageUrl, genericPrompt } from '../common/defaultValues'

export const piApiWorkflows: ClapWorkflow[] = [
  {
    id: 'piapi://Midjourney/Imagine',
    label: 'Midjourne Imagine',
    description: '',
    tags: ['Midjourney'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.PIAPI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'mj/v2/imagine', // <- this value isn't really used, it's just to put something here
    schema: '',
    inputFields: [
      genericPrompt,
      // genericRatio
      //genericWidth1024,
      //genericHeight1024,
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      // genericRatio
      //[genericWidth1024.id]: genericWidth1024.defaultValue,
      //[genericHeight1024.id]: genericHeight1024.defaultValue,
    },
  },
  {
    id: 'piapi://LumaLabs/DreamMachine',
    label: 'Luma Labs Dream Machine',
    description: '',
    tags: ['Dream Machine'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.PIAPI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'luma/v1/video', // <- this value isn't really used, it's just to put something here
    schema: '',
    inputFields: [
      genericImageUrl,
      // genericRatio
      //genericWidth1024,
      //genericHeight1024,
    ],
    inputValues: {
      [genericImageUrl.id]: genericImageUrl.defaultValue,
      // genericRatio
      //[genericWidth1024.id]: genericWidth1024.defaultValue,
      //[genericHeight1024.id]: genericHeight1024.defaultValue,
    },
  },
]
