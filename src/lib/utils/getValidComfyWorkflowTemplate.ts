export function getValidComfyWorkflowTemplate(something: any, defaultComfyWorkflowTemplate: string) {
  const strValue = `${something || defaultComfyWorkflowTemplate}`
  try {
    const workflow = JSON.parse(strValue)
    if (typeof workflow === "object") {
      return strValue
    } else {
      throw new Error(`this doesn't look like a ComfyUI workflow template string`)
    }
  } catch (err) {
    return "{}"
  }
}