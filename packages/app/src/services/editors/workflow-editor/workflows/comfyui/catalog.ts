import { ClapWorkflowCategory } from '@aitube/clap'

import { text_to_image_demo_workflow } from '../common/comfyui/text_to_image_demo_workflow'
import { defaultWorkflowForImages } from '@/services/settings/workflows/image'
import { defaultWorkflowForVideos } from '@/services/settings/workflows/video'

export type ComfyUiCommunityWorkflow = {
  id: string
  label: string
  description: string
  category: ClapWorkflowCategory
  sourceLabel: string
  sourceUrl: string
  tags: string[]
  workflow: string
}

export const comfyUiCommunityWorkflows: ComfyUiCommunityWorkflow[] = [
  {
    id: 'clapper-default-image-sdxl-flash',
    label: 'SDXL Flash image workflow',
    description:
      'Bundled API-format text-to-image workflow with prompt, negative prompt, width, height, seed, and SaveImage mappings.',
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    sourceLabel: 'Clapper bundled workflow',
    sourceUrl:
      'https://github.com/jbilcke-hf/clapper/tree/main/packages/app/src/services/settings/workflows/image.ts',
    tags: ['image', 'sdxl', 'local', 'cloud'],
    workflow: defaultWorkflowForImages.data,
  },
  {
    id: 'comfyui-default-text-to-image-demo',
    label: 'ComfyUI API text-to-image demo',
    description:
      'Small default ComfyUI API graph useful for checking local workflow mapping and graph preview.',
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    sourceLabel: 'ComfyUI API-format sample',
    sourceUrl:
      'https://github.com/jbilcke-hf/clapper/tree/main/packages/app/src/services/editors/workflow-editor/workflows/common/comfyui/text_to_image_demo_workflow.ts',
    tags: ['image', 'demo', 'local'],
    workflow: JSON.stringify(text_to_image_demo_workflow),
  },
  {
    id: 'clapper-default-video-svd',
    label: 'SVD image-to-video workflow',
    description:
      'Bundled API-format image-to-video workflow with image upload, dimensions, seed, and video output mappings.',
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    sourceLabel: 'Clapper bundled workflow',
    sourceUrl:
      'https://github.com/jbilcke-hf/clapper/tree/main/packages/app/src/services/settings/workflows/video.ts',
    tags: ['video', 'svd', 'image-to-video', 'local', 'cloud'],
    workflow: defaultWorkflowForVideos.data,
  },
]

export function getComfyUiCommunityWorkflows(
  category: ClapWorkflowCategory
): ComfyUiCommunityWorkflow[] {
  return comfyUiCommunityWorkflows.filter(
    (workflow) => workflow.category === category
  )
}
