import { ComputeProviderMetrics } from './types'

export function getDefaultComputeProviderMetrics(): ComputeProviderMetrics {
  const metrics: ComputeProviderMetrics = {
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
