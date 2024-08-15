import Replicate from 'replicate'

export async function runWorkflow({
  apiKey,
  workflow,
}: {
  apiKey: string
  workflow: string
}): Promise<string> {
  const replicate = new Replicate({ auth: apiKey })

  // https://replicate.com/fofr/any-comfyui-workflow
  // https://replicate.com/guides/comfyui/run-comfyui-on-replicate

  const cogId =
    'fofr/any-comfyui-workflow:74f12621dc9f9b7cdca50d03941b8ddb3a368d7f5a1bb16fb7e1b87f05d96bf5'

  const output = await replicate.run(cogId, {
    input: {
      workflow_json: workflow,
    },
  })

  console.log(`response from Replicate:`, output)

  return output as any
}
