import { Credentials, whoAmI } from "@huggingface/hub"

export async function getCurrentOwner(apiKey: string): Promise<string> {

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

  return username
}