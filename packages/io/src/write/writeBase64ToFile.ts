import { writeFile } from "node:fs/promises"

export async function writeBase64ToFile(base64Data: string, filePath: string): Promise<string> {
  const data = base64Data.split(";base64,").pop()
  if (!data) { throw new Error("Invalid base64 content") }
  await writeFile(filePath, data, { encoding: "base64" })
  return filePath
}

// legacy way: with more manual steps

/*
export async function writeBase64ToFile(content: string, filePath: string): Promise<void> {
  
  // Remove "data:image/png;base64," from the start of the data url
  const base64Data = content.split(";base64,")[1]

  // Convert base64 to binary
  const data = Buffer.from(base64Data, "base64")

  // Write binary data to file
  try {
    await fs.writeFile(filePath, data)
    // console.log("File written successfully")
  } catch (error) {
    console.error("An error occurred:", error)
  }
}
*/