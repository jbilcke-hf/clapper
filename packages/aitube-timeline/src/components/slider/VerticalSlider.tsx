import * as React from "react"

import { cn } from "@/utils/cn"

import { TimelineSliderBase } from "./TimelineSliderBase"

const VerticalSlider = React.forwardRef<
  React.ElementRef<typeof TimelineSliderBase>,
  React.ComponentPropsWithoutRef<typeof TimelineSliderBase>
>(({ className, ...props }, ref) => (
  <TimelineSliderBase
    ref={ref}
    trackClass="w-4 h-full"
    rangeClass="w-full"
    thumbClass="w-4 h-4"
    className={cn("h-full", className)}
    {...props}
    orientation="vertical"
  />
))

VerticalSlider.displayName = "VerticalSlider"

export { VerticalSlider }
