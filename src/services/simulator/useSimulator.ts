"use client"

import { create } from "zustand"
import { SimulatorStore } from "@aitube/clapper-services"

import { getDefaultSimulatorState } from "./useDefaultSimulatorState"


export const useSimulator = create<SimulatorStore>((set, get) => ({
  ...getDefaultSimulatorState(),


  startLoop: () => {

  },
  runLoop: async () => {

  },
  togglePause: (isPaused?: boolean) => {
    let isRunning = get().isRunning
    if (typeof isPaused === "boolean") {
      isRunning = !isPaused
    } else {
      isRunning = !isRunning
    }

    set({ isRunning })
    return isRunning
  }
}))
