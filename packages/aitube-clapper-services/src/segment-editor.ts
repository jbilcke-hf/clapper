import { TimelineSegment } from "@aitube/timeline"

import { VersionControls, VersionState } from "./version-control"

export type SegmentEditorState = {

} & VersionState<TimelineSegment>

export type SegmentEditorControls = {
  
} & VersionControls<TimelineSegment>

export type SegmentEditorStore = SegmentEditorState & SegmentEditorControls
