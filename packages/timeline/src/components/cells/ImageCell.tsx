import React, { useMemo } from "react";
import { Image } from "@react-three/drei";

import { SegmentArea } from "@/types/timeline";
import { SpecializedCellProps } from "./types";
import { useTimeline } from "@/hooks/useTimeline";

const MAX_IMAGE_SECTIONS = 16;

export function ImageCell({
  segment: s,
  cellWidth,
  cellHeight,
  isHovered,
  setHoveredSegment,
  durationInSteps,
  startTimeInSteps,
  colorScheme,
  widthInPx,
  widthInPxAfterZoom,
  isResizing,
  track,
}: SpecializedCellProps) {
  const width = useTimeline(s => s.width)
  const height = useTimeline(s => s.height)
  const aspectRatio = width / height;
  const sectionWidth = cellHeight * aspectRatio;

  const numSections = useMemo(() => {
    return Math.min(Math.ceil(widthInPxAfterZoom / sectionWidth), MAX_IMAGE_SECTIONS);
  }, [widthInPxAfterZoom, sectionWidth]);

  const handleHover = (isHovering: boolean) => {
    setHoveredSegment(isHovering ? { hoveredSegment: s, area: SegmentArea.MIDDLE } : undefined);
  };

  return (
    <group
      position={[0, 0, 0]}
      onPointerEnter={() => handleHover(true)}
      onPointerLeave={() => handleHover(false)}
    >
      {Array.from({ length: numSections }).map((_, index) => (
        <Image
          key={`${s.id}-section-${index}`}
          opacity={track.visible ? 1 : 0.5}
          position={[
            (index + 0.5) * (widthInPxAfterZoom / numSections) - (widthInPxAfterZoom / 2),
            -cellHeight,
            0
          ]}
          scale={[
            widthInPxAfterZoom / numSections,
            cellHeight,
          ]}
          transparent
          url={s.assetUrl}
        />
      ))}
    </group>
  );
}