import { useEffect, useState } from "react"
import { useTimelineState } from "@aitube/timeline"
import { parseClap } from "@aitube/clap"
import { useFilePicker } from "use-file-picker"

export function useScreenplayFilePicker() {
  const setClap = useTimelineState(s => s.setClap)
  const [isLoading, setIsLoading] = useState(false)

  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: '.txt',
    readAs: "Text"
  })

  const fileData = filesContent[0]

  useEffect(() => {
    const fn = async () => {
      if (fileData?.name) {
        try {
          setIsLoading(true)
          const res = await fetch("https://jbilcke-hf-broadway-api.hf.space", {
            method: "POST",
            headers: { 'Content-Type': 'text/plain' },
            body:  fileData.content,
          })
          const blob = await res.blob()
          const clap = await parseClap(blob)
          await setClap(clap)
        } catch (err) {
          console.error("failed to import the screenplay:", err)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fn()
  }, [fileData?.name])

  return { openFilePicker, filesContent, fileData, isLoading: loading || isLoading } 
}