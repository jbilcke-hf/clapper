import { GradioApiInfo, SupportedFields } from '../types'
import { identifyField } from './identifyField'
import { getDefaultFields } from './getDefaultFields'
import { findMainGradioEndpoint } from './findMainGradioEndpoint'
import { base64DataUriToBlob } from '@/lib/utils/base64DataUriToBlob'

/**
 * This function try to adapt arbitrary inputs to strict gradio inputs
 *
 * @param param0
 * @returns
 */
export function adaptAnyInputsToGradioInputs({
  inputs,
  gradioApiInfo,
}: {
  inputs: Record<string, any>
  gradioApiInfo: GradioApiInfo
}): {
  endpoint: string
  inputArray: Array<string | number | boolean | Blob | undefined | null>
  inputMap: Record<string, string | number | boolean | Blob | undefined | null>
} {
  const mainGradioEndpoint = findMainGradioEndpoint({ gradioApiInfo })

  if (!mainGradioEndpoint) {
    throw new Error(`couldn't find a suitable endpoint`)
  }

  // input fields passed by the parent calling function
  let inputFields: Record<string, Partial<SupportedFields>> = {}
  let allInputFields = getDefaultFields()
  for (const [key, value] of Object.entries(inputs)) {
    const inputField = identifyField(key, value)
    inputFields[key] = inputField
    allInputFields = { ...allInputFields, ...inputField }
  }
  console.log(
    `input fields passed by the parent calling function:`,
    inputFields
  )

  // the gradio input array
  // apparently the new JS client also supports dictionaries, yay!
  let inputArray: Array<string | number | boolean | Blob | undefined | null> =
    []
  let inputMap: Record<
    string,
    string | number | boolean | Blob | undefined | null
  > = {}

  for (const parameter of mainGradioEndpoint.endpoint.parameters) {
    let gradioInputValue: any = undefined

    const fields = mainGradioEndpoint.fields[parameter.parameter_name]

    // TODO: rewrite this in a better way maybe
    // until then, please don't blame me if you forget to update those!
    if (fields.hasPositiveTextPrompt) {
      gradioInputValue = allInputFields.inputPositiveTextPrompt
    }
    if (fields.hasNegativeTextPrompt) {
      gradioInputValue = allInputFields.inputNegativeTextPrompt
    }
    if (fields.hasInputImage) {
      gradioInputValue = allInputFields.inputImage
    }
    if (fields.hasInputAudio) {
      gradioInputValue = allInputFields.inputAudio
    }
    if (fields.hasInputWidth) {
      gradioInputValue = allInputFields.inputWidth
    }
    if (fields.hasInputHeight) {
      gradioInputValue = allInputFields.inputHeight
    }
    if (fields.hasInputSteps) {
      gradioInputValue = allInputFields.inputSteps
    }
    if (fields.hasInputGuidance) {
      gradioInputValue = allInputFields.inputGuidance
    }
    if (fields.hasInputSeed) {
      gradioInputValue = allInputFields.inputSeed
    }
    if (fields.hasInputDuration) {
      gradioInputValue = allInputFields.inputDuration
    }

    //console.log("parameter:", parameter)
    const valueSeemsToBeABase64Uri =
      typeof gradioInputValue === 'string' &&
      gradioInputValue.startsWith('data:')
    const fieldSeemsToBeTextBased =
      parameter.type === 'string' || parameter.component === 'Textbox'
    // || parameter.parameter_name.includes("base64")

    // the magic doesn't end here: we need to convert base64 inputs to buffers,
    // unless gradio expects it to be a text
    if (valueSeemsToBeABase64Uri && !fieldSeemsToBeTextBased) {
      gradioInputValue = base64DataUriToBlob(gradioInputValue)
    }
    // old, low-level way
    inputArray.push(gradioInputValue)

    // new, high-level way
    inputMap[parameter.parameter_name] = gradioInputValue
  }

  console.log(
    `gradio adapter inputArray:`,
    inputArray.map((x) => (typeof x === 'string' ? x.slice(0, 255) : x))
  )

  console.log(`await client.predict("${mainGradioEndpoint.name}", `, inputMap)

  return {
    endpoint: mainGradioEndpoint.name,
    inputArray,
    inputMap,
  }
}
