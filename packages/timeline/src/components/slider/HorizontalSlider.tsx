import * as React from "react"

import { cn } from "@/utils/cn"

import { TimelineSliderBase } from "./TimelineSliderBase"

const HorizontalSlider = React.forwardRef<
  React.ElementRef<typeof TimelineSliderBase>,
  React.ComponentPropsWithoutRef<typeof TimelineSliderBase>
>(({ className, ...props }, ref) => (
  <TimelineSliderBase
    ref={ref}

    // overriding styles here isn't easy, 
    // it's probably easier to do it in TimelineSliderBase
    trackClass="h-4 w-full rounded-none"
    rangeClass="h-full rounded-none"
    thumbClass="h-4 w-1"

    className={cn("w-full", className)}
    {...props}
    orientation="horizontal"
  />
))

HorizontalSlider.displayName = "HorizontalSlider"

export { HorizontalSlider }
