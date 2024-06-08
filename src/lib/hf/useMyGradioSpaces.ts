import { useEffect, useState } from "react"

import { useSettings } from "@/controllers/settings"

import { GradioSpace } from "./types"
import { getMyGradioSpaces } from "./getMyGradioSpaces"

export function useMyGradioSpaces() {
  const [gradioSpaces, setGradioSpaces] = useState<GradioSpace[]>([])

  const huggingFaceApiKey = useSettings(s => s.huggingFaceApiKey)

  useEffect(() => {
    const fn = async () => {
      try {
        const newSpaces = await getMyGradioSpaces({ huggingFaceApiKey })
        setGradioSpaces(newSpaces)
      } catch (err) {
        console.error(`failed to load the Gradio spaces (most likely your HF token is invalid)`, err)
      }

    }
    fn()
  }, [huggingFaceApiKey])

  return gradioSpaces
}