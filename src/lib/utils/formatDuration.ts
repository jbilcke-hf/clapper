
import {  intervalToDuration } from 'date-fns'

export function formatDuration(float_ms: number) {

  const duration = intervalToDuration({ start: 0, end: float_ms })

  const hours = duration.hours || 0
  const minutes = duration.minutes || 0
  const seconds = duration.seconds || 0

  const total =
    (hours * 60 * 60 * 1000)
     + (minutes * 60 * 1000)
     + (seconds * 1000)

  const formatted = [
    duration.hours || 0,
    duration.minutes || 0,
    duration.seconds || 0,
    float_ms - total
  ]
  .map((num, i) => String(num as number).padStart(i === 3 ? 3 : 2, '0'))
  .join(':')

  return formatted
}
