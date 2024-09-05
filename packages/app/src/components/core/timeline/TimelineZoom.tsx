import * as React from 'react'
import { BiSolidZoomIn, BiSolidZoomOut } from 'react-icons/bi'
import { useTimeline } from '@aitube/timeline'

import { cn } from '@/lib/utils'

import { Slider } from './Slider'
import { useDebounceFn } from '@/lib/hooks'

export function TimelineZoom() {
  // .. yeah sorry about this.. we don't have a zoom level actually,
  // we have a CELL WIDTH :)
  const cellWidth = useTimeline((s) => s.cellWidth)
  const horizontalZoomLevel = cellWidth

  const setHorizontalZoomLevel = useTimeline((s) => s.setHorizontalZoomLevel)
  const minHorizontalZoomLevel = useTimeline((s) => s.minHorizontalZoomLevel)
  const maxHorizontalZoomLevel = useTimeline((s) => s.maxHorizontalZoomLevel)

  const onValueChange = (values: number[]) => {
    setHorizontalZoomLevel(values[0])
  }

  /*
  const onValueChange = useDebounceFn((values: number[]) => {
    setHorizontalZoomLevel(values[0])
  }, 250)
  */

  return (
    <div
      className={cn(
        `flex w-40 flex-row items-center justify-center`,
        `space-x-1.5 text-xl text-white/40`
      )}
    >
      <BiSolidZoomIn className="" />
      <Slider
        className={cn('w-full')}
        orientation="horizontal"
        min={minHorizontalZoomLevel}
        max={maxHorizontalZoomLevel}
        onValueChange={onValueChange}
        value={[horizontalZoomLevel]}
        defaultValue={[horizontalZoomLevel]}
      />
      <BiSolidZoomOut className="" />
    </div>
  )
}
