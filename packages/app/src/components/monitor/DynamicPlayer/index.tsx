'use client'

import { cn } from '@/lib/utils'
import { useMonitor } from '@/services/monitor/useMonitor'

import { useRenderer } from '@/services/renderer/useRenderer'
import { DynamicBuffer } from './DynamicBuffer'

export const DynamicPlayer = ({ className }: { className?: string }) => {
  const isPlaying = useMonitor((s) => s.isPlaying)
  const dataUriBuffer1 = useRenderer((s) => s.dataUriBuffer1)
  const dataUriBuffer2 = useRenderer((s) => s.dataUriBuffer2)
  const activeBufferNumber = useRenderer((s) => s.activeBufferNumber)

  return (
    <div
      className={cn(
        `@container flex w-full flex-grow flex-col items-center`,
        className
      )}
    >
      <DynamicBuffer
        segment={dataUriBuffer1}
        isPlaying={isPlaying}
        isVisible={activeBufferNumber === 1}
      />
      <DynamicBuffer
        segment={dataUriBuffer2}
        isPlaying={isPlaying}
        isVisible={activeBufferNumber === 2}
      />
    </div>
  )
}
