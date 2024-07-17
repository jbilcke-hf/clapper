import { IconType } from 'react-icons/lib'

import { cn } from '@/lib/utils'

export function SingleIcon({
  type,
  className = '',
  thickOnHover = false,
}: {
  type?: IconType
  className?: string
  thickOnHover?: boolean
}) {
  if (!type) {
    return null
  }

  const Icon = type

  return (
    <Icon
      className={cn(
        `absolute h-8 w-8 @lg:h-9 @lg:w-9 @2xl:h-10 @2xl:w-10`,
        `transition-all duration-100 ease-in-out`,

        // icons is a bit too fat, let's thin them out
        // for a bit of flair we increase the stroke width on group hover
        thickOnHover ? `stroke-[0.5] group-hover:stroke-[1]` : ``,
        className
      )}
    />
  )
}
