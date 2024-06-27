import { ClapSegment } from "@aitube/clap"
import { VersionControls, VersionedState } from "./version-control"

export type SegmentEditorState = {

} & VersionedState<ClapSegment>

export type SegmentEditorControls = {
  
} & VersionControls<ClapSegment>

export type SegmentEditorStore = SegmentEditorState & SegmentEditorControls
