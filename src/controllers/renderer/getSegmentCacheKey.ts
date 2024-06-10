import { ClapSegment } from "@aitube/clap"

export function getSegmentCacheKey(segment: ClapSegment, prefix = "") {

  // we have to be smart here because we can't take the full base64 assetUrl (it might be huge)
  // so we only use a portion of it
  
  return `${prefix}:${
  segment.id
  }_${
  segment.assetUrl.slice(0, 1024)
  }`
}