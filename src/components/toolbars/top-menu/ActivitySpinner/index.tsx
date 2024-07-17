import { CgSpinnerTwoAlt } from 'react-icons/cg'

import { cn } from '@/lib/utils'

export function ActivitySpinner({
  className = '',
  isBusy = false,
  color = '',
}: {
  className?: string
  isBusy?: boolean
  color?: string
}) {
  return (
    <CgSpinnerTwoAlt
      className={cn(
        `h-2 w-2`,
        className,
        isBusy ? 'animate-spin opacity-100' : 'opacity-0'
      )}
      style={{ color }}
    />
  )
}
