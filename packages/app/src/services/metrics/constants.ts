// some providers don't provide APIs to get those statistics
// so we have to resort to using very approximative estimations

import { ClapWorkflowProvider } from '@aitube/clap'
import {
  ProviderMetricsEstimationType,
  ProviderMetricsModelEstimations,
} from './types'

/*
TODO @Julian move this to the ClapWorkflow itself
that will be much easier
*/

// also note that duration depends on the parameters and image size
// so generally it only make sense to use the averageCostPerSecond
//
// duration is also impact by how many requests we are running at the same time,
// provider load etc.. so sometimes there is a big delta between what
// is announced on the corporate websites and the reality
export const estimatedMetrics: Record<
  ClapWorkflowProvider,
  Record<string, ProviderMetricsModelEstimations>
> = {
  [ClapWorkflowProvider.BUILTIN]: {},
  [ClapWorkflowProvider.NONE]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.CUSTOM]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.COMFYUI]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.HUGGINGFACE]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.REPLICATE]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.COMFYDEPLOY]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.COMFYICU]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.ELEVENLABS]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.OPENAI]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.STABILITYAI]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.FIREWORKSAI]: {},
  [ClapWorkflowProvider.GROQ]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.KITSAI]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.ANTHROPIC]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.GOOGLE]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.MISTRALAI]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.COHERE]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.FALAI]: {
    'fal-ai/metavoice-v1': {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.0006666666666666666,
      averageDurationInSec: 15,
      averageCostPerGeneration: 0.01,
    },
    'fal-ai/flux-pro': {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0,
      averageDurationInSec: 0,
      averageCostPerGeneration: 0,
    },
    'fal-ai/fast-sdxl': {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.001105904404873477,
      averageDurationInSec: 1.73114,
      averageCostPerGeneration: 0.0022138836772983114,
    },

    'fal-ai/stable-audio': {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.0010714285714285715,
      averageDurationInSec: 6.64838,
      averageCostPerGeneration: 0.0075,
    },
    'fal-ai/stable-video': {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.000029239766081871346,
      averageDurationInSec: 55.61273333333333,
      averageCostPerGeneration: 0.0010416666666666667,
    },
    'fal-ai/omni-zero': {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.0011475409836065576,
      averageDurationInSec: 8.7341,
      averageCostPerGeneration: 0.01,
    },
    'fal-ai/ccsr': {
      estimationType: ProviderMetricsEstimationType.MANUAL_MEASUREMENTS,
      averageCostPerComputeTimeInSec: 0.0011111111111111111,
      averageDurationInSec: 30,
      averageCostPerGeneration: 0.015,
    },
  },
  [ClapWorkflowProvider.AITUBE]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.MODELSLAB]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.MIDJOURNEY]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.SUNO]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.UDIO]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.LUMALABS]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.KUAISHOU]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.RUNWAYML]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.HEDRA]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.LEONARDOAI]: {
    // TODO list the most popular models
  },
  [ClapWorkflowProvider.EVERARTAI]: {
    // TODO list the most popular models
  },
}
