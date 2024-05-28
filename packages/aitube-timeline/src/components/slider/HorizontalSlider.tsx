import * as React from "react"

import { cn } from "@/utils/cn"

import { TimelineSliderBase } from "./TimelineSliderBase"

const HorizontalSlider = React.forwardRef<
  React.ElementRef<typeof TimelineSliderBase>,
  React.ComponentPropsWithoutRef<typeof TimelineSliderBase>
>(({ className, ...props }, ref) => (
  <TimelineSliderBase
    ref={ref}
    trackClass="h-4 w-full"
    rangeClass="h-full"
    thumbClass="h-4 w-4"
    className={cn("w-full", className)}
    {...props}
    orientation="horizontal"
  />
))

HorizontalSlider.displayName = "HorizontalSlider"

export { HorizontalSlider }
