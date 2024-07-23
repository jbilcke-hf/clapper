import { useState, useEffect, useCallback } from 'react'

interface PerformanceMeterOptions {
  delayBetweenMeasures: number
}

interface PerformanceMeterResult {
  isAvailable: boolean
  isMeasuring: boolean
  bytes: number | null
  humanReadableString: string | null
}

const usePerformanceMeter = ({
  delayBetweenMeasures,
}: PerformanceMeterOptions): PerformanceMeterResult => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false)
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false)
  const [bytes, setBytes] = useState<number | null>(null)
  const [humanReadableString, setHumanReadableString] = useState<string | null>(
    null
  )

  const measureMemory = useCallback(async () => {
    if (!isAvailable) return

    setIsMeasuring(true)
    try {
      const result = await (performance as any).measureUserAgentSpecificMemory()
      setBytes(result.bytes)
      setHumanReadableString(formatBytes(result.bytes))
    } catch (error) {
      console.error('Error measuring memory:', error)
    } finally {
      setIsMeasuring(false)
    }
  }, [isAvailable])

  useEffect(() => {
    const checkAvailability = () => {
      const available = 'measureUserAgentSpecificMemory' in performance
      setIsAvailable(available)
      return available
    }

    if (checkAvailability()) {
      measureMemory() // Start measuring immediately
      const intervalId = setInterval(measureMemory, delayBetweenMeasures * 1000)
      return () => clearInterval(intervalId)
    }
  }, [delayBetweenMeasures, measureMemory])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return { isAvailable, isMeasuring, bytes, humanReadableString }
}

export default usePerformanceMeter
