import { transitions } from "./transitions"

export function parseTransition(originalLine: string): string {

  const line = ` ${originalLine.trim()} `

  // trimmed line is too short to be a transition
  if (line.length < 3) {
    return ""
  }

  for (const transitionKeyword of Object.keys(transitions)) {
    if (line.includes(transitionKeyword)) {
      return transitionKeyword
    }
  }

  return ""
}
