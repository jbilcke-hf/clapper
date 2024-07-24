import { cn } from '@/lib/utils'
import { useTheme } from '@/services/ui/useTheme'

import { Metrics } from './metrics'
import { APP_REVISION } from '@/lib/core/constants'
import { Tasks } from './tasks'

export function BottomToolbar() {
  const theme = useTheme()

  return (
    <div
      className={cn(
        `absolute bottom-0 flex flex-row`,
        `items-center justify-between`,
        `left-0 right-0 h-7`,
        `px-3`,
        `text-xs font-light text-stone-400`
      )}
      style={{
        borderTop: 'solid 1px rgba(255,255,255,0.3)',
        backgroundColor:
          theme.editorMenuBgColor || theme.defaultBgColor || '#afafaf',
        // borderTopColor: theme.editorTextColor || theme.defaultBorderColor || "#bfbfbf",
        color: theme.editorTextColor || theme.defaultTextColor || '#ffffff',
      }}
    >
      <div className="flex flex-row space-x-3">
        <div className="flex flex-row space-x-1">
          <span className="text-stone-400/70">app version:</span>
          <span className="text-stone-300/70">{APP_REVISION}</span>
        </div>

        {/* <Metrics /> */}
      </div>
      <div className="flex flex-row space-x-6">
        <Tasks />
      </div>
    </div>
  )
}
