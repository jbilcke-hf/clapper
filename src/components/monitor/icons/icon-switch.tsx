import { ReactNode } from "react"
import { IconType } from "react-icons/lib"

import { cn } from "@/lib/utils"

import { SingleIcon } from "./single-icon"

export function IconSwitch({
  onIcon,
  onIconAlt,
  offIcon,
  offIconAlt,
  onClick,
  isToggledOn = false,
  isAlt = false,
  disabled = false,
  className = "",
  size = "md",
  thickOnHover = false,
  children = null,
  iconClass = "",
}: {
  onIcon: IconType
  onIconAlt?: IconType
  offIcon: IconType
  offIconAlt?: IconType
  onClick?: () => void
  isToggledOn?: boolean
  isAlt?: boolean
  disabled?: boolean
  className?: string
  size?: "2xs" | "xs" | "sm" | "md"
  thickOnHover?: boolean
  children?: ReactNode
  iconClass?: string
}) {

  const iconSize = 
    size === "2xs" ? "w-4 h-4" :
    size === "xs" ? "w-5 h-5" :
    size === "sm" ? "w-6 h-6" :
    "w-8 h-8"

  return (
    <div className={cn(
      // this `group` is important to coordinate the behavior of the inner icon
      // (toggle a class during a "mouse hover" over the group)
      `group`,
      `select-none`,
      `flex flex-row items-center justify-center cursor-pointer`,
      `transition-all ease-in-out duration-100`,
      `rounded-full`,
      `text-sm font-light`,
      disabled
        ? `pointer-events-none opacity-50`
        : `cursor-pointer text-gray-400  hover:text-gray-100`,
      className
    )}
    onClick={onClick ? () => {
      if (!disabled) {
        onClick()
      }
    } : undefined}
    >
      <div className={cn(
        `flex flex-row items-center justify-center`,
        "scale-100",
        `transition-all ease-in-out duration-100`,
        "group-hover:scale-110",
        `w-12 h-12`,
        {
          "w-9 h-9": size === "sm",
        },
      )}>
        <SingleIcon
          type={offIcon}
          className={cn(
            iconSize,
            {
              "opacity-0 pointer-events-none": isToggledOn || isAlt
            },
            iconClass
          )}
          thickOnHover={thickOnHover}
        />
        <SingleIcon
          type={onIcon}
          className={cn(
            iconSize,
            {
              "opacity-0 pointer-events-none": !isToggledOn || isAlt
            },
            iconClass
          )}
          thickOnHover={thickOnHover}
        />
        <SingleIcon
          type={offIconAlt}
          className={cn(
            iconSize,
            {
              "opacity-0 pointer-events-none": isToggledOn || !isAlt
            },
            iconClass
          )}
          thickOnHover={thickOnHover}
        />
        <SingleIcon
          type={onIconAlt}
          className={cn(
            iconSize,
            {
              "opacity-0 pointer-events-none": !isToggledOn || !isAlt
            },
            iconClass
          )}
          thickOnHover={thickOnHover}
        />
      </div>
      {children
        ? <div className={cn(
            `transition-all duration-100 ease-in-out`,
            `group-hover:cursor-pointer -ml-2`,
            `pointer-events-none`,
          )}>
         {children}
      </div> : null}
    </div>
  )
}