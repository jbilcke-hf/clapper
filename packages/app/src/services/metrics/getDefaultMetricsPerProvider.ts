import { ClapWorkflowProvider } from '@aitube/clap'

import { MetricsPerProvider } from './types'
import { getDefaultClapWorkflowProviderMetrics } from './getDefaultClapWorkflowProviderMetrics'

/*
TODO @Julian this data should be stored in the ClapWorkflow instead,
it will be 100x easier
*/
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
    [ClapWorkflowProvider.COMFYUI]: {
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
    [ClapWorkflowProvider.AITUBE]: {
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
    [ClapWorkflowProvider.LETZAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.BIGMODEL]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.PIAPI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.CIVITAI]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
    [ClapWorkflowProvider.HOTSHOT]: {
      ...getDefaultClapWorkflowProviderMetrics(),
    },
  }
  return metricsPerProvider
}
