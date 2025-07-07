import { Client } from '@gradio/client'

import { getGradioApiInfo } from './getGradioApiInfo'
import { parseHuggingFaceHubId } from './parseHuggingFaceHubId'
import { adaptAnyInputsToGradioInputs } from './adapter/adaptAnyInputsToGradioInputs'
import { getCurrentOwner } from './getCurrentOwner'
import { downloadHLSAsMP4, HLSDownloadOptions } from './downloadHLSFromNodeJS'

/**
 *
 * @param param0
 * @returns
 */
export async function callGradioApi<T>({
  url,
  inputs,
  apiKey,
}: {
  url: string
  inputs: Record<
    string,
    string | string[] | number | boolean | undefined | null
  >
  apiKey?: string
}): Promise<T> {
  // we can support either a call to the original space, or to the current user space

  const { owner: previousOwner, id } = parseHuggingFaceHubId(url, 'spaces')

  const owner = apiKey ? await getCurrentOwner(apiKey) : previousOwner

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
    apiKey,
  })

  const gradioEndpointInputs = adaptAnyInputsToGradioInputs({
    inputs,
    gradioApiInfo,
  })

  const app = await Client.connect(ownerAndId, {
    hf_token: apiKey as any,
  })

  const output = await app.predict(
    gradioEndpointInputs.endpoint,
    gradioEndpointInputs.inputMap
  )

  let firstDataItem = (Array.isArray(output.data) ? output.data[0] : '') || ''

  if (typeof firstDataItem?.['video']?.['url'] == 'string') {
    const videoUrl = `${firstDataItem?.['video']?.['url'] || ''}`

    if (videoUrl.endsWith('m3u8')) {
      // the gradio space might be private, in that case all download
      // will have to happen using an API key
      const options: HLSDownloadOptions | undefined = apiKey
        ? {
            bearerToken: apiKey,
            verbose: false, // set to true to spit out more logs
          }
        : undefined

      try {
        firstDataItem = await downloadHLSAsMP4(videoUrl, options)
      } catch (err) {
        console.warn(`failed to download the video at ${videoUrl}:`, err)
      }
    } else if (videoUrl.startsWith('data:')) {
      firstDataItem = videoUrl
    } else {
      console.log(`unrecognized video format ${videoUrl}`)
    }
  }

  return firstDataItem as unknown as T
}
