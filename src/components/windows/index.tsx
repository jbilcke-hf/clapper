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

import { cn } from '@/lib/utils'
import { useTheme } from '@/services'
import { useWindows } from '@/services/windows/useWindows'
import { useFullscreenStatus } from '@/lib/hooks'
import { RiFullscreenFill } from 'react-icons/ri'
import { isValidNumber } from '@aitube/clap'

// FruityDesktop component
export const FruityDesktop: React.FC<{
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}> = ({ className = '', children, style }) => {
  return (
    <div
      className={cn(
        `flex h-full w-full ${className}`,

        // important since we are always moving the mouse and selecting things around
        `select-none`
      )}
      style={style}
    >
      {children}
    </div>
  )
}

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

    const window = useWindows(useCallback((state) => state.windows[id], [id]))
    const addWindow = useWindows((state) => state.addWindow)
    const updateWindow = useWindows((state) => state.updateWindow)
    const focusWindow = useWindows((state) => state.focusWindow)
    const removeWindow = useWindows((state) => state.removeWindow)

    const [isFullscreen, setFullscreen, ref] = useFullscreenStatus()

    const parseSize = (size: number | string): number => {
      if (typeof size === 'number') return size
      if (typeof size === 'string') {
        const parsed = parseInt(size, 10)
        return isNaN(parsed) ? 0 : parsed
      }
      return 0
    }

    useEffect(() => {
      if (!window) {
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
      window,
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
        if (isValidNumber(window?.x) && isValidNumber(window?.y)) {
          setIsDragging(true)
          setDragOffset({
            x: e.clientX - window.x,
            y: e.clientY - window.y,
          })
        }
      },
      [window?.x, window?.y, setIsDragging, setDragOffset]
    )

    const handleDrag = useCallback(
      (e: MouseEvent) => {
        if (isDragging && window) {
          const newY = Math.max(0, e.clientY - dragOffset.y) // Ensure y is at least 32px from the top
          updateWindow(id, {
            x: e.clientX - dragOffset.x,
            y: newY,
          })
        }
      },
      [dragOffset.x, dragOffset.y, id, isDragging, updateWindow, window]
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
        if (window) {
          setIsResizing(true)
          setResizeDirection(direction)
          setDragOffset({
            x: e.clientX,
            y: e.clientY,
          })
        }
      },
      [window, setIsResizing, setResizeDirection, setDragOffset]
    )

    const handleResize = useCallback(
      (e: MouseEvent) => {
        if (isResizing && window) {
          const dx = e.clientX - dragOffset.x
          const dy = e.clientY - dragOffset.y
          let newWidth = window.width
          let newHeight = window.height
          let newX = window.x
          let newY = window.y

          const parsedMinWidth = parseSize(minWidth)
          const parsedMinHeight = parseSize(minHeight)

          if (resizeDirection.includes('w')) {
            newWidth = Math.max(parsedMinWidth, window.width - dx)
            newX = window.x + window.width - newWidth
          }
          if (resizeDirection.includes('e')) {
            newWidth = Math.max(parsedMinWidth, window.width + dx)
          }
          if (resizeDirection.includes('n')) {
            newHeight = Math.max(parsedMinHeight, window.height - dy)
            newY = Math.max(0, window.y + window.height - newHeight)
            newHeight = window.y + window.height - newY // Adjust height based on the new Y position
          }
          if (resizeDirection.includes('s')) {
            newHeight = Math.max(parsedMinHeight, window.height + dy)
          }

          // Ensure the window doesn't go above the limit
          if (newY < 0) {
            newHeight = newHeight - (0 - newY)
            newY = 0
          }

          updateWindow(id, {
            width: newWidth,
            height: newHeight,
            x: newX,
            y: newY,
          })
          setDragOffset({ x: e.clientX, y: e.clientY })
        }
      },
      [
        dragOffset.x,
        dragOffset.y,
        id,
        isResizing,
        minHeight,
        minWidth,
        resizeDirection,
        updateWindow,
        window,
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
      if (window) {
        updateWindow(id, { isReduced: !window.isReduced })
      }
    }, [id, updateWindow, window])

    const handleHeaderDoubleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        // Check if the double-click occurred on the header background
        if (e.target === headerRef.current) {
          toggleReduce()
        }
      },
      [toggleReduce]
    )

    const windowStyle = useMemo(
      () =>
        window
          ? {
              width: isFullscreen ? '100vw' : `${window?.width}px`,
              height: isFullscreen
                ? '100vh'
                : window.isReduced
                  ? 'auto'
                  : `${window.height}px`,
              transform: isFullscreen
                ? 'none'
                : `translate(${window.x}px, ${window.y}px)`,
              zIndex: window.zIndex,
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
      [isFullscreen, window, theme]
    )

    const windowClassName = useMemo(
      () =>
        window
          ? cn(
              `absolute overflow-hidden shadow-lg`,
              `border border-white/5`,
              window.isFocused ? 'shadow-xl' : '',
              isFullscreen ? 'fixed inset-0' : ''
            )
          : 'display-none',
      [window, window?.isFocused, isFullscreen]
    )

    if (!window) return null

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
                value={typeof window.title === 'string' ? window.title : ''}
                onChange={(e) => updateWindow(id, { title: e.target.value })}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditing(false)
                }}
                className="rounded-none bg-neutral-950/80 px-0 text-sm text-white/60"
                autoFocus
              />
            ) : (
              <div
              // let's disable title editing, we don't need that for now
              // onDoubleClick={() => setIsEditing(true)}
              >
                {typeof window.title === 'string'
                  ? window.title
                  : (window.title as any)({ isFocused: window.isFocused })}
              </div>
            )}
            <div className="flex space-x-2">
              {toolbar && toolbar({ isFocused: window.isFocused })}
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
                  {window.isReduced ? <LuPanelTopOpen /> : <LuPanelTopClose />}
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
        {!window.isReduced && (
          <div
            ref={ref as any}
            className={isFullscreen ? 'h-full w-full' : 'h-[calc(100%-32px)]'}
          >
            {children}
          </div>
        )}
        {!isFullscreen && !window.isReduced && (
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
