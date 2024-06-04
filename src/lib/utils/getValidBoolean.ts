export const getValidBoolean = (something: any, defaultValue: boolean) => {
  if (typeof something === "boolean") {
    return something
  }

  const strValue = `${something || defaultValue}`.toLowerCase()
  
  return strValue === "true" || strValue === "1" || strValue === "on"
}