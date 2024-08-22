import { PiLightningFill } from 'react-icons/pi'

import { cn } from '@/lib/utils/cn'

export function StaticOrInteractiveTag({
  isInteractive = false,
  size = 'md',
  className = '',
}: {
  isInteractive?: boolean
  size?: 'sm' | 'md'
  className?: string
}) {
  const isStatic = !isInteractive

  return (
    <div
      className={cn(
        `flex flex-none flex-row items-center justify-center border font-medium uppercase`,
        {
          'rounded-xs space-x-0.5 py-0.5 pl-0.5 pr-1 text-2xs': size === 'sm',
          'space-x-1 rounded py-1 pl-1 pr-2 text-xs': size === 'md',
          'border-yellow-600 text-yellow-600': isInteractive,
          // " text-red-500 border-red-500": isLive,
          'border-neutral-600 text-neutral-600': isStatic,
        },
        className
      )}
    >
      <PiLightningFill />
      <span className="-mb-[1px]">
        {isInteractive
          ? 'Interactive'
          : // : isLive ? "Live"
            'Static content'}
      </span>
    </div>
  )
}
