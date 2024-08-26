import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { genericImage, genericImageUrl } from '../common/defaultValues'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
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
