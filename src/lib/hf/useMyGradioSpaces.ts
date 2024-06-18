import { useEffect, useState } from "react"

import { useSettings } from "@/controllers/settings"

import { getSpaces } from "./getSpaces"
import { HFSpace } from "./types"

export function useMyGradioSpaces(): HFSpace[] {
  const [gradioSpaces, setGradioSpaces] = useState<HFSpace[]>([])

  const huggingFaceApiKey = useSettings(s => s.huggingFaceApiKey)

  useEffect(() => {
    const fn = async () => {
      try {
        const newSpaces = await getSpaces({ apiKey: huggingFaceApiKey, sdk: "gradio" })
        setGradioSpaces(newSpaces)
      } catch (err) {
        console.error(`failed to load the Gradio spaces (most likely your HF token is invalid)`, err)
      }

    }
    fn()
  }, [huggingFaceApiKey])

  return gradioSpaces
}