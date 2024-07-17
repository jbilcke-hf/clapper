import { ComputeProvider } from '@aitube/clapper-services'

import { MetricsPerProvider } from './types'
import { getDefaultComputeProviderMetrics } from './getDefaultComputeProviderMetrics'

export function getDefaultMetricsPerProvider(): MetricsPerProvider {
  const metricsPerProvider: MetricsPerProvider = {
    [ComputeProvider.NONE]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.CUSTOM]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.HUGGINGFACE]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.COMFY_HUGGINGFACE]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.REPLICATE]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.COMFY_REPLICATE]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.COMFY_COMFYICU]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.ELEVENLABS]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.OPENAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.STABILITYAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.FIREWORKSAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.GROQ]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.FALAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.MODELSLAB]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.KITSAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.ANTHROPIC]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.GOOGLE]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.MISTRALAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.COHERE]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.MIDJOURNEY]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.SUNO]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.UDIO]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.LUMALABS]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.KUAISHOU]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.RUNWAYML]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.HEDRA]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.LEONARDOAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.EVERARTAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
  }
  return metricsPerProvider
}
