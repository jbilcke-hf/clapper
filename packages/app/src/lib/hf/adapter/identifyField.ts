import { SupportedFields } from '../types'

export function identifyField(
  key: string,
  value?: any,
  index?: number
): Partial<SupportedFields> {
  const normalizedKey = key
    .toLowerCase()
    .replaceAll('_uri', '')
    .replaceAll('_url', '')
    .replaceAll('_b64', '')
    .replaceAll('_base64', '')
    .trim()
  console.log(`normalizedKey: ${normalizedKey}`)

  switch (normalizedKey) {
    case 'width':
      let strWidth = ''
      let numWidth = 0
      if (typeof value === 'string' && value.length) {
        strWidth = value
      }
      let maybeNumWidth = Number(strWidth)
      if (
        typeof maybeNumWidth === 'number' &&
        isFinite(maybeNumWidth) &&
        !isNaN(maybeNumWidth) &&
        maybeNumWidth
      ) {
        numWidth = maybeNumWidth
        return {
          hasInputWidth: true,
          inputWidth: numWidth,
        }
      } else if (strWidth) {
        return {
          hasInputWidth: true,
          inputWidth: strWidth,
        }
      } else {
        return {
          hasInputWidth: true,
          // indexInputWidth: index,
        }
      }

    case 'height':
      let strHeight = ''
      let numHeight = 0
      if (typeof value === 'string' && value.length) {
        strHeight = value
      }
      let maybeNumHeight = Number(strHeight)
      if (
        typeof maybeNumHeight === 'number' &&
        isFinite(maybeNumHeight) &&
        !isNaN(maybeNumHeight) &&
        maybeNumHeight
      ) {
        numHeight = maybeNumHeight
        return {
          hasInputHeight: true,
          inputHeight: numHeight,
        }
      } else if (strHeight) {
        return {
          hasInputHeight: true,
          inputHeight: strHeight,
        }
      } else {
        return {
          hasInputHeight: true,
          // indexInputHeight: index,
        }
      }

    case 'seed':
      let strSeed = ''
      let numSeed = 0
      if (typeof value === 'string' && value.length) {
        strSeed = value
      }
      let maybeNumSeed = Number(strSeed)
      if (
        typeof maybeNumSeed === 'number' &&
        isFinite(maybeNumSeed) &&
        !isNaN(maybeNumSeed) &&
        maybeNumSeed
      ) {
        numSeed = maybeNumSeed
        return {
          hasInputSeed: true,
          inputSeed: numSeed,
        }
      } else if (strSeed) {
        return {
          hasInputSeed: true,
          inputSeed: strSeed,
        }
      } else {
        return {
          hasInputSeed: true,
          // indexInputSeed: index,
        }
      }

    case 'fps':
    case 'framerate':
    case 'frame_rate':
    case 'frame_per_second':
    case 'frame_per_seconds':
    case 'frames_per_second':
    case 'frames_per_seconds':
      let strFps = ''
      let fps = 0
      if (typeof value === 'string' && value.length) {
        strFps = value
      }
      let maybeFps = Number(strFps)
      if (
        typeof maybeFps === 'number' &&
        isFinite(maybeFps) &&
        !isNaN(maybeFps) &&
        maybeFps
      ) {
        fps = maybeFps
        return {
          hasInputFps: true,
          inputFps: fps,
        }
      } else if (strFps) {
        return {
          hasInputFps: true,
          inputFps: strFps,
        }
      } else {
        return {
          hasInputFps: true,
          // indexInputSFps: index,
        }
      }

    case 'duration':
    case 'duration_in_sec':
    case 'duration_in_seconds':
      let strDuration = ''
      let duration = 0
      if (typeof value === 'string' && value.length) {
        strDuration = value
      }
      let maybeDuration = Number(strDuration)
      if (
        typeof maybeDuration === 'number' &&
        isFinite(maybeDuration) &&
        !isNaN(maybeDuration) &&
        maybeDuration
      ) {
        duration = maybeDuration
        return {
          hasInputDuration: true,
          inputDuration: duration,
        }
      } else if (strDuration) {
        return {
          hasInputDuration: true,
          inputDuration: strDuration,
        }
      } else {
        return {
          hasInputDuration: true,
          // indexInputDuration: index,
        }
      }

    case 'steps':
    case 'n_steps':
    case 'nb_steps':
    case 'num_steps':
    case 'step_count':
    case 'inference_steps':
    case 'n_inference_steps':
    case 'nb_inference_steps':
    case 'num_inference_steps':
      let strSteps = ''
      let numSteps = 0
      if (typeof value === 'string' && value.length) {
        strSteps = value
      }
      let maybeNumSteps = Number(strSteps)
      if (
        typeof maybeNumSteps === 'number' &&
        isFinite(maybeNumSteps) &&
        !isNaN(maybeNumSteps) &&
        maybeNumSteps
      ) {
        numSteps = maybeNumSteps
        return {
          hasInputSteps: true,
          inputSteps: numSteps,
        }
      } else if (strSteps) {
        return {
          hasInputSteps: true,
          inputSteps: strSteps,
        }
      } else {
        return {
          hasInputSteps: true,
          // indexInputSteps: index,
        }
      }

      // note: what we have to choose depends on what Gradio expects
      // steps = numSteps
      break

    case 'guidance':
    case 'guidance_scale':
    case 'guidancescale':
      let strGuidanceScale = ''
      let numGuidanceScale = 0
      if (typeof value === 'string' && value.length) {
        strGuidanceScale = value
      }
      let maybeNumGuidanceScale = Number(strGuidanceScale)
      if (
        typeof maybeNumGuidanceScale === 'number' &&
        isFinite(maybeNumGuidanceScale) &&
        !isNaN(maybeNumGuidanceScale) &&
        maybeNumGuidanceScale
      ) {
        numGuidanceScale = maybeNumGuidanceScale
        return {
          hasInputGuidance: true,
          inputGuidance: numGuidanceScale,
        }
      } else if (strGuidanceScale) {
        return {
          hasInputGuidance: true,
          inputGuidance: strGuidanceScale,
        }
      } else {
        return {
          hasInputGuidance: true,
          // indexInputGuidance: index,
        }
      }

    case 'negative':
    case 'negativeprompt':
    case 'negative_prompt':
      if (typeof value === 'string' && value.length) {
        return {
          hasNegativeTextPrompt: true,
          inputNegativeTextPrompt: value,
        }
      } else {
        return {
          hasNegativeTextPrompt: true,
          // indexNegativeTextPrompt: index,
        }
      }

    case 'source_image':
    case 'input_image':
    case 'image_input':
    case 'image':
    case 'image':
      if (typeof value === 'string' && value.length) {
        return {
          hasInputImage: true,
          inputImage: value,
        }
      } else {
        return {
          hasInputImage: true,
          // indexPositiveTextPrompt: index,
        }
      }

    case 'source_audio':
    case 'input_audio':
    case 'audio_input':
    case 'driving_audio':
    case 'voice':
    case 'audio':
      if (typeof value === 'string' && value.length) {
        return {
          hasInputAudio: true,
          inputAudio: value,
        }
      } else {
        return {
          hasInputAudio: true,
          // indexPositiveTextPrompt: index,
        }
      }

    case 'prompt':
    case 'positive':
    case 'positiveprompt':
    case 'positive_prompt':
    case 'input_prompt':
    case 'input_text':
    case 'prompt_text':
    case 'text_prompt':
    case 'text':
      if (typeof value === 'string' && value.length) {
        return {
          hasPositiveTextPrompt: true,
          inputPositiveTextPrompt: value,
        }
      } else {
        return {
          hasPositiveTextPrompt: true,
          // indexPositiveTextPrompt: index,
        }
      }
  }
  return {}
}
