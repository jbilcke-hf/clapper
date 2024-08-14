import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

import { genericImage, genericPrompt } from '../common/defaultValues'
import { text_to_image_demo_workflow } from '../common/comfyui/text_to_image_demo_workflow'
import { getComfyWorkflow } from './getComfyWorkflow'
import { useSettings } from '@/services'

// some predefined workflows (later we will add some option to customize this)
export const comfyuiWorkflows: ClapWorkflow[] = [
  {
    id: 'comfyui://text_to_image_demo_workflow',
    label: "WIP DEMO (DOESN'T WORK)",
    description: '',
    tags: [],
    author: '',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
    provider: ClapWorkflowProvider.COMFYUI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: JSON.stringify(text_to_image_demo_workflow),
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
]

// this define dynamic comfyui workflow
//
// a dynamic workflow can come from a 3rd party website, a database,
// the local storage
//
// note: we should be careful because there is a 10 Mb for the local storage,
// I think.
// so users should not put too much stuff in here
export async function getDynamicComfyuiWorkflows(): Promise<ClapWorkflow[]> {
  const settings = useSettings.getState()

  const workflows: ClapWorkflow[] = [
    {
      id: 'comfyui://settings.comfyWorkflowForImage',
      label: 'Custom Image Workflow',
      description: 'Custom ComfyUI workflow to generate images',
      tags: ['custom', 'image generation'],
      author: 'You',
      thumbnailUrl: '',
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.IMAGE_GENERATION,
      data: settings.comfyWorkflowForImage,
      inputFields: [genericPrompt],
      inputValues: {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForVideo',
      label: 'Custom Video Workflow',
      description: 'Custom ComfyUI workflow to generate videos',
      tags: ['custom', 'video generation'],
      author: 'You',
      thumbnailUrl: '',
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.VIDEO_GENERATION,
      data: settings.comfyWorkflowForVideo,
      inputFields: [genericImage],
      inputValues: {
        [genericImage.id]: genericImage.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForVoice',
      label: 'Custom Voice Workflow',
      description: 'Custom ComfyUI workflow to generate voice',
      tags: ['custom', 'voice generation'],
      author: 'You',
      thumbnailUrl: '',
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.VOICE_GENERATION,
      data: settings.comfyWorkflowForVoice,
      inputFields: [genericPrompt],
      inputValues: {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForMusic',
      label: 'Custom Music Workflow',
      description: 'Custom ComfyUI workflow to generate music',
      tags: ['custom', 'music generation'],
      author: 'You',
      thumbnailUrl: '',
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.MUSIC_GENERATION,
      data: settings.comfyWorkflowForMusic,
      inputFields: [genericPrompt],
      inputValues: {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForSound',
      label: 'Custom Sound Workflow',
      description: 'Custom ComfyUI workflow to generate sound',
      tags: ['custom', 'sound generation'],
      author: 'You',
      thumbnailUrl: '',
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.SOUND_GENERATION,
      data: settings.comfyWorkflowForSound,
      inputFields: [genericPrompt],
      inputValues: {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
  ]

  return workflows
}
