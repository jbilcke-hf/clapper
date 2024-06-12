import { ComputeProvider } from "@/types"

import { MetricsPerProvider } from "./types"
import { getDefaultComputeProviderMetrics } from "./getDefaultComputeProviderMetrics"

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
    [ComputeProvider.GROQ]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.FALAI]: {
      ...getDefaultComputeProviderMetrics(),
    },
    [ComputeProvider.MODELSLAB]: {
      ...getDefaultComputeProviderMetrics(),
    },
  }
  return metricsPerProvider
}