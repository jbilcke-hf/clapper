export function isValidNumber(input?: any) {
  return typeof input === "number" && !isNaN(input) && isFinite(input)
}
