import { IconType } from "react-icons/lib"

import { cn } from "@/lib/utils"

export function SingleIcon({
  type,
  className = "",
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
      `absolute w-8 h-8 @lg:w-9 @lg:h-9 @2xl:w-10 @2xl:h-10`,
      `transition-all ease-in-out duration-100`,

       // icons is a bit too fat, let's thin them out
       // for a bit of flair we increase the stroke width on group hover
       thickOnHover ? `stroke-1 group-hover:stroke-2` : ``,
      className,
    )}
  />
)
}