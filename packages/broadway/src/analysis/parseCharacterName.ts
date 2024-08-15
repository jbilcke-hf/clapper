function takeWhatsBefore(input: string, pattern: string): string {
  return `${input || ""}`.split(pattern).shift() || ""
}

export function parseCharacterName(input: string) {

  let tmp = takeWhatsBefore(input, "'S")
  tmp = takeWhatsBefore(tmp, "’S")
  tmp = takeWhatsBefore(tmp, "(")
  tmp = takeWhatsBefore(tmp, "[")

  tmp = tmp
      .replaceAll(" INTERNALS ", "")
      .replaceAll(" VOICE ", "")

      tmp = tmp.trim()
  
  /*
  // console.log("DEBUG:", {
    input: ` ${input || ""} `,
    tmp
  })
  */

  return tmp
}