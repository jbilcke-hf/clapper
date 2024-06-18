import { GradioApiInfo, SupportedFields } from "../types"
import { identifyField } from "./identifyField"
import { getDefaultFields } from "./getDefaultFields"
import { findMainGradioEndpoint } from "./findMainGradioEndpoint"

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
  inputs: Record<string, any>,
  gradioApiInfo: GradioApiInfo
}): {
  endpoint: string
  inputs: Array<string | number | boolean | undefined | null>
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
    allInputFields = {...allInputFields, ...inputField}
  }

  // the gradio input array
  const gradioInputs: any[] = []

  for (const parameter of mainGradioEndpoint.endpoint.parameters) {
    let gradioInputValue: any = undefined

    const fields = mainGradioEndpoint.fields[parameter.parameter_name]
    
    // TODO: rewrite this in a better way maybe
    // until then, please don't blame me if you forget to update those!
    if (fields.hasPositiveTextPrompt) { gradioInputValue = allInputFields.inputPositiveTextPrompt }
    if (fields.hasNegativeTextPrompt) { gradioInputValue = allInputFields.inputNegativeTextPrompt }
    if (fields.hasInputImage) { gradioInputValue = allInputFields.inputImage }
    if (fields.hasInputAudio) { gradioInputValue = allInputFields.inputAudio }
    if (fields.hasInputWidth) { gradioInputValue = allInputFields.inputWidth }
    if (fields.hasInputHeight) { gradioInputValue = allInputFields.inputHeight }
    if (fields.hasInputSteps) { gradioInputValue = allInputFields.inputSteps }
    if (fields.hasInputGuidance) { gradioInputValue = allInputFields.inputGuidance }
    if (fields.hasInputSeed) { gradioInputValue = allInputFields.inputSeed }

    gradioInputs.push(gradioInputValue)
  }

  return {
    endpoint: mainGradioEndpoint.name,
    inputs: gradioInputs
  }
}