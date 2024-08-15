export function parseString(input?: any, defaultValue?: string): string {
  const defValue = `${defaultValue || ""}`

  if (typeof input !== "string") { return defValue }
  
  return input || defValue
}