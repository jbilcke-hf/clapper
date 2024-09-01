import { cn } from '@/lib/utils'
import { useTheme } from '@/services/ui/useTheme'

import { Metrics } from './metrics'
import { APP_REVISION } from '@/lib/core/constants'
import { Tasks } from './tasks'
import { useTimeline } from '@aitube/timeline'

export function BottomToolbar() {
  const theme = useTheme()
  const bpm = useTimeline((s) => s.bpm)
  const frameRate = useTimeline((s) => s.frameRate)

  return (
    <div
      className={cn(
        `absolute bottom-0 flex flex-row`,
        `items-center justify-between`,
        `left-0 right-0 h-7`,
        `px-3`,
        `text-xs font-light text-white/40`
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
          <span className="text-white/40">app version:</span>
          <span className="text-white/55">{APP_REVISION}</span>
        </div>

        {/*
        Note sure that's really useful since there is a garbage collector,
        I got a situation where I had 1.2 Gb when loaded empty,
        and it turned into 800 Mb after loading a big project,
        thanks to the GC kicking in.

        what would be more useful is to collect system metrics in the Desktop version.
        <Metrics />
        */}

        <div className="flex flex-row space-x-1">
          <span className="text-white/40">BPM:</span>
          <span className="text-white/55">{Math.round(bpm * 1000) / 1000}</span>
        </div>

        <div className="flex flex-row space-x-1">
          <span className="text-white/40">FPS:</span>
          <span className="text-white/55">
            {Math.round(frameRate * 1000) / 1000}
          </span>
        </div>
      </div>
      <div className="flex flex-row space-x-6">
        <Tasks />
      </div>
    </div>
  )
}
