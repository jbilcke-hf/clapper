"use server"

import Replicate from 'replicate'

export async function run({
  apiKey,
  workflow
}: {
  apiKey: string
  workflow: string
}): Promise<string> {

  const replicate = new Replicate({ auth: apiKey })

  const cogId = "fofr/any-comfyui-workflow:74f12621dc9f9b7cdca50d03941b8ddb3a368d7f5a1bb16fb7e1b87f05d96bf5"

  const output = await replicate.run(cogId, {
    input: {
      workflow_json: workflow
    }
  })

  console.log(`response:`, output)

  return ""
}