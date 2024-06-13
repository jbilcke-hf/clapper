export function parseFileName(input: any): {
  projectName: string,
  fileName: string,
  extension: string
} {
  const fileName = `${input || ""}`
  const bits = fileName.split(".")
  const extension = `${bits.pop() || ""}`.toLowerCase()
  const projectName = bits.join(" ")

  return {
    projectName,
    fileName,
    extension
  }
}