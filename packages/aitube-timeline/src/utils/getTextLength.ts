/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * 
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  * 
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */

import { useTimelineState } from ".."

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
  [char]: getTextWidthInCanvas(char, "bold Arial")
}), {} as Record<string, number>)
let defaultCharLength = 5.561523437

// change this whenever you modify the font size
const webglFontWidthFactor = 1.7

/**
 * Compute the text of a simple Arial text in a WebGL environmment
 * This actually just do a lookup + sum
 * 
 * @param text 
 * @returns 
 */
export function getWebGLCharWidth(char: string = ""): number {

  const cellWidthInPixels = useTimelineState.getState().horizontalZoomLevel

  let responsiveHack = 1.5

  if (cellWidthInPixels < 16) {
    responsiveHack = 1.20
  } else if (cellWidthInPixels < 20) {
    responsiveHack = 1.10
  } else if (cellWidthInPixels < 24) {
    responsiveHack = 1.05
  } else if (cellWidthInPixels < 28) {
    responsiveHack = 1
  } else if (cellWidthInPixels < 32) {
    responsiveHack = 0.9
  } else if (cellWidthInPixels < 48) {
    responsiveHack = 0.8
  } else if (cellWidthInPixels < 64) {
    responsiveHack = 0.75
  } else if (cellWidthInPixels < 128) {
    responsiveHack = 0.65
  } else {
    responsiveHack = 0.55
  }

  return responsiveHack * webglFontWidthFactor * (charLength[char] || defaultCharLength)
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

  const text = `${input || ""}`.replace('\n', ' ').trim()
  const characters = text.split('')
  for (const c of characters) {
    width += getWebGLCharWidth(c)
    buffer += c
    if (width >= maxWidthInPixels) {
      if (lines.length >= (maxNbLines - 1)) {
        buffer = buffer.trim() // to avoid writing "and .."
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