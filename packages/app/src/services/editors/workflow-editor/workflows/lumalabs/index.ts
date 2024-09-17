import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'

import {
  genericAspectRatio,
  genericKeyframes,
  genericPrompt,
} from '../common/defaultValues'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const lumalabsWorkflows: ClapWorkflow[] = [
  {
    id: 'lumalabs://dream-machine/v1',
    label: 'Dream Machine',
    description: '',
    tags: ['LumaLabs', 'Dream Machine'],
    author: 'Luma Labs (https://lumalabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.LUMALABS,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'dream-machine/v1',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
     */
    inputFields: [genericPrompt, genericAspectRatio, genericKeyframes],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericAspectRatio.id]: genericAspectRatio.defaultValue,
      [genericKeyframes.id]: genericKeyframes.defaultValue,
    },
  },
]
