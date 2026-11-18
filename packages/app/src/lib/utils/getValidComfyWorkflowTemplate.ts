/**
 * Take a string, try to unpack it as JSON to validate it, return a string
 *
 * @param something
 * @param defaultComfyWorkflowTemplate
 * @returns
 */
export function getValidComfyWorkflowTemplate(
  something: any,
  defaultComfyWorkflowTemplate: string
) {
  const strValue = `${something || defaultComfyWorkflowTemplate}`
  try {
    const workflow = JSON.parse(strValue)
    // NB: `typeof null === 'object'` and arrays are objects too,
    // so both need to be rejected explicitly here.
    if (
      workflow &&
      typeof workflow === 'object' &&
      !Array.isArray(workflow)
    ) {
      return strValue
    } else {
      throw new Error(
        `this doesn't look like a ComfyUI workflow template string`
      )
    }
  } catch (err) {
    // Fall back to the default template provided by the caller,
    // instead of an empty workflow (which has no output node).
    return defaultComfyWorkflowTemplate
  }
}
