import { ClapProject } from "@aitube/clap"
import { useTimelineState } from "@aitube/timeline"

import { cn } from "@/lib/utils"

import { TopMenu } from "../top-menu"
import { APP_NAME, APP_REVISION } from "@/lib/core/constants"


export function TopBar() {
  const clap: ClapProject = useTimelineState(s => s.clap)

  return (
    <div className={cn(
      `flex flex-row`,
      `w-full h-10`,
      `bg-stone-900 items-center`,
      `border-b`,
      `border-b-stone-700`,
    )}>
      <TopMenu />
      <div className={cn(
        `absolute flex flex-row flex-grow w-full`,
        `items-center justify-center`,
        `pointer-events-none`,
        `text-xs text-stone-300`
      )}>
        {
        // clap?.meta?.title || "Untitled"
        }
        <span className="text-stone-300 mr-1">{APP_NAME}.app</span>
        <span className="text-stone-500">({APP_REVISION})</span>
      </div>
    </div>
  )
}