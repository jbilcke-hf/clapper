import { Settings } from "@/types"

const version = `CLAP_CONFIG_V0_`

export const localStorageKeys: Record<keyof Settings, string> = {
  comfyVendor: `${version}COMFY_VENDOR`,
  comfyApiKey: `${version}COMFY_API_KEY`,

  storyboardGenerationStrategy: `${version}STORYBOARD_GENERATION_STRATEGY`,
  videoGenerationStrategy: `${version}VIDEO_GENERATION_STRATEEGY`,

  maxNbAssetsToGenerateInParallel: `${version}MAX_NB_ASSETS_TO_GENERATE_IN_PARQLLEL`,
}
