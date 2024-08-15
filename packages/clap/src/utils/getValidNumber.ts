export const getValidNumber = (something: any, minValue: number, maxValue: number, defaultValue: number) => {
  const strValue = `${something || defaultValue}`
  const numValue = Number(strValue)
  const isValid = !isNaN(numValue) && isFinite(numValue)
  if (!isValid) {
    return defaultValue
  }
  return Math.max(minValue, Math.min(maxValue, numValue))
 
}