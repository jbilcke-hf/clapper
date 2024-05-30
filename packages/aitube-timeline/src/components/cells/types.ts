import { ClapSegment } from "@aitube/clap"

export type SpecializedCellProps = {
  segment: ClapSegment
  cellWidth: number
  cellHeight: number
  setHovered: (id: string) => void
  durationInSteps: number
  startTimeInSteps: number
  baseSegmentColor: {
    bg: string;
  }
}