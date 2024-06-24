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
  TbPlayerTrackPrevFilled
} from "react-icons/tb"
import { useTimeline } from "@aitube/timeline"

import { cn } from "@/lib/utils"

import { Counter } from "../Counter"
import { IconSwitch } from "../icons/icon-switch"
import { useMonitor } from "@/controllers/monitor/useMonitor"
import { useTheme } from "@/controllers/ui/useTheme"

export function PlayerControls({
  className
}: {
  className?: string
}) {
  const theme = useTheme()
  const isPlaying = useMonitor((s) => s.isPlaying)
  const togglePlayback = useMonitor((s) => s.togglePlayback)
  const jumpAt = useMonitor((s) => s.jumpAt)

  const cursorTimestampAtInMs = useTimeline((s) => s.cursorTimestampAtInMs)
  const totalDurationInMs = useTimeline(s => s.totalDurationInMs)

  const handleAccelerate = () => {
  }
  
  return (
    <div className={cn(
      `@container flex flex-row items-center justify-between`,
      `transition-all duration-200 ease-out`,
      `w-full @md:w-[50%] max-w-[800px] py-2 space-x-2`,
      className
    )}>
      <Counter valueInMs={cursorTimestampAtInMs}
        color={theme.monitorSecondaryTextColor || theme.defaultTextColor || ""}
      />
      <div className={cn(
        `flex flex-row items-center justify-between`,
        `transition-all duration-200 ease-out`,
        `space-x-2 w-32 h-18 @lg:w-36 @2xl:w-40`,
      )}>
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
        valueInMs={totalDurationInMs}
        color={theme.monitorPrimaryTextColor || theme.defaultPrimaryColor || ""}
      />
    </div>
  )
}