'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-xs border border-neutral-200 border-neutral-900 ring-offset-white focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-50 dark:border-neutral-50 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-800 dark:data-[state=checked]:bg-neutral-50 dark:data-[state=checked]:text-neutral-900',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
