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
export const aitubeWorkflows: ClapWorkflow[] = [
  /*
  {
    id: 'aitube://api/v1/edit/storyboards',
    label: 'Storyboards',
    description: '',
    tags: ['OpenClap', 'image', 'storyboard'],
    author: 'AiTube.at',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.OPENCLAP,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    provider: ClapWorkflowProvider.AITUBE,
    data: 'api/v1/edit/storyboards',
    schema: '',
    inputFields: [genericPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,
    },
  },
  {
    id: 'aitube://api/v1/edit/music',
    label: 'Music',
    description: '',
    tags: ['OpenClap', 'music'],
    author: 'AiTube.at',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.OPENCLAP,
    category: ClapWorkflowCategory.MUSIC_GENERATION,
    provider: ClapWorkflowProvider.AITUBE,
    data: 'api/v1/edit/music',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
  */
]
