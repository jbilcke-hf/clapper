import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
  ClapInputCategory,
} from '@aitube/clap'

import {
  genericAspectRatio,
  genericAudio,
  genericBaseImageUrl,
  genericDrivingVideo,
  genericFaceImage,
  genericGuidanceScale,
  genericHeight1024,
  genericHeight2048,
  genericIdWeight,
  genericImage,
  genericImageUrl,
  genericInferenceSteps,
  genericKeyframes,
  genericLora,
  genericNegativePrompt,
  genericPrompt,
  genericReferenceImages,
  genericSeed,
  genericStartStep,
  genericSwapImage,
  genericSwapImageUrl,
  genericTargetImage,
  genericTrueCFG,
  genericVideo,
  genericWidth1024,
  genericWidth2048,
} from '../common/defaultValues'
import { sampleDrivingVideo } from '@/lib/core/constants'

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
    data: '',
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
