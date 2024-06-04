import { RenderingStrategy, ComfyVendor, Settings } from "@/types"

export function getDefaultSettings(): Settings {
  return {
    comfyVendor: ComfyVendor.CUSTOM,
    comfyApiKey: "",

    storyboardGenerationStrategy: RenderingStrategy.ON_DEMAND,
    videoGenerationStrategy: RenderingStrategy.ON_DEMAND,

    maxNbAssetsToGenerateInParallel: 1,
  }
  }