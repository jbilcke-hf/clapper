import {
  TbPlayerPlay,
  TbPlayerPlayFilled,
  TbPlayerPause,
  TbPlayerPauseFilled,
  TbPlayerSkipBack,
  TbPlayerSkipBackFilled,
  TbPlayerTrackNext,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrev,
  TbPlayerTrackPrevFilled,
} from 'react-icons/tb'
import { useTimeline } from '@aitube/timeline'

import { cn } from '@/lib/utils'

import { Counter } from '../Counter'
import { IconSwitch } from '../icons/icon-switch'
import { useMonitor } from '@/services/monitor/useMonitor'
import { useTheme } from '@/services/ui/useTheme'

export function PlayerControls({ className }: { className?: string }) {
  const theme = useTheme()
  const isPlaying = useMonitor((s) => s.isPlaying)
  const togglePlayback = useMonitor((s) => s.togglePlayback)
  const jumpAt = useMonitor((s) => s.jumpAt)

  const cursorTimestampAtInMs = useTimeline((s) => s.cursorTimestampAtInMs)
  const durationInMs = useTimeline((s) => s.durationInMs)

  const handleAccelerate = () => {}

  return (
    <div
      className={cn(
        `@container flex flex-row items-center justify-between`,
        `transition-all duration-200 ease-out`,
        `w-full max-w-[500px] @md:w-[50%]`,
        className
      )}
    >
      <Counter
        valueInMs={cursorTimestampAtInMs}
        color={theme.monitorPrimaryTextColor || theme.defaultPrimaryColor || ''}
      />
      <div
        className={cn(
          `flex flex-row items-center justify-between`,
          `transition-all duration-100 ease-out`,
          `h-18`
        )}
      >
        <IconSwitch
          onIcon={TbPlayerSkipBackFilled}
          offIcon={TbPlayerSkipBack}
          onClick={jumpAt}
          size="sm"
          thickOnHover
        />
        <IconSwitch
          onIcon={TbPlayerPlayFilled}
          offIcon={TbPlayerPlay}
          onIconAlt={TbPlayerPauseFilled}
          offIconAlt={TbPlayerPause}
          onClick={togglePlayback}
          isAlt={isPlaying}
          size="md"
          thickOnHover
        />
        <IconSwitch
          onIcon={TbPlayerTrackNextFilled}
          offIcon={TbPlayerTrackNext}
          onClick={handleAccelerate}
          disabled
          size="sm"
          thickOnHover
        />
      </div>
      <Counter
        valueInMs={durationInMs}
        color={theme.monitorSecondaryTextColor || theme.defaultTextColor || ''}
      />
    </div>
  )
}
