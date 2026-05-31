import { ClapWorkflowCategory } from '@aitube/clap'

import { ClapperComfyUiInputIds } from './types'

export const getMainInputIdsByClapWorkflowCategory = (
  category: ClapWorkflowCategory
) => {
  switch (category) {
    case ClapWorkflowCategory.VIDEO_GENERATION: {
      return [
        ClapperComfyUiInputIds.PROMPT,
        ClapperComfyUiInputIds.NEGATIVE_PROMPT,
        ClapperComfyUiInputIds.IMAGE,
        ClapperComfyUiInputIds.AUDIO,
        ClapperComfyUiInputIds.VIDEO,
        ClapperComfyUiInputIds.WIDTH,
        ClapperComfyUiInputIds.HEIGHT,
        ClapperComfyUiInputIds.SEED,
        ClapperComfyUiInputIds.OUTPUT,
      ]
    }
    case ClapWorkflowCategory.VOICE_GENERATION: {
      return [
        ClapperComfyUiInputIds.PROMPT,
        ClapperComfyUiInputIds.NEGATIVE_PROMPT,
        ClapperComfyUiInputIds.AUDIO,
        ClapperComfyUiInputIds.SEED,
        ClapperComfyUiInputIds.OUTPUT,
      ]
    }
    case ClapWorkflowCategory.SOUND_GENERATION:
    case ClapWorkflowCategory.MUSIC_GENERATION: {
      return [
        ClapperComfyUiInputIds.PROMPT,
        ClapperComfyUiInputIds.NEGATIVE_PROMPT,
        ClapperComfyUiInputIds.AUDIO,
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
