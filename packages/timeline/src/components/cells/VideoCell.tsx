import React, { useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { a } from "@react-spring/three";

import { SegmentArea } from "@/types/timeline";

import { SpecializedCellProps } from "./types";
import { useTimeline } from "@/index";

const MAX_PREVIEW_SECTIONS = 16;

export function VideoCell({
  segment,
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
  track
}: SpecializedCellProps) {
  const [videos, setVideos] = useState<HTMLVideoElement[]>([]);
  const width = useTimeline(s => s.width)
  const height = useTimeline(s => s.height)
  const aspectRatio = width / height;
  const sectionWidth = cellHeight * aspectRatio;

  const numPreviews = useMemo(() => {
    return Math.min(Math.ceil(widthInPxAfterZoom / sectionWidth), MAX_PREVIEW_SECTIONS);
  }, [widthInPxAfterZoom, sectionWidth]);

  useEffect(() => {
    const newVideos = Array(numPreviews).fill(null).map((_null, index) => {
      const vid = document.createElement("video");
      vid.src = segment.assetUrl;
      vid.crossOrigin = "Anonymous";
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.currentTime = ((segment.assetDurationInMs / 1000) / numPreviews) * index;
      return vid;
    });
    setVideos(newVideos);

    return () => {
      newVideos.forEach(video => video.pause());
    };
  }, [segment.assetUrl, numPreviews]);

  useEffect(() => {
    // this automatically play the video on hover
    // this is nice but the implementation is a bit broken
    // (we shouldn't play ALL the videos at once, only the one under the cursor)
    // so I propose to disable it for now
    return
    videos.forEach((video, index) => {
      if (isHovered) {
        video.currentTime = (video.duration / numPreviews) * index;
        if (video.paused) video.play();
      } else {
        if (!video.paused) video.pause();
      }
    });
  }, [isHovered, videos, numPreviews]);

  /*
  const handleHover = (isHovering: boolean) => {
    setHoveredSegment(isHovering ? {
      hoveredSegment: segment,
      area: SegmentArea.MIDDLE
    } : undefined);
  };
  */

  return (
    <a.group
    key={segment.id}
    position={[0, 0, 0]}

    // autoplay has been disabled
    //onPointerEnter={() => handleHover(true)}
    //onPointerLeave={() => handleHover(false)}
  >
    <group position={[-widthInPxAfterZoom / 2, -cellHeight, 0]}>
      {videos.map((video, index) => {
        const startX = index * sectionWidth;
        const endX = Math.min((index + 1) * sectionWidth, widthInPxAfterZoom);
        const sectionWidthCropped = endX - startX;
        
        return (
          <mesh
            key={`${segment.id}-preview-${index}`}
            position={[startX + sectionWidthCropped / 2, 0, 0]}
          >
            <planeGeometry args={[sectionWidthCropped, cellHeight]} />
            <meshStandardMaterial
              emissive="white"
              emissiveIntensity={1.0}
              side={THREE.FrontSide}
              transparent
              opacity={track.visible ? 1 : 0.5}
            >
              <videoTexture attach="map" args={[video]} />
              <videoTexture attach="emissiveMap" args={[video]} />
            </meshStandardMaterial>
          </mesh>
        );
      })}
    </group>
  </a.group>
  );
}