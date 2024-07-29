import { runFilterPipeline } from './runFilterPipeline'

import { analogLensSimulator } from './filters/analogLens'
import { cinematic } from './filters/cinematic'
import { colorTemperature } from './filters/colorTemperature'
import { crossProcessing } from './filters/crossProcessing'
import { filmDegradation } from './filters/filmDegradation'
import { infraredBlackAndWhite } from './filters/infrared'
import { lomography } from './filters/lomography'
import { splitToning } from './filters/splitToning'
import { hdrToneMapping } from './filters/toneMapping'
import { vintageFilm } from './filters/vintageFilm'

export async function demo() {
  const base64DataUriImages = await runFilterPipeline({
    images: [
      {
        image: 'data:image/png....',
        // depthMap: "data:image/png...." // optional depth map
      },
    ],
    filters: [
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
    ],
  })
}
