import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  memo,
} from 'react'
import { IoClose } from 'react-icons/io5'
import { LuPanelTopClose, LuPanelTopOpen } from 'react-icons/lu'
import { RiFullscreenFill } from 'react-icons/ri'

import { cn } from '@/lib/utils'
import { useSettings, useTheme } from '@/services'
import { useWindows } from '@/services/windows/useWindows'
import { useFullscreenStatus } from '@/lib/hooks'
import { isValidNumber } from '@aitube/clap'

// Helper function to parse size
const parseSize = (size: number | string): number => {
  if (typeof size === 'number') return size
  if (typeof size === 'string') {
    const parsed = parseInt(size, 10)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// FruityDesktop component
export const FruityDesktop: React.FC<{
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}> = ({ className = '', children, style }) => {
  return (
    <div
      className={cn(`flex h-full w-full ${className}`, `select-none`)}
      style={style}
    >
      {children}
    </div>
  )
}

// FruityWindow component
export const FruityWindow: React.FC<{
  id: string
  title?: string | JSX.Element
  defaultWidth?: number | string
  minWidth?: number | string
  defaultHeight?: number | string
  minHeight?: number | string
  defaultX?: number
  defaultY?: number
  canBeReduced?: boolean
  canBeClosed?: boolean
  canBeFullScreen?: boolean
  toolbar?: (props: { isFocused: boolean }) => JSX.Element
  children?: React.ReactNode
}> = memo(
  ({
    id,
    title = 'Untitled',
    defaultWidth = 800,
    minWidth = 160,
    defaultHeight = 600,
    minHeight = 100,
    defaultX,
    defaultY,
    canBeReduced = true,
    canBeClosed = true,
    canBeFullScreen = true,
    toolbar,
    children,
  }) => {
    const theme = useTheme()
    const windowRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [resizeDirection, setResizeDirection] = useState('')

    const interfaceSnapWindowsToGrid = useSettings(
      (s) => s.interfaceSnapWindowsToGrid
    )

    const win = useWindows(useCallback((s) => s.windows[id], [id]))
    const addWindow = useWindows((s) => s.addWindow)
    const updateWindow = useWindows((s) => s.updateWindow)
    const updateWindowPosition = useWindows((s) => s.updateWindowPosition)
    const updateWindowSize = useWindows((s) => s.updateWindowSize)
    const focusWindow = useWindows((s) => s.focusWindow)
    const removeWindow = useWindows((s) => s.removeWindow)
    const setSnapToGrid = useWindows((s) => s.setSnapToGrid)

    const [isFullscreen, setFullscreen, fullscreenRef] = useFullscreenStatus()

    useEffect(() => {
      // commented because for now this doesn't work well
      // setSnapToGrid(interfaceSnapWindowsToGrid)
    }, [interfaceSnapWindowsToGrid, setSnapToGrid])

    useEffect(() => {
      if (!win) {
        addWindow({
          id,
          title,
          isVisible: true,
          width: parseSize(defaultWidth),
          height: parseSize(defaultHeight),
          x: defaultX,
          y: defaultY,
          canBeReduced,
          canBeClosed,
        })
      }
    }, [
      addWindow,
      canBeClosed,
      canBeReduced,
      defaultHeight,
      defaultWidth,
      defaultX,
      defaultY,
      id,
      title,
      win,
    ])

    useEffect(() => {
      const handleMouseDown = (e: MouseEvent) => {
        if (windowRef.current && windowRef.current.contains(e.target as Node)) {
          focusWindow(id)
        }
      }

      document.addEventListener('mousedown', handleMouseDown)
      return () => {
        document.removeEventListener('mousedown', handleMouseDown)
      }
    }, [focusWindow, id])

    const handleDragStart = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isValidNumber(win?.x) && isValidNumber(win?.y)) {
          setIsDragging(true)
          setDragOffset({
            x: e.clientX,
            y: e.clientY,
          })
        }
      },
      [win?.x, win?.y]
    )

    const handleDrag = useCallback(
      (e: MouseEvent) => {
        if (isDragging && win) {
          const dx = e.clientX - dragOffset.x
          const dy = e.clientY - dragOffset.y
          const newX = win.x + dx
          const newY = Math.max(0, win.y + dy)
          updateWindowPosition(id, newX, newY)
          setDragOffset({ x: e.clientX, y: e.clientY })
        }
      },
      [dragOffset.x, dragOffset.y, id, isDragging, updateWindowPosition, win]
    )

    const handleDragEnd = useCallback(() => {
      setIsDragging(false)
    }, [])

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
      } else {
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)
      }
      return () => {
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)
      }
    }, [isDragging, handleDrag, handleDragEnd])
    const handleResizeStart = useCallback(
      (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (win) {
          setIsResizing(true)
          setResizeDirection(direction)
          setDragOffset({
            x: e.clientX,
            y: e.clientY,
          })
        }
      },
      [win]
    )

    const handleResize = useCallback(
      (e: MouseEvent) => {
        if (isResizing && win) {
          const dx = e.clientX - dragOffset.x
          const dy = e.clientY - dragOffset.y
          let newWidth = win.width
          let newHeight = win.height
          let newX = win.x
          let newY = win.y

          const parsedMinWidth = parseSize(minWidth)
          const parsedMinHeight = parseSize(minHeight)

          if (resizeDirection.includes('w')) {
            newWidth = Math.max(parsedMinWidth, win.width - dx)
            newX = win.x + win.width - newWidth
          }
          if (resizeDirection.includes('e')) {
            newWidth = Math.max(parsedMinWidth, win.width + dx)
          }
          if (resizeDirection.includes('n')) {
            newHeight = Math.max(parsedMinHeight, win.height - dy)
            newY = Math.max(0, win.y + win.height - newHeight)
          }
          if (resizeDirection.includes('s')) {
            newHeight = Math.max(parsedMinHeight, win.height + dy)
          }

          updateWindowPosition(id, newX, newY)
          updateWindowSize(id, newWidth, newHeight)
          setDragOffset({ x: e.clientX, y: e.clientY })
        }
      },
      [
        dragOffset,
        id,
        isResizing,
        minHeight,
        minWidth,
        resizeDirection,
        updateWindowPosition,
        updateWindowSize,
        win,
      ]
    )

    const handleResizeEnd = useCallback(() => {
      setIsResizing(false)
      setResizeDirection('')
    }, [])

    useEffect(() => {
      if (isResizing) {
        document.addEventListener('mousemove', handleResize)
        document.addEventListener('mouseup', handleResizeEnd)
      } else {
        document.removeEventListener('mousemove', handleResize)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
      return () => {
        document.removeEventListener('mousemove', handleResize)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }, [isResizing, handleResize, handleResizeEnd])

    const toggleReduce = useCallback(() => {
      if (win) {
        updateWindow(id, { isReduced: !win.isReduced })
      }
    }, [id, updateWindow, win])

    const handleHeaderDoubleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === headerRef.current) {
          toggleReduce()
        }
      },
      [toggleReduce]
    )

    const windowStyle = useMemo(
      () =>
        win
          ? {
              width: isFullscreen ? '100vw' : `${win?.width}px`,
              height: isFullscreen
                ? '100svh'
                : win.isReduced
                  ? 'auto'
                  : `${win.height}px`,
              transform: isFullscreen
                ? 'none'
                : `translate(${win.x}px, ${win.y}px)`,
              zIndex: win.zIndex,
              backgroundColor: theme.editorBgColor || 'rgb(38, 38, 38)',
              borderColor:
                theme.windowBorderColor ||
                theme.editorBorderColor ||
                'rgb(64, 64, 64)',
              borderRadius: isFullscreen
                ? '0'
                : theme.windowBorderRadius || '8px',
            }
          : {},
      [isFullscreen, win, theme]
    )

    const isFocused = win.isFocused
    const windowClassName = useMemo(
      () =>
        win
          ? cn(
              `absolute overflow-hidden shadow-lg`,
              `border border-white/5`,
              isFocused ? 'shadow-xl' : '',
              isFullscreen ? 'fixed inset-0' : ''
            )
          : 'display-none',
      [win, isFocused, isFullscreen]
    )

    if (!win) return null

    return (
      <div ref={windowRef} style={windowStyle} className={windowClassName}>
        {!isFullscreen && (
          <div
            ref={headerRef}
            className={cn(
              `flex h-8 cursor-move items-center justify-between border-b border-b-white/10 px-2 text-sm text-white/60`
            )}
            onMouseDown={handleDragStart}
            onDoubleClick={handleHeaderDoubleClick}
            style={{
              backgroundColor: theme.editorMenuBgColor || 'rgb(38, 38, 38)',
            }}
          >
            {isEditing ? (
              <input
                type="text"
                value={typeof win.title === 'string' ? win.title : ''}
                onChange={(e) => updateWindow(id, { title: e.target.value })}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditing(false)
                }}
                className="rounded-none bg-neutral-950/80 px-0 text-sm text-white/60"
                autoFocus
              />
            ) : (
              <div>
                {typeof win.title === 'string'
                  ? win.title
                  : (win.title as any)({ isFocused: win.isFocused })}
              </div>
            )}
            <div className="flex space-x-2">
              {toolbar && toolbar({ isFocused: win.isFocused })}
              {canBeFullScreen && (
                <button
                  onClick={() => setFullscreen(true)}
                  className="text-white/60 hover:text-white/80"
                >
                  <RiFullscreenFill />
                </button>
              )}
              {canBeReduced && (
                <button
                  onClick={toggleReduce}
                  className="text-white/60 hover:text-white/80"
                >
                  {win.isReduced ? <LuPanelTopOpen /> : <LuPanelTopClose />}
                </button>
              )}
              {canBeClosed && (
                <button
                  onClick={() => removeWindow(id)}
                  className="text-white/60 hover:text-white/80"
                >
                  <IoClose />
                </button>
              )}
            </div>
          </div>
        )}
        {!win.isReduced && (
          <div
            ref={fullscreenRef as any}
            className={isFullscreen ? 'h-full w-full' : 'h-[calc(100%-32px)]'}
          >
            {children}
          </div>
        )}
        {!isFullscreen && !win.isReduced && (
          <>
            <div
              className="absolute left-0 top-0 h-full w-2 cursor-ew-resize"
              onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
              className="absolute right-0 top-0 h-full w-2 cursor-ew-resize"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
            <div
              className="absolute left-0 top-0 h-2 w-full cursor-ns-resize"
              onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
              className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize"
              onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            <div
              className="absolute left-0 top-0 h-2 w-2 cursor-nw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="absolute right-0 top-0 h-2 w-2 cursor-ne-resize"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="absolute bottom-0 left-0 h-2 w-2 cursor-sw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="absolute bottom-0 right-0 h-2 w-2 cursor-se-resize"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
          </>
        )}
      </div>
    )
  }
)

FruityWindow.displayName = 'FruityWindow'
