import { isAllCaps } from "@/utils/isAllCaps"


export function parseDialogueLine(line: string): string {
  let lineWithSpaces = ` ${line || ""} `

  if (line === " .. " || line === " ... ") {
    return ""
  }

  // looks like an anomaly, normally dialogue isn't all caps
  if (isAllCaps(lineWithSpaces)) {
    return ""
  }

  // some scripts (such as Afterglow) have quotes in it
  // we can remove them
  lineWithSpaces = lineWithSpaces.replaceAll(`“`, '').replaceAll(`”`, '')

  return lineWithSpaces.trim()
}