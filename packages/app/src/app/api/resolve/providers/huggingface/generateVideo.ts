import { ResolveRequest } from '@aitube/clapper-services'
import { callGradioApi } from '@/lib/hf/callGradioApi'
import {
  builtinProviderCredentialsHuggingface,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'
import { ClapInputCategory } from '@aitube/clap'
import { getWorkflowInputValues } from '../getWorkflowInputValues'

export async function generateVideo(request: ResolveRequest): Promise<string> {
  if (!request.settings.videoGenerationWorkflow.data) {
    throw new Error(
      `HuggingFace.generateVideo: cannot generate without a valid videoGenerationWorkflow.data`
    )
  }
  let apiKey = request.settings.huggingFaceApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "Hugging Face"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsHuggingface
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsHuggingface
    }
  }

  const { workflowDefaultValues, workflowValues } = getWorkflowInputValues(
    request.settings.videoGenerationWorkflow
  )

  console.log('HuggingFace.generateVideo prompts: ', request.prompts)

  console.log(
    'HuggingFace.generateVideo: workflowDefaultValues:',
    workflowDefaultValues
  )

  console.log('HuggingFace.generateVideo: workflowValues:', workflowValues)

  const supportsTextPrompt =
    request.settings.videoGenerationWorkflow.inputFields.some(
      (field) => field.category === ClapInputCategory.PROMPT
    )
  const supportsImagePrompt =
    request.settings.videoGenerationWorkflow.inputFields.some((field) =>
      [ClapInputCategory.IMAGE_URL, ClapInputCategory.IMAGE_URLS].includes(
        field.category
      )
    )

  if (supportsTextPrompt) {
    console.log(
      'HuggingFace.generateVideo: this workflow supports text prompts'
    )
    request.settings.videoGenerationWorkflow.inputValues.prompt =
      request.prompts.image.positive
  } else {
    console.log(
      'HuggingFace.generateVideo: this workflow does NOT support text prompts'
    )
  }

  if (supportsImagePrompt) {
    console.log(
      'HuggingFace.generateVideo: this workflow supports image prompts'
    )
    // TODO: replace the workflowValues.prompt or something?
  } else {
    console.log(
      'HuggingFace.generateVideo: this workflow does NOT support image prompts'
    )
  }

  if (!request.prompts.video.image) {
    console.log(
      'HuggingFace.generateVideo: request.settings.videoGenerationWorkflow:',
      request.settings.videoGenerationWorkflow
    )

    if (!supportsImagePrompt && supportsTextPrompt) {
      // the provider only works on text anyway so we're good
    } else {
      // note: actually we should check if the field is mandatory or not
      throw new Error(
        `HuggingFace.generateVideo: cannot generate without a valid input image prompt`
      )
    }
  }

  console.log(
    'HuggingFace.generateVideo: calling gradio API with inputs: ',
    request.settings.videoGenerationWorkflow.inputValues
  )
  // TODO pass a type to the template function
  const assetUrl = await callGradioApi<string>({
    url: request.settings.videoGenerationWorkflow.data,

    // there is a small incompatibility here,
    // we should check if it's possible some fields are string[]
    inputs: request.settings.videoGenerationWorkflow.inputValues as any,

    apiKey,
  })

  return assetUrl
}
