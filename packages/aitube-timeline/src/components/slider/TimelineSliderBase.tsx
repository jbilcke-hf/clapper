import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/utils/cn"

const TimelineSliderBase = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClass?: string
    rangeClass?: string
    thumbClass?: string
  }
>(({ className, trackClass, rangeClass, thumbClass, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className={cn(
      `relative grow overflow-hidden border border-gray-600 rounded bg-gray-100 dark:bg-gray-700/70`,
      trackClass,
    )}>
      <SliderPrimitive.Range className={cn(
        `absolute bg-gray-900/80 dark:bg-gray-900/80`,
        rangeClass,
       )} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn(
      `block rounded-sm border border-gray-400 bg-gray-500 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-400 dark:bg-gray-500 shadow-md dark:ring-offset-gray-500 dark:focus-visible:ring-gray-400`,
      thumbClass
     )} />
  </SliderPrimitive.Root>
))
TimelineSliderBase.displayName = "TimelineSliderBase"

export { TimelineSliderBase }
