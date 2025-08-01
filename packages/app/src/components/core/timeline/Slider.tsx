import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
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
      'relative flex touch-none items-center select-none',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        `relative grow overflow-hidden rounded-sm border border-neutral-900 bg-neutral-100 dark:bg-neutral-50/20`,
        `h-1.5 w-full`,
        trackClass
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          `absolute bg-neutral-900/80 dark:bg-neutral-50/40`,
          `h-full rounded-none`,
          rangeClass
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        `block border border-neutral-400 bg-neutral-400 shadow-lg ring-offset-white transition-colors focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-400 dark:bg-neutral-400 dark:ring-offset-neutral-400 dark:focus-visible:ring-neutral-400`,
        `h-3 w-3 rounded-full`,
        thumbClass
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = 'Slider'

export { Slider }
