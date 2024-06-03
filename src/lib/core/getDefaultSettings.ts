import { AssetGenerationStrategy, ComfyVendor, Settings } from "@/types"

export function getDefaultSettings(): Settings {
  return {
    comfyVendor: ComfyVendor.CUSTOM,
    comfyApiKey: "",

    storyboardGenerationStrategy: AssetGenerationStrategy.ON_DEMAND,
    videoGenerationStrategy: AssetGenerationStrategy.ON_DEMAND,

    maxNbAssetsToGenerateInParallel: 1,
  }
  }