import { ClapWorkflowProvider } from '@aitube/clap'

import { MetricsPerProvider } from './types'
import { getDefaultClapWorkflowProviderMetrics } from './getDefaultClapWorkflowProviderMetrics'

export function getDefaultMetricsPerProvider(): MetricsPerProvider {
  const metricsPerProvider: MetricsPerProvider = {
    [ClapWorkflowProvider.NONE]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.BUILTIN]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.CUSTOM]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.HUGGINGFACE]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.REPLICATE]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.COMFYDEPLOY]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.COMFYICU]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.ELEVENLABS]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.OPENAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.STABILITYAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.FIREWORKSAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.GROQ]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.FALAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.MODELSLAB]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.KITSAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.ANTHROPIC]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.GOOGLE]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.MISTRALAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.COHERE]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.MIDJOURNEY]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.SUNO]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.UDIO]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.LUMALABS]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.KUAISHOU]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.RUNWAYML]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.HEDRA]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.LEONARDOAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.EVERARTAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
  }
  return metricsPerProvider
}
