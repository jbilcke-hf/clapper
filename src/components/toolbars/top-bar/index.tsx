import { ClapProject } from '@aitube/clap'
import { useTimeline } from '@aitube/timeline'

import { cn } from '@/lib/utils'

import { TopMenu } from '../top-menu'

export function TopBar() {
  const clap: ClapProject = useTimeline((s) => s.clap)

  return (
    <div
      className={cn(
        `flex flex-row`,
        `h-10 w-full`,
        `items-center bg-stone-900`,
        `border-b`,
        `border-b-stone-700`
      )}
    >
      <TopMenu />
    </div>
  )
}
