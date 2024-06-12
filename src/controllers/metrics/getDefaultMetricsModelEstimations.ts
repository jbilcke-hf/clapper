import { ProviderMetricsEstimationType, ProviderMetricsModelEstimations } from "./types"

export function getDefaultMetricsModelEstimation(): ProviderMetricsModelEstimations {
  const defaults: ProviderMetricsModelEstimations = {
    estimationType: ProviderMetricsEstimationType.UNAVAILABLE,
    averageCostPerComputeTimeInSec: 0, // 0.01,
    averageDurationInSec: 0, // 7,
    averageCostPerGeneration: 0, // 0.07
  }
  return defaults
}