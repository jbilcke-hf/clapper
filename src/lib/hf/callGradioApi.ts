import { Client } from "@gradio/client"

import { getGradioApiInfo } from "./getGradioApiInfo"
import { parseHuggingFaceHubId } from "./parseHuggingFaceHubId"
import { adaptAnyInputsToGradioInputs } from "./adapter/adaptAnyInputsToGradioInputs"
import { getCurrentOwner } from "./getCurrentOwner"

/**
 * 
 * @param param0 
 * @returns 
 */
export async function callGradioApi<T>({
  url,
  inputs,
  apiKey
}: {
  url: string
  inputs: Record<string, string | number | boolean | undefined | null>
  apiKey?: string
}): Promise<T> {

  // console.log(`callGradioApi called on: `, { url, apiKey })
  // we can support either a call to the original space, or to the current user space
  
  const { owner: previousOwner, id } = parseHuggingFaceHubId(url, "spaces")
  
  // console.log(`then: `, { previousOwner, id })

  const owner = apiKey ? (await getCurrentOwner(apiKey)) : previousOwner

  const ownerAndId = `${owner}/${id}`
  // console.log(`then: `, { owner, ownerAndId })
  // TODO: if the user doesn't have forked the space yet we should ask the user to do sp

  /*
  // first step is to check if the user already has this space
  const gradioSpaces = await getSpaces({ apiKey, sdk: "gradio" })
  const gradioSpace = gradioSpaces.find(s => s.name === id)

  if (gradioSpace) {
    // good, there is already a space for that
    console.log(`good, user did the homework and forked the space to their own account`)
  } else {
    // bad, there is no space for that
    console.log(`bad, user should fork the space`)
    throw new Error(`Couldn't find "${ownerAndId}". Please make sure you created or duplicated the space correctly.`)
  }
  */

  const gradioApiInfo = await getGradioApiInfo({
    url: ownerAndId,
    apiKey
  })

  // console.log(`gradioApiInfo: `, gradioApiInfo)

  const gradioEndpointInputs = adaptAnyInputsToGradioInputs({
    inputs,
    gradioApiInfo
  })
  
  // console.log(`gradioEndpointInputs: `, gradioEndpointInputs)
  
  const app = await Client.connect(ownerAndId, {
    hf_token: apiKey as any
  })
  // console.log(`app: `, app)
  
  const output = await app.predict(
    gradioEndpointInputs.endpoint,
    gradioEndpointInputs.inputs
  )
  console.log(`output: `, output)
  
  return output.data as unknown as T
}