// the files produced by a ComfyUI output node
export type ComfyUiOutputFile = {
  filename: string
  subfolder: string
  type: string
}

// Output nodes don't all use the same key:
// SaveImage -> images, VHS_VideoCombine -> gifs, SaveAudio -> audio etc.
const OUTPUT_KEYS = ['videos', 'gifs', 'audio', 'images']

/**
 * Returns the first non-empty list of files found in the output of a node
 */
export function getOutputFiles(
  output: Record<string, any> | undefined
): ComfyUiOutputFile[] {
  for (const key of OUTPUT_KEYS) {
    const files = output?.[key]

    if (Array.isArray(files) && files.length > 0) {
      return files
    }
  }

  return []
}
