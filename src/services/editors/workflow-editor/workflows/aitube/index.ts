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

export const aitubeWorkflows: ClapWorkflow[] = [
  /*
  {
    id: 'aitube://api/v1/edit/storyboards',
    label: 'Storyboards',
    description: '',
    tags: ['OpenClap', 'image', 'storyboard'],
    author: 'AiTube.at',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.OPENCLAP,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    provider: ClapWorkflowProvider.AITUBE,
    data: 'api/v1/edit/storyboards',
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
    engine: ClapWorkflowEngine.OPENCLAP,
    category: ClapWorkflowCategory.MUSIC_GENERATION,
    provider: ClapWorkflowProvider.AITUBE,
    data: 'api/v1/edit/music',
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
  */
]