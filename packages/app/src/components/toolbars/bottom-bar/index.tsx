import { cn } from '@/lib/utils'

import { DesktopBottomBar } from './DesktopBottomBar'
import { MobileBottomBar } from './MobileBottomBar'

export function BottomBar() {
  return (
    <div
      className={cn(
        `absolute bottom-0 flex flex-row`,
        `items-center justify-between`,
        `right-0 left-0`
      )}
    >
      <MobileBottomBar />
      <DesktopBottomBar />
    </div>
  )
}
