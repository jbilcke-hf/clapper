import { useEffect } from "react"

import { useMic } from "../mic/useMic"
import { useAssistant } from "./useAssistant"

export function useVoiceAssistant() {
  const processMessage = useAssistant(s => s.processMessage)
  const transcript = useMic(s => s.transcript)

  useEffect(() =>  {
    processMessage(transcript)
  }, [transcript, processMessage])
}
