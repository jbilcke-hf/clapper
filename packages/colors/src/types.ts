
// import { ClapSegmentCategory } from "@aitube/clap"

import { SegmentColor } from "./constants/colors"

export interface ClapSegmentCategorySettings {
  id: any // ClapSegmentCategory // eg. "country"
  title: string // eg. Country
  description: string // description in one sentence
  color: SegmentColor // base color name, in lowercase
}