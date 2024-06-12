"use client"

import { create } from "zustand"

import { MetricsStore } from "./types"
import { getDefaultMetricsState } from "./getDefaultMetricsState"

export const useMetrics = create<MetricsStore>((set, get) => ({
  ...getDefaultMetricsState(),
  
  // TODO: add a track metric callback
}))
