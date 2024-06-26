import { ReactNode } from "react"
import { EditorView } from "@aitube/clapper-services"

import { cn } from "@/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useEditor } from "@/services/editor/useEditor"
import { useTheme } from "@/services/ui/useTheme"

export function EditorSideMenuItem({
  children,
  view: expectedView,
  label,
  unmanaged
}: {
  children: ReactNode

  /**
   * Name of the side menu item
   */
  view?: EditorView

  /**
   * Label of the tooltip
   */
  label?: string

  /**
   * If the side menu item is just for show, and managed externally
   */
  unmanaged?: boolean
}) {
  const theme = useTheme()
  const view = useEditor(s => s.view)
  const setView = useEditor(s => s.setView)

  const isActive = !unmanaged && view === expectedView

  const tooltipLabel = label || expectedView

  const handleClick = () => {
    // nothing to do if there is no name or if we are already selecterd
    if (unmanaged || !expectedView || isActive) {
      return
    }

    console.log(`handleClick("${expectedView}")`)
    setView(expectedView)
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger
        asChild
        disabled={!tooltipLabel}
        className="w-full h-14">
        <div className={cn(
          `flex flex-col w-full h-14`,
          `transition-all duration-200 ease-out`,
          `items-center justify-center`,
          unmanaged || isActive ? '' :  `cursor-pointer`,
          `border-l-[3px]`,
          isActive
          ? ' text-gray-50 fill-gray-50 hover:text-gray-50 hover:fill-gray-50'
          : ' text-gray-400 fill-gray-400 hover:text-gray-200 hover:tefillxt-gray-200',
          `group`
        )}
        style={{
          background: theme.editorBgColor || "#eeeeee",
          borderColor: isActive ? theme.defaultPrimaryColor || "#ffffff" : "#111827"
        }}
        onClick={handleClick}>
          <div className={cn(
            `flex-col items-center justify-center`,
            `text-center text-[28px]`,
            `transition-all duration-200 ease-out`,
            isActive ? `scale-110` : `group-hover:scale-110`
          )}>
            {children}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p className="">{tooltipLabel}</p>
      </TooltipContent>
    </Tooltip>
  )
}