// this is a deprecated module, we should get rid of it
import { getSegment, segmentCategories, ClapSegmentCategorySettings } from "@aitube/colors"

import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants/general"
import { RenderedScene } from "@/types"
import { pick } from "@/utils"
import { generateSeed, parseOutputType, ClapOutputType, ClapSegmentCategory, ClapSegment, UUID, newSegment } from "@aitube/clap"

export function createSegment({
  startTimeInSteps,
  startTimeInLines,
  endTimeInLines,
  sceneId,
  prompt = [],
  label = "",
  durationInSteps = 4,
  trackId = 0,
  outputType = ClapOutputType.TEXT,
  categoryName = ClapSegmentCategory.GENERIC,
  entityId = "",
  seed,
}: {
  startTimeInSteps: number
  startTimeInLines: number
  endTimeInLines: number
  sceneId: string
  prompt?: string[]
  label?: string
  durationInSteps?: number
  trackId?: number
  outputType?: ClapOutputType
  categoryName?: ClapSegmentCategory
  entityId?: string
  seed?: number
}): ClapSegment {

  // steps: 1|2|3|4
  // duration: 4
  // so if we begin at 1, the end step is 4
  // we need to remove 1, otherwise the end time will be too far
  const endTimeInSteps = startTimeInSteps + (durationInSteps - 1)

  // but for milliseconds, it is different! we want th exactly match the ms time 
  const durationInMs = durationInSteps * DEFAULT_DURATION_IN_MS_PER_STEP

  // this means here we will have a problem as if we are "step 1", we wil lhave 1 * 500ms (for instance)
  // which is not good: we want 0ms as a starting point instead
  // so the solution is to subtract 1 step
  const startTimeInMs = (startTimeInSteps - 1) * DEFAULT_DURATION_IN_MS_PER_STEP

  // see here how we DON'T remove 1 step: that's because we want the end time (in ms)
  // to exactly match the beginning of the next section
  const endTimeInMs = startTimeInMs + durationInMs

  const track = trackId // randomInteger(trackId, nbTracks)

  const segmentCategoriesExceptVisuals =
    Object.values(segmentCategories)
    .filter(item =>
      ![
        ClapSegmentCategory.SPLAT,
        ClapSegmentCategory.MESH,
        ClapSegmentCategory.DEPTH,
        ClapSegmentCategory.VIDEO,
        ClapSegmentCategory.STORYBOARD
      ].includes(item.id)
  ) as ClapSegmentCategorySettings[]

  // either a custom or a random category (except preview and render)
  const category = categoryName
    ? getSegment(categoryName)
    : pick<ClapSegmentCategorySettings>(segmentCategoriesExceptVisuals)

  const promptString = Array.isArray(prompt) ? prompt.filter(x => typeof x === "string" && x.length > 0).join(", ")
    : ""

  const randomSegment: ClapSegment = newSegment({
    id: UUID(),

    startTimeInMs,
    endTimeInMs,
    startTimeInLines,
    endTimeInLines,
    sceneId,

    prompt: promptString,
    track, // track row index
    label: label || promptString, // a short label to name the segment (optional, can be human or LLM-defined)
    category: category.id,

    entityId,

    // isHovering: false,
    // isDragging: false,
    // isEditing: false,

    seed: (!seed || isNaN(seed) || !isFinite(seed)) ? generateSeed() : seed, // seed unique to this segment - however for each video/image we will use the first "storyboard" seed

    // by default we are "auto", which means we created it using basic if/else rules
    // but no language model or anything like that
    createdBy: "auto",
    editedBy: "auto",

    // storyboardUrl: mockStoryboardsDrawing.at(i) || mockStoryboardsDrawing[0],
    // referenceUrl: mockStoryboardsLifelike.at(i) || mockStoryboardsLifelike[0],
    // generationStartedAt: 0,

    outputType: parseOutputType(outputType),
    
    // renderId: "",
    // status: "to_generate",
   // assetUrl: "",
    // assetDurationInMs: 0,

    // default is 1, 0 is mute, 2 is double the volume
    // gain can be set to a minimum of about -3.4028235E38 and a max of about 3.4028235E38
    // outputGain: 1, 

  })

  return randomSegment
}