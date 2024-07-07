import { TimelineSegment } from "@aitube/timeline"

import { VersionControls, VersionedState } from "./version-control"

export type SegmentEditorState = {

} & VersionedState<TimelineSegment>

export type SegmentEditorControls = {
  
} & VersionControls<TimelineSegment>

export type SegmentEditorStore = SegmentEditorState & SegmentEditorControls
