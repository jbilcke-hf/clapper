import { ClapWorkflowProviderMetrics } from './types'

export function getDefaultClapWorkflowProviderMetrics(): ClapWorkflowProviderMetrics {
  const metrics: ClapWorkflowProviderMetrics = {
    // used to estimate live wait times
    averageDurationPerModel: {},

    // used to count the total compute time per model
    totalDurationPerModel: {},

    // used to estimate the total cost per model
    totalCostPerModel: {},

    // the total cost for this provider
    totalCost: 0,
  }
  return metrics
}
