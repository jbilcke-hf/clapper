import { ClapProject } from "@aitube/clap"
import { useTimelineState } from "@aitube/timeline"

import { cn } from "@/lib/utils"

import { TopMenu } from "../top-menu"
import { APP_DOMAIN, APP_NAME, APP_REVISION } from "@/lib/core/constants"


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
    </div>
  )
}