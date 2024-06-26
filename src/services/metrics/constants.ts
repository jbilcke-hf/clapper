

// some providers don't provide APIs to get those statistics
// so we have to resort to using very approximative estimations

import { ComputeProvider } from "@aitube/clapper-services"
import { ProviderMetricsEstimationType, ProviderMetricsModelEstimations } from "./types"

// also note that duration depends on the parameters and image size
// so generally it only make sense to use the averageCostPerSecond
//
// duration is also impact by how many requests we are running at the same time,
// provider load etc.. so sometimes there is a big delta between what
// is announced on the corporate websites and the reality
export const estimatedMetrics: Record<ComputeProvider, Record<string, ProviderMetricsModelEstimations>> = {

  [ComputeProvider.NONE]: {
    // TODO list the most popular models
  },
  [ComputeProvider.CUSTOM]: {
    // TODO list the most popular models
  },
  [ComputeProvider.HUGGINGFACE]: {
    // TODO list the most popular models
  },
  [ComputeProvider.COMFY_HUGGINGFACE]: {
    // TODO list the most popular models
  },
  [ComputeProvider.REPLICATE]: {
    // TODO list the most popular models
  },
  [ComputeProvider.COMFY_REPLICATE]: {
    // TODO list the most popular models
  },
  [ComputeProvider.COMFY_COMFYICU]: {
    // TODO list the most popular models
  },
  [ComputeProvider.ELEVENLABS]: {
    // TODO list the most popular models
  },
  [ComputeProvider.OPENAI]: {
    // TODO list the most popular models
  },
  [ComputeProvider.STABILITYAI]: {
    // TODO list the most popular models
  },
  [ComputeProvider.FIREWORKSAI]: {

  },
  [ComputeProvider.GROQ]: {
    // TODO list the most popular models
  },
  [ComputeProvider.KITSAI]: {
    // TODO list the most popular models
  },
  [ComputeProvider.ANTHROPIC]: {
    // TODO list the most popular models
  },
  [ComputeProvider.GOOGLE]: {
    // TODO list the most popular models
  },
  [ComputeProvider.MISTRALAI]: {
    // TODO list the most popular models
  },
  [ComputeProvider.COHERE]: {
    // TODO list the most popular models
  },
  [ComputeProvider.FALAI]: {
    "fal-ai/metavoice-v1": {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.0006666666666666666,
      averageDurationInSec: 15,
      averageCostPerGeneration: 0.01,
    },
    "fal-ai/fast-sdxl": {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.001105904404873477,
      averageDurationInSec: 1.73114,
      averageCostPerGeneration: 0.0022138836772983114,
    },

    "fal-ai/stable-audio": {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.0010714285714285715,
      averageDurationInSec: 6.64838,
      averageCostPerGeneration: 0.0075,
    },
    "fal-ai/stable-video": {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.000029239766081871346,
      averageDurationInSec: 55.61273333333333,
      averageCostPerGeneration: 0.0010416666666666667,
    },
    "fal-ai/omni-zero": {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.0011475409836065576,
      averageDurationInSec: 8.7341,
      averageCostPerGeneration: 0.01
    },
    "fal-ai/ccsr": {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.0011111111111111111,
      averageDurationInSec: 30,
      averageCostPerGeneration: 0.015
    }
  },
  [ComputeProvider.MODELSLAB]: {
    // TODO list the most popular models
  },
  [ComputeProvider.MIDJOURNEY]: {
    // TODO list the most popular models
  },
  [ComputeProvider.SUNO]: {
    // TODO list the most popular models
  },
  [ComputeProvider.UDIO]: {
    // TODO list the most popular models
  },
  [ComputeProvider.LUMALABS]: {
    // TODO list the most popular models
  },
  [ComputeProvider.KUAISHOU]: {
    // TODO list the most popular models
  },
  [ComputeProvider.RUNWAYML]: {
    // TODO list the most popular models
  },
  [ComputeProvider.HEDRA]: {
    // TODO list the most popular models
  },
  [ComputeProvider.LEONARDOAI]: {
    // TODO list the most popular models
  },
  [ComputeProvider.EVERARTAI]: {
    // TODO list the most popular models
  },
}
