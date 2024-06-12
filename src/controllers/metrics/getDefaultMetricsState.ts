import { getDefaultMetricsPerProvider } from "./getDefaultMetricsPerProvider"
import { MetricsState } from "./types"

export function getDefaultMetricsState(): MetricsState {
  const defaults: MetricsState = {
    metricsPerProvider: getDefaultMetricsPerProvider(),
    totalCostSinceAppStarted: 0,
  }
  return defaults
}
