import { ComfyVendor, RenderingStrategy } from "@/types"

export type SettingsRenderingState = {
  comfyUiApiVendor: ComfyVendor
  comfyUiApiKey: string
  storyboardRenderingStrategy: RenderingStrategy
  videoRenderingStrategy: RenderingStrategy
  maxNbAssetsToGenerateInParallel: number
}

export type SettingsRenderingControls = {
  setComfyUiApiVendor: (comfyUiApiVendor: ComfyVendor) => void
  setComfyUiApiKey: (comfyUiApiKey: string) => void
  setStoryboardRenderingStrategy: (storyboardRenderingStrategy: RenderingStrategy) => void
  setVideoRenderingStrategy: (videoRenderingStrategy: RenderingStrategy) => void
  setMaxNbAssetsToGenerateInParallel: (maxNbAssetsToGenerateInParallel: number) => void
}

export type SettingsRenderingStore =
  SettingsRenderingState &
  SettingsRenderingControls