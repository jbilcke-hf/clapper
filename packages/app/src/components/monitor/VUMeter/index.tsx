import React, { useRef, useEffect, useState } from 'react'
import { useAudio } from '@/services'

export function VUMeter({ className = 'w-10 h-full' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContext = useAudio((s) => s.audioContext)
  const currentlyPlaying = useAudio((s) => s.currentlyPlaying)
  const [meterValues, setMeterValues] = useState({ left: 0, right: 0 })

  const boxCount = 40
  const boxCountRed = 3
  const boxCountYellow = 8
  const boxGapFraction = 0.15
  const columnGap = 20
  const leftMargin = 18
  const leftTextMargin = 18

  const redOn = 'rgba(255,47,30,0.3)'
  const redOff = 'rgba(64,12,8,0.4)'
  const yellowOn = 'rgba(255,215,5,0.3)'
  const yellowOff = 'rgba(64,53,0,0.4)'
  const greenOn = 'rgba(53,255,30,0.3)'
  const greenOff = 'rgba(13,64,8,0.4)'

  const graduations = [0, -5, -10, -15, -20, -30, -40, -50]

  // vu-meter sensitivity
  const sensitivity = 2.2

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

    let animationFrameId: number

    const updateMeter = () => {
      analyserLeft.getByteFrequencyData(dataArrayLeft)
      analyserRight.getByteFrequencyData(dataArrayRight)
      
      const averageLeft = dataArrayLeft.reduce((acc, val) => acc + val, 0) / bufferLength
      const averageRight = dataArrayRight.reduce((acc, val) => acc + val, 0) / bufferLength
      
      // Apply sensitivity to the normalized values
      const normalizedLeft = Math.min(1, (averageLeft / 255) * sensitivity)
      const normalizedRight = Math.min(1, (averageRight / 255) * sensitivity)
      
      setMeterValues({
        left: normalizedLeft,
        right: normalizedRight
      })

      animationFrameId = requestAnimationFrame(updateMeter)
    }

    updateMeter()

    return () => {
      cancelAnimationFrame(animationFrameId)
      analyserLeft.disconnect()
      analyserRight.disconnect()
      splitter.disconnect()
      currentlyPlaying.forEach((source) => {
        source.gainNode.disconnect(splitter)
      })
    }
  }, [audioContext, currentlyPlaying, sensitivity])

  // Drawing effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width: number,
      height: number,
      meterWidth: number,
      boxHeight: number,
      boxGapY: number,
      boxWidth: number,
      boxGapX: number

    const calculateDimensions = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      width = rect.width * dpr
      height = rect.height * dpr
      canvas.width = width
      canvas.height = height
      ctx.scale(dpr, dpr)

      meterWidth = (rect.width - columnGap) / 2
      boxHeight = rect.height / (boxCount + (boxCount + 1) * boxGapFraction)
      boxGapY = boxHeight * boxGapFraction
      boxWidth = meterWidth - boxGapY * 2
      boxGapX = (meterWidth - boxWidth) / 2
    }

    const draw = () => {
      calculateDimensions()

      // Clear the canvas
      ctx.clearRect(0, 0, width, height)

      // Draw meters
      drawMeter(ctx, leftMargin, meterValues.left)
      drawMeter(ctx, meterWidth + columnGap, meterValues.right)

      // Draw graduations
      drawGraduations(ctx)

      requestAnimationFrame(draw)
    }

    const drawMeter = (
      ctx: CanvasRenderingContext2D,
      xOffset: number,
      value: number
    ) => {
      const activeBoxes = Math.floor(value * boxCount)

      for (let i = 0; i < boxCount; i++) {
        const id = i + 1 // Box ID from bottom to top
        const x = xOffset + boxGapX
        const y = height / window.devicePixelRatio - (i + 1) * (boxHeight + boxGapY) + boxGapY // Y-coordinate from bottom to top

        ctx.beginPath()
        ctx.rect(x, y, boxWidth, boxHeight)

        if (id <= activeBoxes) {
          ctx.fillStyle = getBoxColor(boxCount - i, true) // Reverse color mapping
        } else {
          ctx.fillStyle = getBoxColor(boxCount - i, false) // Reverse color mapping
        }

        ctx.fill()
      }
    }

    const drawGraduations = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'right'

      graduations.forEach((db, index) => {
        const y = (height / window.devicePixelRatio) * (index / (graduations.length - 1))
        ctx.fillText(`${db}`, width / window.devicePixelRatio - leftTextMargin, y)
      })
    }

    const getBoxColor = (id: number, isActive: boolean) => {
      if (id <= boxCountRed) {
        return isActive ? redOn : redOff
      } else if (id <= boxCountRed + boxCountYellow) {
        return isActive ? yellowOn : yellowOff
      } else {
        return isActive ? greenOn : greenOff
      }
    }

    // Initial draw and window resize handler
    const handleResize = () => {
      calculateDimensions()
      draw()
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [meterValues])

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}