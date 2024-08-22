/**
 * Represents the parameters for the Hotshot video generation request.
 */
export type HotshotVideoGenerationParams = {
  prompt: string
  prompt_options: string // " --generation-type generate"

  // I think this is just a randomly generated UUID
  request_id: string // eg. "6bf37b2d-576b-4ae0-93d4-9e7980fa3ce3"

  generation_type: string // "generate"

  files: Array<any> // for future use?
}

/**
 * Represents the response from the Hotshot video generation request.
 */
export type HotshotVideoGenerationResponse = {
  // will be something like "https://dvfx9cgvtgnyd.cloudfront.net",
  cdnHost: string

  // will be something like "6bf37b2d-576b-4ae0-93d4-9e7980fa3ce3",
  request_id: string

  responses: Array<{
    message: string // "submitted to ['eC4XDlU_d72nqFG5AAAn']"
  }>
}
