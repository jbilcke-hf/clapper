import { ComfyVendor, RenderingStrategy } from "@/types"

import { SettingsRenderingState } from "./types"

export function getDefaultSettingsRendering(): SettingsRenderingState {
  const state: SettingsRenderingState = {
    comfyUiApiVendor: ComfyVendor.NONE,
    comfyUiApiKey: "",
    storyboardRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoRenderingStrategy: RenderingStrategy.ON_DEMAND,
    maxNbAssetsToGenerateInParallel: 1,
  }

  return state
}
