import { ProviderMetricsModelStats } from "./types"

export function getDefaultMetricsModelStats(): ProviderMetricsModelStats {
  const stats: ProviderMetricsModelStats = {
    averageCostPerComputeTimeInSec: 0,
    averageDurationInSec: 0,
    averageCostPerGeneration: 0,
    computeTimeInSec: 0,
    totalCost: 0,
  }
  return stats
}