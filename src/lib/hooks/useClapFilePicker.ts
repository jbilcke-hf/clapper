import { useEffect, useState } from "react"
import { useFilePicker } from "use-file-picker"
import { parseClap } from "@aitube/clap"
import { useTimelineState } from "@aitube/timeline"


export function useClapFilePicker() {
  const setClap = useTimelineState(s => s.setClap)
  const [isLoading, setIsLoading] = useState(false)

  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: '.clap',
    readAs: "ArrayBuffer"
  })

  const fileData = filesContent[0]

  useEffect(() => {
    const fn = async () => {
      if (fileData?.name) {
        try {
          setIsLoading(true)
          const blob = new Blob([fileData.content])
          const clap = await parseClap(blob)
          await setClap(clap)
        } catch (err) {
          console.error("failed to load the Clap file:", err)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fn()
  }, [fileData?.name])

  return { openFilePicker, filesContent, fileData, isLoading: loading || isLoading } 
}