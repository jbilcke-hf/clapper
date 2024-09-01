import { ClapSegmentCategory } from "../types"

export function parseSegmentCategory(input: any, defaultCategory?: ClapSegmentCategory): ClapSegmentCategory {
  
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapSegmentCategory).includes(unknownString as ClapSegmentCategory)) {
    return unknownString as ClapSegmentCategory
  }

  let category: ClapSegmentCategory = defaultCategory || ClapSegmentCategory.GENERIC

  // sometimes we want to use a LLM to generate the categories,
  // but those aren't very precise and can hallucinate
  // for instance they like to use plural
  // so we need to be a bit flexible in how we detect those

  unknownString = unknownString.toLowerCase()

  if (unknownString === "splat" || unknownString === "splats" || unknownString === "splatting" || unknownString === "gaussian splat" || unknownString === "splatv") {
    category = ClapSegmentCategory.SPLAT
  }
  else if (unknownString === "mesh" || unknownString === "meshes" || unknownString === "3d mesh") {
    category = ClapSegmentCategory.MESH
  }
  else if (unknownString === "depth" || unknownString === "depthmap" || unknownString === "depth map") {
    category = ClapSegmentCategory.DEPTH
  }
  else if (unknownString === "effect") {
    category = ClapSegmentCategory.EFFECT
  }
  else if (unknownString === "event" || unknownString === "events") {
    category = ClapSegmentCategory.EVENT
  }
  else if (unknownString === "interface" || unknownString === "ui" || unknownString === "caption" || unknownString === "html") {
    category = ClapSegmentCategory.INTERFACE
  }
  else if (unknownString === "phenomenon" || unknownString === "phenomenons" || unknownString === "effect" || unknownString === "effects" || unknownString === "mutation" || unknownString === "reaction" || unknownString === "transformation") {
    category = ClapSegmentCategory.PHENOMENON
  }
  else if (unknownString === "video" || unknownString === "videos") {
    category = ClapSegmentCategory.VIDEO
  }
  else if (
    unknownString === "image" ||
    unknownString === "images" ||
    
    // those were the previous names,
    // but we are going to deprecate this soon
    unknownString === "storyboard" ||
    unknownString === "storyboards"
  ) {
    category = ClapSegmentCategory.IMAGE
  }
  else if (unknownString === "transition" || unknownString === "transitions" || unknownString === "cut" || unknownString === "cuts") {
    category = ClapSegmentCategory.TRANSITION
  }
  else if (unknownString === "character" || unknownString === "characters" || unknownString === "actor" ||  unknownString === "person") {
    category = ClapSegmentCategory.CHARACTER
  }
  else if (unknownString === "location" || unknownString === "locations" || unknownString === "place" || unknownString === "places") {
    category = ClapSegmentCategory.LOCATION
  }
  else if (unknownString === "time" || unknownString === "timestamp") {
    category = ClapSegmentCategory.TIME
  }
  else if (unknownString === "era") {
    category = ClapSegmentCategory.ERA
  }
  else if (unknownString === "lighting" || unknownString === "light" || unknownString === "lighting") {
    category = ClapSegmentCategory.LIGHTING
  }
  else if (unknownString === "weather" || unknownString === "sky" || unknownString === "meteo") {
    category = ClapSegmentCategory.WEATHER
  }
  else if (unknownString === "action") {
    category = ClapSegmentCategory.ACTION
  }
  else if (unknownString === "music") {
    category = ClapSegmentCategory.MUSIC
  }
  else if (unknownString === "sound" || unknownString === "sounds") {
    category = ClapSegmentCategory.SOUND
  }
  else if (unknownString === "dialogue" || unknownString === "dialogues" || unknownString === "speech" || unknownString === "voice" || unknownString === "voices") {
    category = ClapSegmentCategory.DIALOGUE
  }
  else if (unknownString === "style") {
    category = ClapSegmentCategory.STYLE
  }
  else if (unknownString === "camera") {
    category = ClapSegmentCategory.CAMERA
  }
  else if (unknownString === "generic") {
    category = ClapSegmentCategory.GENERIC
  }

  return category
}