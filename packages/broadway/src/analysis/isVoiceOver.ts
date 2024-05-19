export function isVoiceOver(input: string) {
  const text = input.trim().toLowerCase()
  if (text === "v.o." ||
  text === "v.o" ||
  text === "vo." ||
  text === "(v.o.)" ||
  text === "(v.o)" ||
  text === "(vo.)" ||
  text === "voice over" ||
  text === "(voice over)"
  ) {
    return true
  }
  return false
}