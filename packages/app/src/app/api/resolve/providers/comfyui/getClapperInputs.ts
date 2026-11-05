import {
  ClapInputValues,
  ClapSegmentCategory,
  ClapWorkflow,
  generateSeed,
} from '@aitube/clap'
import { ClapInputValueObject } from '@aitube/clap/dist/types'
import { ResolveRequest } from '@aitube/clapper-services'

import { ClapperComfyUiInputIds } from './types'
import { getMainInputsFromComfyUiWorkflow } from './getMainInputsFromComfyUiWorkflow'

/**
 * Tells which node of the workflow is the prompt, the output etc.
 *
 * Workflows saved from the image and video settings already know it.
 * For the others (voice, sound, music) the user pastes a raw workflow,
 * so we look for those nodes inside the workflow itself.
 */
export function getMainInputs(clapWorkflow: ClapWorkflow): ClapInputValues {
  if (clapWorkflow.inputValues?.[ClapperComfyUiInputIds.OUTPUT]) {
    return clapWorkflow.inputValues
  }

  return getMainInputsFromComfyUiWorkflow(
    clapWorkflow.data,
    clapWorkflow.category
  ).inputValues
}

/**
 * What Clapper wants to put in the workflow, as [workflow input id, value]
 * pairs. Works for image, video, voice, sound and music segments.
 */
export function getClapperInputs(
  request: ResolveRequest,
  mainInputs: ClapInputValues
): [string, string | number][] {
  const { prompts, meta, segment } = request

  const promptsByCategory: Partial<
    Record<ClapSegmentCategory, { positive?: string; negative?: string }>
  > = {
    [ClapSegmentCategory.IMAGE]: prompts.image,
    [ClapSegmentCategory.VIDEO]: prompts.image,
    [ClapSegmentCategory.DIALOGUE]: prompts.voice,
    [ClapSegmentCategory.SOUND]: prompts.audio,
    [ClapSegmentCategory.MUSIC]: prompts.music,
  }

  const { positive, negative } = promptsByCategory[segment.category] || {}

  const isVisual =
    segment.category === ClapSegmentCategory.IMAGE ||
    segment.category === ClapSegmentCategory.VIDEO

  const wanted: [ClapperComfyUiInputIds, string | number | undefined][] = [
    [ClapperComfyUiInputIds.PROMPT, positive],
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT, negative],
    [ClapperComfyUiInputIds.SEED, generateSeed()],
  ]

  if (isVisual) {
    wanted.push(
      [ClapperComfyUiInputIds.WIDTH, meta.width],
      [ClapperComfyUiInputIds.HEIGHT, meta.height]
    )
  }

  // the image to animate, without its "data:image/...;base64," header
  if (prompts.video.image) {
    wanted.push([
      ClapperComfyUiInputIds.IMAGE,
      prompts.video.image.split(';base64,')[1],
    ])
  }

  const result: [string, string | number][] = []

  for (const [key, value] of wanted) {
    const inputId = (mainInputs[key] as ClapInputValueObject | undefined)
      ?.id as string | undefined

    if (
      inputId &&
      inputId !== ClapperComfyUiInputIds.NULL &&
      value !== undefined
    ) {
      result.push([inputId, value])
    }
  }

  return result
}
