import { ComputeProvider } from "@/types"

export enum ProviderMetricsEstimationType {
  // the metrics come from the provider's live API,
  // and should be considered reliable
  LIVE_API = "LIVE_API",

  // the metrics come from the provider's website,
  // and should be considered more or less reliable
  PROVIDER_CLAIM = "PROVIDER_CLAIM",

  // the metrics come from our own measurements,
  // and should not be considered reliable
  MANUAL_MEASUREMENTS = "MANUAL_MEASUREMENTS",

  // if we don't have the info, costs are negligible or
  // or it is not relevant (eg. local)
  UNAVAILABLE = "UNAVAILABLE"
}


export type ProviderMetricsModelEstimations = {
  estimationType: ProviderMetricsEstimationType
  averageCostPerComputeTimeInSec: number
  averageDurationInSec: number
  averageCostPerGeneration: number
}

export type ProviderMetricsModelStats = {
  averageCostPerComputeTimeInSec: number
  averageDurationInSec: number
  averageCostPerGeneration: number
  
  computeTimeInSec: number
  totalCost: number
}

export type ComputeProviderMetrics = {
  // used to estimate live wait times
  averageDurationPerModel: Record<string, number>

  // used to count the total compute time per model
  totalDurationPerModel: Record<string, number>

  // used to estimate the total cost per model
  totalCostPerModel: Record<string, number>

  // the total cost for this provider
  totalCost: number
}

export type MetricsPerProvider = Record<ComputeProvider, ComputeProviderMetrics>

export type MetricsState = {
  metricsPerProvider: MetricsPerProvider
  totalCostSinceAppStarted: number
}

export type MetricsControls = {

}

export type MetricsStore = MetricsState & MetricsControls