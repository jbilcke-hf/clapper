import { ClapProject } from "@aitube/clap"
import { useTimeline } from "@aitube/timeline"

import { cn } from "@/lib/utils"

import { TopMenu } from "../top-menu"

export function TopBar() {
  const clap: ClapProject = useTimeline(s => s.clap)

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