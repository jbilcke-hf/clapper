import { readPlainText } from "./readPlainText"

export async function readLocalOrRemotePlainText(input: string): Promise<string> {

  if (input.startsWith("https://") || input.startsWith("http://")) {
    try {
      const res = await fetch(input)
      return res.text()
    } catch (err) {
      return input
    }
  }
  
  // (probably) too long to be a filepath
  if (input.length > 4096) {
    return input
  }

  if (input.endsWith(".txt") || input.endsWith(".md")) {
    try {
      return readPlainText(input)
    } catch (err) {
      return input
    }
  }

  return input
}