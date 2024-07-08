import { IconType } from "react-icons/lib"

import { icons } from "."

export const getAppropriateIcon = (rawText: string, defaultIcon?: IconType): IconType => {
  const text = `${rawText || ""}`.trim().toLowerCase()

  if (text.includes("downloads")) {
    return icons.downloads
  }

  if (text.includes("demo scripts") || text.includes("screenplay")) {
    return icons.screenplay
  }

  if (text.includes("folder") || text.includes("directory")) {
    return defaultIcon || icons.misc
  }


  if (text.includes(".clap") || text.includes("clapper")) {
    return icons.project
  }

  if (text.includes(".jpg") || text.includes("jpeg") || text.includes(".webp") || text.includes(".png")) {
    return icons.imagefile
  }

  if (text.includes(".mp3")) {
    return icons.soundfile
  }

  if (text.includes(".mp4")) {
    return icons.videofile
  }

  if (text.includes(".txt") || text.includes(".md")) {
    return icons.textfile
  }

  if (
    text.includes("transfer") ||
    text.includes("transform")
    ) {
    return  icons.transfer
  }

  if (
    text.includes("interpolator") ||
    text.includes("interpolate") ||
    text.includes("interpolation")
    ) {
    return icons.interpolate
  }

  if (
    text.includes("superresolution") ||
    text.includes("resolution") ||
    text.includes("upscaling") ||
    text.includes("upscaler") ||
    text.includes("upscale")
    ) {
    return icons.upscale
  }

  if (
    text.includes("tts") ||
    text.includes("speech") ||
    text.includes("voice")
  ) {
    return icons.speech
  }

  if (
    text.includes("video") ||
    text.includes("movie")
  ) {
    return icons.film
  }

  if (
    text.includes("audio") ||
    text.includes("sound") ||
    text.includes("music")
  ) {
    return icons.sound
  }

  if (
    text.includes("image") ||
    text.includes("photo")
  ) {
    return icons.image
  }

  return defaultIcon || icons.misc
}