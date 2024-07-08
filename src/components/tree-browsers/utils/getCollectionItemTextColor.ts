export function getCollectionItemTextColor(rawText?: string) {

  const text = `${rawText || ""}`.trim().toLowerCase()

  if (text.endsWith(".clap")) {
    // purple
    return "text-[#d49be8]"
  }

  if (text.endsWith(".mp3") || text.endsWith(".weba")) {
    // yellow
    return "text-[#e1c08b]" // "text-[#d8c18a]"
  }

  if (text.endsWith(".mp4") || text.endsWith(".webm")) {
    // red
    return "text-[#de8787]"
  }


  if (text.endsWith(".vtt")) {
    // orange
    return "text-[#e1a28b]"
  }

  if (text.endsWith(".png") || text.endsWith(".jpg") || text.endsWith(".jpeg") || text.endsWith(".webp")) {
    // green
    return "text-[#83b76e]"
  }

  if (text.endsWith(".txt") || text.endsWith(".md")) {
    // gray blue
    return "text-[#8dabbf]"
  }
  
   return ""
}