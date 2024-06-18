import { HFSpaceStatus } from "./types"
import { parseHuggingFaceHubId } from "./parseHuggingFaceHubId"


export async function getSpaceStatus({
  id,
  apiKey,
}: {
  id: String
  apiKey: string
}): Promise<HFSpaceStatus> {

  const { category, ownerAndId } = parseHuggingFaceHubId(id)
  if (category !== "spaces") {
    throw new Error(`cannot get the running status of ${category} "${ownerAndId}": this is not a space!`)
  }
  const res = await fetch(`https://huggingface.co/api/spaces/${ownerAndId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })

  if (res.status !== 200)  {
    throw new Error("failed to get the space data")
  }

  try {
    const data = await res.json() as HFSpaceStatus
    return data
  } catch (err) {
    throw new Error(`failed to parse space data: ${err}`)
  }
}
