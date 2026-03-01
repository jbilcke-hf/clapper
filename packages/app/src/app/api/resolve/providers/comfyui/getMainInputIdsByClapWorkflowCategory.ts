import { ClapWorkflowCategory } from '@aitube/clap'

import { ClapperComfyUiInputIds } from './types'

export const getMainInputIdsByClapWorkflowCategory = (
  category: ClapWorkflowCategory
) => {
  switch (category) {
    case ClapWorkflowCategory.VIDEO_GENERATION: {
      return [
        ClapperComfyUiInputIds.IMAGE,
        ClapperComfyUiInputIds.WIDTH,
        ClapperComfyUiInputIds.HEIGHT,
        ClapperComfyUiInputIds.SEED,
        ClapperComfyUiInputIds.OUTPUT,
      ]
    }
    case ClapWorkflowCategory.VOICE_GENERATION:
    case ClapWorkflowCategory.SOUND_GENERATION:
    case ClapWorkflowCategory.MUSIC_GENERATION: {
      // Audio workflows primarily need prompt and seed, not image dimensions
      return [
        ClapperComfyUiInputIds.PROMPT,
        ClapperComfyUiInputIds.NEGATIVE_PROMPT,
        ClapperComfyUiInputIds.SEED,
        ClapperComfyUiInputIds.OUTPUT,
      ]
    }
    default: {
      return [
        ClapperComfyUiInputIds.PROMPT,
        ClapperComfyUiInputIds.NEGATIVE_PROMPT,
        ClapperComfyUiInputIds.WIDTH,
        ClapperComfyUiInputIds.HEIGHT,
        ClapperComfyUiInputIds.SEED,
        ClapperComfyUiInputIds.OUTPUT,
      ]
    }
  }
}
