import { ClapMediaOrientation, ClapProject, newClap, UUID } from "@aitube/clap"

import { cleanUTF8Characters } from "@/utils"
import { analyzeScreenplay } from "@/analysis/analyzeScreenplay"

import { getScreenplayFromText } from "./getScreenplayFromText"
import { Scene } from "@/types"

export type ParseScriptProgressUpdate = ({
  value,
  sleepDelay,
  message
}: {
  value: number
  sleepDelay?: number
  message?: string
}) => Promise<void>

const defaultParseScriptProgressUpdate: ParseScriptProgressUpdate = async () => {}

export async function parseScriptToClap(
  input: string,
  onProgressUpdate: ParseScriptProgressUpdate = defaultParseScriptProgressUpdate
): Promise<ClapProject> {
  // fix any mess which might be in it
  const content = cleanUTF8Characters(input)

  await  onProgressUpdate({ value: 10 })

  const screenplay = await getScreenplayFromText(content)

  await onProgressUpdate({ value: 20 })

  const { movieGenreLabel, extraPositivePrompt, segments, entitiesById, entitiesByScreenplayLabel } = await analyzeScreenplay(
  screenplay,
  async (progress, message) => {
    // progress is a value between 0 and 100
    const ratio = progress / 100

    // so we want to continue the progress bar in the range [20, 70]
    await onProgressUpdate({
      value: 20 + (ratio * 50),
      sleepDelay: 100,
      message
    })
  })
  
  await onProgressUpdate({ value: 60 })

  let durationInMs = 0
  segments.forEach(s => {
    if (s.endTimeInMs > durationInMs) {
      durationInMs = s.endTimeInMs
    }
  })

  let scenes: Scene[] = []
  screenplay.sequences.forEach(sequence => {
    scenes = [...scenes, ...sequence.scenes]
  })
    
  // TODO: return a ClapProject instead
  const clap = newClap({
    meta: {
      id: UUID(),
      title: "Untitled",
      description: `${movieGenreLabel}`,
      synopsis: "",
      licence: "All rights reserved by the IP holder",
    
      orientation: ClapMediaOrientation.LANDSCAPE,
      durationInMs: segments.filter(s => s.endTimeInMs),
    
      width: 1024,
      height: 576,
      defaultVideoModel: "",
      extraPositivePrompt: extraPositivePrompt,
      screenplay,
      isLoop: false,
      isInteractive: false,
    },
    scenes,
    entities: Object.values(entitiesById),
    segments,
  })
  
  return clap
}