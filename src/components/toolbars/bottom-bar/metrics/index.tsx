import usePerformanceMeter from '@/lib/hooks/usePerformanceMeter'
import { cn } from '@/lib/utils'

export function Metrics() {
  const { isAvailable, isMeasuring, bytes, humanReadableString } =
    usePerformanceMeter({
      delayBetweenMeasures: 40,
    })

  if (!isAvailable) {
    return null
  }

  return (
    <div className="flex flex-row space-x-1">
      <span className="text-stone-500">memory usage:</span>
      <span className="text-stone-400">
        {!bytes ? 'waiting..' : humanReadableString || ''}
      </span>
    </div>
  )
}
