import { useEffect, useState, useTransition } from "react"
import { useFilePicker } from "use-file-picker"

import { parseFileName } from "@/services/io/parseFileName"
import { useIO } from "@/services/io/useIO"

export function useOpenFilePicker() {
  const [isLoading, setIsLoading] = useState(false)
  const openClapBlob = useIO(s => s.openClapBlob)
  const openScreenplay = useIO(s => s.openScreenplay)

  const supportedExtensions = ['clap', 'txt']

  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: supportedExtensions.map(ext => `.${ext}`),
    readAs: "ArrayBuffer"
  })

  const fileData = filesContent[0]

  useEffect(() => {
    const fn = async () => {
      const input = `${fileData?.name || ""}`
      if (!input) { return }


      const {
        fileName,
        projectName,
        extension
      } = parseFileName(input)

      if (!supportedExtensions.includes(extension)) {
        console.error(`unsupported extension "${extension}"`)
        return
      }

      const blob = new Blob([fileData.content])

      if (extension === "clap") {
        try {
          setIsLoading(true)
          await openClapBlob(projectName, fileName, blob)
        } catch (err) {
          console.error("failed to load the Clap file:", err)
        } finally {
          setIsLoading(false)
        }
      } else if (extension === "txt") {
        try {
          setIsLoading(true)
          await openScreenplay(projectName, fileName, blob)
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