import { ReactNode } from 'react'
import { EditorView } from '@aitube/clapper-services'

import { cn } from '@/lib/utils'
import { useEditors } from '@/services/editors/useEditors'
import { useTheme } from '@/services/ui/useTheme'
import { useUI } from '@/services'

export function BottomMenuItem({
  children,
  view: expectedView,
  label,
  onClick,
}: {
  children: ReactNode

  /**
   * Name of the menu item
   */
  view?: EditorView

  /**
   * Label of the tooltip
   */
  label?: string

  /**
   * Custom handler
   */
  onClick?: () => void
}) {
  const theme = useTheme()
  const view = useEditors((s) => s.view)
  const setView = useEditors((s) => s.setView)
  const setShowExplorer = useUI((s) => s.setShowExplorer)
  const setShowVideoPlayer = useUI((s) => s.setShowVideoPlayer)

  const isActive = view === expectedView

  const tooltipLabel = label || expectedView

  const handleClick = () => {
    onClick?.()

    // nothing to do if there is no name or if we are already selecterd
    if (!expectedView || isActive) {
      return
    }
    setView(expectedView)
    setShowExplorer(true)
    setShowVideoPlayer(false)
  }

  return (
    <div
      className={cn(
        `flex flex-col`,
        `transition-all duration-150 ease-out`,
        `items-center justify-center`,
        isActive ? '' : `cursor-pointer`,
        `transition-all duration-200 ease-in-out`,
        isActive
          ? 'fill-neutral-50/80 text-neutral-50 opacity-100 hover:fill-neutral-50 hover:text-neutral-50'
          : 'fill-neutral-400/80 text-gray-400 opacity-80 hover:fill-neutral-200 hover:text-neutral-200 hover:opacity-100',
        `group`
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          `flex flex-col items-center justify-center`,
          `text-center`,
          `h-11 w-11 text-[32px]`,
          `transition-all duration-200 ease-out`,
          `stroke-1`,
          isActive ? `scale-110` : `group-hover:scale-110`
        )}
      >
        {children}
      </div>
    </div>
  )
}
