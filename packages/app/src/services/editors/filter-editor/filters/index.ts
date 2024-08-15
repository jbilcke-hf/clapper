import { Filter, FilterWithParams } from '@aitube/clapper-services'

export { analogLensSimulator } from './analogLens'
export { cinematic } from './cinematic'
export { colorMapping } from './colorMapping'
export { colorTemperature } from './colorTemperature'
export { crossProcessing } from './crossProcessing'
export { filmDegradation } from './filmDegradation'
export { infraredBlackAndWhite } from './infrared'
export { lomography } from './lomography'
export { splitToning } from './splitToning'
export { hdrToneMapping } from './toneMapping'
export { vintageFilm } from './vintageFilm'

import { analogLensSimulator } from './analogLens'
import { cinematic } from './cinematic'
import { colorMapping } from './colorMapping'
import { colorTemperature } from './colorTemperature'
import { crossProcessing } from './crossProcessing'
import { filmDegradation } from './filmDegradation'
import { infraredBlackAndWhite } from './infrared'
import { lomography } from './lomography'
import { splitToning } from './splitToning'
import { hdrToneMapping } from './toneMapping'
import { vintageFilm } from './vintageFilm'

export const filters: Filter[] = [
  analogLensSimulator,
  cinematic,
  colorMapping,
  colorTemperature,
  crossProcessing,
  filmDegradation,
  infraredBlackAndWhite,
  lomography,
  splitToning,
  hdrToneMapping,
  vintageFilm,
]

export const presets: FilterWithParams[] = [
  {
    filter: analogLensSimulator,
    parameters: {
      chromaticAberration: 0.003,
      vignetteStrength: 0.4,
      vignetteRadius: 0.8,
      distortion: 0.15,
      bloomStrength: 0.2,
      bloomRadius: 4,
      dofFocusDistance: 0.6,
      dofFocusRange: 0.1,
      dofBlurStrength: 3,
    },
  },
  {
    filter: infraredBlackAndWhite,
    parameters: {
      contrast: 1.3,
      grain: 0.25,
      glow: 0.4,
    },
  },
  {
    filter: filmDegradation,
    parameters: {
      scratchesIntensity: 0.35,
      dustIntensity: 0.25,
      colorFading: 0.4,
      lightLeakIntensity: 0.3,
    },
  },
  {
    filter: crossProcessing,
    parameters: {
      intensity: 0.6,
      contrastBoost: 0.4,
      colorShift: 'Cool',
    },
  },
  {
    filter: lomography,
    parameters: {
      saturation: 1.4,
      contrast: 1.3,
      vignetteIntensity: 0.6,
      lightLeakIntensity: 0.4,
    },
  },
  {
    filter: cinematic,
    parameters: {
      preset: 'Blade Runner',
      intensity: 0.6,
      contrast: 1.3,
    },
  },
  {
    filter: splitToning,
    parameters: {
      highlightColor: 'Yellow',
      shadowColor: 'Blue',
      balance: 0.1,
      intensity: 0.5,
    },
  },

  {
    filter: hdrToneMapping,
    parameters: {
      exposure: 0.5,
      contrast: 1.2,
      saturation: 1.1,
      highlights: -0.2,
      shadows: 0.3,
    },
  },
  {
    filter: colorTemperature,
    parameters: {
      temperature: 5500,
      tint: 10,
    },
  },
  {
    filter: vintageFilm,
    parameters: {
      preset: 'Kodachrome 64',
      intensity: 0.8,
      grain: 0.3,
      ageEffect: 0.2,
      colorShift: 0.05,
      contrast: 1.1,
      saturation: 1.2,
    },
  },
]
