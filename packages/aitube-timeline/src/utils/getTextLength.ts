/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * 
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  * 
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */

function getTextWidthInCanvas(text: string, font: string) {
  if (typeof window === "undefined") {
    return 0
  }
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  if (!context) { return 0 }

  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}


// one option could be to pre-compute some of the width
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()_-"+=,;:?/\\&@#'.split('')
const charLength = characters.reduce((acc, char) => ({
  ...acc,
  [char]: getTextWidthInCanvas(char, "Arial")
}), {} as Record<string, number>)

const defaultCharLength = 5.561523437 // seems to be a common width when we use getTextWidthInCanvas()
const webglFontWidthFactor = 0.58

/**
 * Compute the text of a simple Arial text in a WebGL environmment
 * This actually just do a lookup + sum
 * 
 * @param text 
 * @returns 
 */
export function getWebGLCharWidth(char: string = ""): number {
  return webglFontWidthFactor * (charLength[char] || defaultCharLength)
}

/**
 * Compute the text of a simple Arial text in a WebGL environmment
 * This actually just do a lookup + sum
 * 
 * @param text 
 * @returns 
 */
export function getWebGLTextWidth(text: string = ""): number {
  return text.split('').reduce((s, c) => (s + getWebGLCharWidth(c)), 0)
}

/**
 * Clamp a text to a given
 * @param text 
 * @param maxWidthInPixels 
 * @returns 
 */
export function clampWebGLText(
  input: string,
  maxWidthInPixels: number,
  maxNbLines: number
): string[] {
  let buffer = ""
  let width = 0
  let lines: string[] = []

  const text = `${input || ""}`.trim()
  const characters = text.split('')
  for (const c of characters) {
    width += getWebGLCharWidth(c)
    buffer += c
    if (width >= maxWidthInPixels) {
      if (lines.length >= maxNbLines) {
        buffer += ".."
        break
      } else {
        // TODO: we should do something smarter, which is to split the last sentence
        const words = buffer.split(" ")
        const lastWord = (words.at(-1) || "")
        if (lastWord.length) {
          lines.push(words.slice(0, -1).join(" "))
          buffer = lastWord
          width = getWebGLTextWidth(lastWord)
        } else {
           lines.push(buffer)
           buffer = ""
           width = 0
        }
      }
    }
  }

  if (buffer.length) {
    lines.push(buffer)
  }
  return lines
}

export function clampWebGLTextNaive(input: string = "", maxWidthInPixels: number = 0): string {
  // this cutoff is very approximate as we should make it dependent on each character's width
  // a simple heuristic can be to count the uppercase / lower case
  const maxhInCharacter = Math.ceil(maxWidthInPixels / 3.4)

  const text = `${input || ""}`

  return (text.length >= maxhInCharacter)
              ? `${text.slice(0, maxhInCharacter)}..`
              : text
   
}