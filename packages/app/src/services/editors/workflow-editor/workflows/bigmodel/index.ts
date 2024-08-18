import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { genericImage, genericImageUrl } from '../common/defaultValues'

export const bigModelWorkflows: ClapWorkflow[] = [
  {
    id: 'bigmodel://api/paas/v4/cogvideox',
    label: 'CogVideoX',
    description: '',
    tags: ['video'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.BIGMODEL,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'cogvideox', // <- "code" of the model, see: https://bigmodel.cn/dev/api#cogvideox
    schema: '',
    inputFields: [genericImageUrl],
    inputValues: {
      [genericImageUrl.id]: genericImageUrl.defaultValue,
    },
  },
]
