import { CiViewTimeline } from 'react-icons/ci'
import { MdMovieEdit } from 'react-icons/md'
import { GoVideo } from 'react-icons/go'
import { GrUserSettings } from 'react-icons/gr'
import { PiBookOpenTextLight, PiTreeStructureLight } from 'react-icons/pi'
import { EditorView, SettingsCategory } from '@aitube/clapper-services'

import { cn } from '@/lib/utils'
import { useEditors, useUI } from '@/services'
import { useTheme } from '@/services/ui/useTheme'

import { NatureIcon } from '../editors-menu/NatureIcon'
import { BottomMenuItem } from './BottomMenuItem'
import { useEffect } from 'react'
import { useBreakpoints } from '@/lib/hooks/useBreakpoints'

export function MobileBottomBar() {
  const theme = useTheme()
  const setView = useEditors((s) => s.setView)
  const setShowExplorer = useUI((s) => s.setShowExplorer)
  const setShowVideoPlayer = useUI((s) => s.setShowVideoPlayer)
  const setShowAssistant = useUI((s) => s.setShowAssistant)
  const setShowSettings = useUI((s) => s.setShowSettings)

  const { isMd } = useBreakpoints()

  useEffect(() => {
    if (isMd) {
      setShowExplorer(true)
      setShowVideoPlayer(true)
    } else {
      setShowAssistant(false)
      setShowExplorer(false)
      setShowVideoPlayer(true)
    }
  }, [isMd, setShowExplorer, setShowVideoPlayer, setShowAssistant])

  return (
    <div
      className={cn(
        `flex flex-row md:hidden`,
        `items-center justify-between`,
        `h-12 w-full px-3`,
        `border-t`,
        `text-xs font-light text-white/40`,
        `transition-all duration-200 ease-in-out`
      )}
      style={{
        backgroundColor:
          theme.editorMenuBgColor || theme.defaultBgColor || '#eeeeee',
        borderTopColor:
          theme.editorBorderColor || theme.defaultBorderColor || '#eeeeee',
      }}
    >
      <BottomMenuItem
        view={EditorView.PROJECT}
        label="Project settings"
        onClick={() => {
          setShowExplorer(false)
        }}
      >
        <MdMovieEdit />
      </BottomMenuItem>
      <BottomMenuItem view={EditorView.SCRIPT} label="Story">
        <PiBookOpenTextLight />
      </BottomMenuItem>
      <BottomMenuItem view={EditorView.ENTITY} label="Entities">
        <NatureIcon />
      </BottomMenuItem>
      <BottomMenuItem view={EditorView.SEGMENT} label="Segment editor">
        <CiViewTimeline />
      </BottomMenuItem>
      <BottomMenuItem
        view={EditorView.WORKFLOW}
        label="Workflows"
        onClick={() => {
          setShowExplorer(false)
        }}
      >
        <PiTreeStructureLight />
      </BottomMenuItem>
      <BottomMenuItem
        label="Monitor"
        onClick={() => {
          setShowExplorer(false)
          setShowVideoPlayer(true)
        }}
      >
        <GoVideo />
      </BottomMenuItem>
      <BottomMenuItem
        label="Preferences"
        onClick={() => setShowSettings(SettingsCategory.PROVIDER)}
      >
        <GrUserSettings className="h-6 w-6" />
      </BottomMenuItem>
    </div>
  )
}
