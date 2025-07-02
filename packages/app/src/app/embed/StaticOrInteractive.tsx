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
          'text-2xs space-x-0.5 rounded-xs py-0.5 pr-1 pl-0.5': size === 'sm',
          'space-x-1 rounded-sm py-1 pr-2 pl-1 text-xs': size === 'md',
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
