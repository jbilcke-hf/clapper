import { getSpaces } from "./getSpaces"
import { parseHuggingFaceHubId } from "./parseHuggingFaceHubId"

export async function runGradioSpace<I, O>({
  url,
  params,
  apiKey,
  sleepAfter = "hour"
}: {
  url: string
  params?: I
  apiKey: string
  sleepAfter?: "hour" | "day"
}): Promise<O> {
  const { id } = parseHuggingFaceHubId(url)

  let gradioSpaces = await getSpaces({ apiKey, sdk: "gradio" })

  if (gradioSpaces.find(s => s.name === id)) {
    console.log("runGradioSpace: good, we already have cloned the space")
  } else {
    console.log("runGradioSpace: hm, we need to clone the space")
    console.log("runGradioSpace: we might want to ask the user for confirmation here")

  }
  return {} as O
}
