export function cleanUTF8Characters(input: string): string {
  return input.replaceAll("–", "-").replaceAll("", "")
}