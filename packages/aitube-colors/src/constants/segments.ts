import { ClapSegmentCategory } from "@aitube/clap"

import { SegmentColor } from "@/constants/colors"
import { ClapSegmentCategorySettings } from "@/types"

// this is a special segment used for rendering the scene
const splat: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.SPLAT,
  title: "Splat",
  description: "Gaussian splatting",
  color: "pink",
}

const mesh: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.MESH,
  title: "Mesh",
  description: "Render a mesh",
  color: "green2"
}

const depth: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.DEPTH,
  title: "Depth map",
  description: "Dpeth map",
  color: "yellow",
}

// this is a special segment used for rendering the scene
const video: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.VIDEO,
  title: "video",
  description: "Render a video",
  color: "indigo",
}

// this is a special segment type used to render preview thumbnails
const storyboard: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.STORYBOARD,
  title: "storyboard",
  description: "Storyboard preview (image or video)",
  color: "indigo",
}

const action: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.ACTION,
  title: "Action",
  description: "Action",
  color: "orange2",
}

const character: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.CHARACTER,
  title: "Character",
  description: "Characters, animals..",
  color: "purple",
}

const location: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.LOCATION,
  title: "Location",
  description: "Location (country, place, background, furnitures..)",
  color: "sand",
}

const camera: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.CAMERA,
  title: "camera",
  description: "Camera (position, angle, direction)",
  color: "zinc2",
}

const transition: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.TRANSITION,
  title: "transition",
  description: "Transition",
  color: "teal",
}

const lighting: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.LIGHTING,
  title: "Lighting",
  description: "Lighting (natural or artifical)",
  color: "neutral2",
}

const time: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.TIME,
  title: "Time",
  description: "Time of the day (noon, night..)",
  color: "neutral2",
}

// @deprecated - use `time` and ClapSegmentCategory.TIME instead
const era: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.ERA,
  title: "Era",
  description: "Era (80s, Ancient Rome..)",
  color: "gray",
}

const weather: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.WEATHER,
  title: "Weather",
  description: "Weather (sunny, raining, snow..)",
  color: "stone",
}

const sound: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.SOUND,
  title: "Sound",
  description: "Sound (foreground, background..)",
  color: "yellow2",
}

const music: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.MUSIC,
  title: "Music",
  description: "Music (foreground, background..)",
  color: "green3",
}

const dialogue: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.DIALOGUE,
  title: "Dialogue",
  description: "Music (foreground, background..)",
  color: "purple2",
}

const style: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.STYLE,
  title: "Style",
  description: "Style",
  color: "pink3",
}

/*
const colors: ClapSegmentCategorySettings = {
  id: "colors",
  title: "Color grading",
  description: "Color grading",
  color: "pink",
}
*/

const generic: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.GENERIC,
  title: "Generic",
  description: "Generic",
  color: "cyan",
}

// (invisible) an event localized in time
const event: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.EVENT,
  title: "Event",
  description: "Event",
  color: "cyan",
}

// (visible) an Interface (UI) element
const interface_: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.INTERFACE,
  title: "Interface",
  description: "Interface",
  color: "cyan",
}

// (invisible) a prompt which defines new event(s) to fire based on event(s)
const phenomenon: ClapSegmentCategorySettings = {
  id: ClapSegmentCategory.PHENOMENON,
  title: "Phenomenon",
  description: "Phenomenon",
  color: "cyan",
}

export const segmentCategories = {
  splat,
  mesh,
  depth,
  event, // (invisible) an event localized in time
  interface: interface_, // (visible)
  phenomenon, // (invisible) a prompt which defines new event(s) to fire based on event(s)
  video,
  storyboard,
  character,
  location,
  time,
  era,
  lighting,
  weather,
  action,
  music,
  sound,
  dialogue,
  style,
  camera,
  transition,
  generic,
}

export const categoryNames = Object.keys(segmentCategories)

export function getSegment(category?: ClapSegmentCategory): ClapSegmentCategorySettings {
  return segmentCategories[category || "generic"] || segmentCategories.generic
}

export function getSegmentColor(input?: ClapSegmentCategorySettings | ClapSegmentCategory): SegmentColor {
  const { color } = !input || typeof input === "string" ? getSegment(input) : input

  return color as SegmentColor
}
