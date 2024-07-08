export function getCollectionColor(rawText: string, defaultColor?: string): string {
  const text = `${rawText || ""}`.trim().toLowerCase()

  if (
    text.includes("interpolator") ||
    text.includes("interpolate") ||
    text.includes("interpolation")
    ) {
    return "text-purple-300/70 stroke-purple-300/70"
  }

  if (
    text.includes("superresolution") ||
    text.includes("resolution") ||
    text.includes("upscaling") ||
    text.includes("upscaler") ||
    text.includes("upscale")
    ) {
    return "text-sky-300/70 stroke-sky-300/70"
  }

  if (
    text.includes("tts") ||
    text.includes("speech") ||
    text.includes("voice")
  ) {
    return "text-emerald-300/70 stroke-emerald-300/70"
  }

  if (
    text.includes("video") ||
    text.includes("movie")
  ) {
    return "text-yellow-300/70 stroke-yellow-300/70"
  }

  if (
    text.includes("audio") ||
    text.includes("sound") ||
    text.includes("music")
    ) {
    return "text-lime-300/70 stroke-lime-300/70"
  }

  if (
    text.includes("image") ||
    text.includes("photo")
  ) {
    return "text-cyan-300/70 stroke-cyan-300/70"
  }

  return defaultColor || "text-gray-300/70 stroke-gray-300/70"
}