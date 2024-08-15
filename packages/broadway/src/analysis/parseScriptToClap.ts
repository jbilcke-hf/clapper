import { ClapMediaOrientation, ClapProject, newClap, UUID } from "@aitube/clap"

import { cleanUTF8Characters } from "@/utils"
import { analyzeScreenplay } from "@/analysis/analyzeScreenplay"

import { getScreenplayFromText } from "./getScreenplayFromText"

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

  await  onProgressUpdate({ value: 5 })

  const screenplay = await getScreenplayFromText(content)

  await onProgressUpdate({ value: 10 })

  const {
    movieGenreLabel,
    extraPositivePrompt,
    segments,
    entitiesById,
    finalPlainText,
    totalDurationInMs,
    scenes
  } = await analyzeScreenplay(
  screenplay,
  async (progress, message) => {
    // progress is a value between 0 and 100
    const ratio = progress / 100

    // so we want to continue the progress bar in the range [20, 70]
    await onProgressUpdate({
      value: 10 + (ratio * 80),
      sleepDelay: 25,
      message
    })
  })
  
  await onProgressUpdate({ value: 90 })


  // TODO: return a ClapProject instead
  const clap = newClap({
    meta: {
      id: UUID(),
      title: "Untitled",
      description: `${movieGenreLabel}`,
      synopsis: "",
      licence: "This OpenClap file is just a conversion from the original screenplay and doesn't claim any copyright or intellectual property. All rights reserved to the original intellectual property and copyright holders. Using OpenClap isn't piracy.",
    
      orientation: ClapMediaOrientation.LANDSCAPE,
      durationInMs: totalDurationInMs,
    
      width: 1024,
      height: 576,
      defaultVideoModel: "", // <-- we should deprecate this no?
      extraPositivePrompt: extraPositivePrompt,
      screenplay: finalPlainText,
      isLoop: false,
      isInteractive: false,
    },
    scenes: scenes.map((scene, i) => ({
      ...scene,
      // let's deprecate this field, this was a bad idea
      // (too much redundancy)
      sequenceFullText: "",

      // let's also deprecate this
      events: [],
    })),
    entities: Object.values(entitiesById),
    segments,
  })
  await onProgressUpdate({ value: 100 })

  return clap
}