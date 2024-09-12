import { cn } from '@/lib/utils'

import { DesktopBottomBar } from './DesktopBottomBar'
import { MobileBottomBar } from './MobileBottomBar'

export function BottomBar() {
  return (
    <div
      className={cn(
        `absolute bottom-0 flex flex-row`,
        `items-center justify-between`,
        `left-0 right-0`
      )}
    >
      <MobileBottomBar />
      <DesktopBottomBar />
    </div>
  )
}
