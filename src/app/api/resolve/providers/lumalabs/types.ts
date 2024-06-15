// interestingly, the API / models has multiple public and internal names:

// photon
// dream machine
// lit_lite_inference_text2vid_v1.0

enum LumaLabsPhotonGenerationState {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed"
}

type LumaLabsPhotonGenerationVideo = {
  url: string // url to to CDN
  width: number // 512 by default
  height: number // 512 by default
  thumbnail: string | null // url to CDN
}

type LumaLabsPhotonGenerationRequest = {
  fspect_ratio: "16:9" | "1:1" // "16:9", "1:1" what are the others?
  expand_prompt: boolean
  user_prompt: string
}

type LumaLabsPhotonGeneration = {
  id: string
  prompt: string
  state: LumaLabsPhotonGenerationState
  created_at: string // iso date 
  video: LumaLabsPhotonGenerationVideo | null
  liked: null
  estimate_wait_seconds: null | number
}

type LumaLabsPhotonGenerations = LumaLabsPhotonGeneration[]