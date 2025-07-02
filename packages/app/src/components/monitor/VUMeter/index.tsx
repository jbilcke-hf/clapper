import React, { useRef, useEffect, useState } from 'react'
import { useAudio } from '@/services'
import { cn } from '@/lib/utils/cn'

const BOX_COUNT = 80
const BOX_COUNT_RED = 3
const BOX_COUNT_YELLOW = 8
const GRADUATIONS = [0, -5, -10, -15, -20, -30, -40, -50]

const graduations = (
  <div className="flex h-full flex-col justify-between text-right text-3xs text-white/25">
    {GRADUATIONS.map((db) => (
      <div key={db}>{db}</div>
    ))}
  </div>
)

const Meter = React.forwardRef<HTMLDivElement>(({}, ref) => (
  <div ref={ref} className="flex h-full w-full flex-grow flex-col gap-[1px]">
    {[...Array(BOX_COUNT)].map((_, index) => (
      <div
        key={index}
        className={cn(
          `w-full flex-grow duration-75`,
          index < BOX_COUNT_RED
            ? 'bg-red-700/100'
            : index < BOX_COUNT_RED + BOX_COUNT_YELLOW
              ? 'bg-yellow-700/100'
              : 'bg-lime-700/100'
        )}
      />
    ))}
  </div>
))

Meter.displayName = 'Meter'

export function VUMeter({ className = 'w-24 h-full' }) {
  const audioContext = useAudio((s) => s.audioContext)
  const currentlyPlaying = useAudio((s) => s.currentlyPlaying)
  const leftMeterRef = useRef<HTMLDivElement>(null)
  const rightMeterRef = useRef<HTMLDivElement>(null)
  const prevActiveBoxesRef = useRef({ left: 0, right: 0 })
  const animationFrameRef = useRef<number>(null)

  useEffect(() => {
    if (!audioContext) return

    const analyserLeft = audioContext.createAnalyser()
    const analyserRight = audioContext.createAnalyser()
    analyserLeft.fftSize = 256
    analyserRight.fftSize = 256
    const bufferLength = analyserLeft.frequencyBinCount
    const dataArrayLeft = new Uint8Array(bufferLength)
    const dataArrayRight = new Uint8Array(bufferLength)

    const splitter = audioContext.createChannelSplitter(2)
    currentlyPlaying.forEach((source) => {
      source.gainNode.connect(splitter)
    })
    splitter.connect(analyserLeft, 0)
    splitter.connect(analyserRight, 1)

    const sensitivity = 2.2

    const updateMeter = () => {
      if (!leftMeterRef.current || !rightMeterRef.current) return

      analyserLeft.getByteFrequencyData(dataArrayLeft)
      analyserRight.getByteFrequencyData(dataArrayRight)

      const averageLeft =
        dataArrayLeft.reduce((acc, val) => acc + val, 0) / bufferLength
      const averageRight =
        dataArrayRight.reduce((acc, val) => acc + val, 0) / bufferLength

      const normalizedLeft = Math.min(1, (averageLeft / 255) * sensitivity)
      const normalizedRight = Math.min(1, (averageRight / 255) * sensitivity)

      const activeBoxesLeft = Math.floor(normalizedLeft * BOX_COUNT)
      const activeBoxesRight = Math.floor(normalizedRight * BOX_COUNT)

      if (activeBoxesLeft !== prevActiveBoxesRef.current.left) {
        updateMeterDisplay(leftMeterRef.current, activeBoxesLeft)
        prevActiveBoxesRef.current.left = activeBoxesLeft
      }

      if (activeBoxesRight !== prevActiveBoxesRef.current.right) {
        updateMeterDisplay(rightMeterRef.current, activeBoxesRight)
        prevActiveBoxesRef.current.right = activeBoxesRight
      }

      animationFrameRef.current = requestAnimationFrame(updateMeter)
    }

    updateMeter()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      analyserLeft.disconnect()
      analyserRight.disconnect()
      splitter.disconnect()
      currentlyPlaying.forEach((source) => {
        source.gainNode.disconnect(splitter)
      })
    }
  }, [audioContext, currentlyPlaying])

  const updateMeterDisplay = (element: HTMLDivElement, activeBoxes: number) => {
    const boxes = element.children

    for (let i = 0; i < BOX_COUNT; i++) {
      const box = boxes[BOX_COUNT - 1 - i] as HTMLDivElement
      if (i < activeBoxes) {
        box.style.opacity = '1'
      } else {
        box.style.opacity = '0.6'
      }
    }
  }

  return (
    <div className={`flex justify-between ${className}`}>
      {graduations}
      <div className="ml-1.5 flex h-full w-full justify-between space-x-1">
        <Meter ref={leftMeterRef} />
        <Meter ref={rightMeterRef} />
      </div>
    </div>
  )
}
