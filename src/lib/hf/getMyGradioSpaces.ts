import { listSpaces, Credentials, whoAmI, SpaceEntry } from "@huggingface/hub"
import { GradioSpace } from "./types"

export async function getMyGradioSpaces({
  huggingFaceApiKey
}: {
  huggingFaceApiKey: string
}): Promise<GradioSpace[]> {

  const accessToken = huggingFaceApiKey || ""

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


  let maxNbSpaces = 10
  let gradioSpaces: GradioSpace[] = []

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
    if (
      space.sdk !== "gradio"
    ) { continue }

    console.log("MySpace:", gradioSpaces)

    gradioSpaces.push(space)
  }

  return gradioSpaces
}