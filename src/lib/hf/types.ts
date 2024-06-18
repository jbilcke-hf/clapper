import { SpaceEntry, SpaceRuntime } from "@huggingface/hub"
import { ApiSpaceInfo } from "@huggingface/hub/dist/src/types/api/api-space"
import { ApiInfo, EndpointInfo, JsApiData } from "@gradio/client/dist/types"

export type HFSpace =
  SpaceEntry & Pick<ApiSpaceInfo, "cardData" | "runtime" | "tags" | "models">

export interface HFSpaceStatus {
  _id: string
  id: string
  author: string
  sha: string
  lastModified: string
  private: boolean
  gated: boolean
  disabled: boolean
  host: string
  subdomain: string
  tags: string[]
  likes: number
  sdk: string
  runtime: SpaceRuntime
  createdAt: string
}

export type HFHubCategory = "spaces" | "models"

export type GradioApiInfo = ApiInfo<JsApiData>

export type SupportedFields = {
  inputPositiveTextPrompt: string
  hasPositiveTextPrompt: boolean

  inputNegativeTextPrompt: string
  hasNegativeTextPrompt: boolean

  inputImage: string
  hasInputImage: boolean

  inputAudio: string
  hasInputAudio: boolean

  inputWidth: string | number
  hasInputWidth: boolean

  inputHeight: string | number
  hasInputHeight: boolean

  inputSteps: string | number
  hasInputSteps: boolean

  inputGuidance: string | number
  hasInputGuidance: boolean

  inputSeed: string | number
  hasInputSeed: boolean
}

export type GradioEndpoint = {
  isNamed: boolean
  name: string
  endpoint: EndpointInfo<JsApiData>
  fields: Record<string, Partial<SupportedFields>>
  score: number
}
