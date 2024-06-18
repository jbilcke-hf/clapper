import { listSpaces, Credentials, whoAmI, SpaceSdk } from "@huggingface/hub"
import {  HFSpace } from "./types"

export async function getSpaces({
  apiKey,
  sdk = "gradio"
}: {
  apiKey: string
  sdk?: SpaceSdk
}): Promise<HFSpace[]> {

  const accessToken = apiKey || ""

  if (!accessToken) {
    throw new Error(`cannot list spaces without a Hugging Face access token`)
  }

  const credentials: Credentials = { accessToken }

  let username = ""
  try {
    const { name } = await whoAmI({ credentials })
    username = name
    if (!username) {
      throw new Error(`returned username is empty`)
    }
  } catch (err) {
    throw new Error(`cannot list spaces: ${err}`)
  }

  let results: HFSpace[] = []

  for await (const space of listSpaces({
    search: {
      owner: username
    },
    additionalFields: [
     "cardData",
     "runtime",
     "tags",
     "models"
    ],
    credentials
  })) {

    if (sdk && space.sdk != sdk) { continue }
    results.push(space)
  }

  return results
}