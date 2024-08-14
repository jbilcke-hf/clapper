'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils/cn'

const VerticalSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-full w-2 grow overflow-hidden rounded-full bg-neutral-300 dark:bg-neutral-700">
      <SliderPrimitive.Range className="absolute w-full bg-neutral-700 dark:bg-neutral-50" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="-ml-1.5 block h-5 w-5 rounded-full border-2 border-neutral-700 bg-neutral-300 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-50 dark:bg-neutral-700 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300" />
  </SliderPrimitive.Root>
))
VerticalSlider.displayName = 'VerticalSlider'
export { VerticalSlider }
