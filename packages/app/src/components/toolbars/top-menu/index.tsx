import { cn } from '@aitube/timeline'
import { TbBrandDiscord } from 'react-icons/tb'
import { FaGithubAlt } from 'react-icons/fa'
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'

import { Menubar } from '@/components/ui/menubar'
import { useUI, useResolver, useAssistant } from '@/services'

import { TopMenuFile } from './file'
import { TopMenuEdit } from './edit'
import { TopMenuImage } from './image'
import { TopMenuVideo } from './video'
import { TopMenuVoice } from './voice'
import { TopMenuSound } from './sound'
import { TopMenuMusic } from './music'
import { TopMenuAssistant } from './assistant'
import { TopMenuView } from './view'
import { TopMenuLogo } from './TopMenuLogo'
import { TopMenuPlugins } from './plugins'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ToggleView } from './ToggleView'
import { UIWindowLayout } from '@aitube/clapper-services'
import { Tasks } from '../bottom-bar/tasks'
import { ToggleWindowLayout } from './ToggleWindowLayout'
import { ToggleFullScreen } from './ToggleFullScreen'
import { IconSwitch } from '@/components/monitor/icons/icon-switch'
import { useVoiceAssistant } from '@/services/assistant/useVoiceAssistant'

export function TopMenu() {
  const isBusyResolving = useResolver((s) => s.isBusyResolving)

  // this should only be called on and at only one place in the project
  const { isSupported, isListening, start, stop } = useVoiceAssistant()

  const showTimeline = useUI((s) => s.showTimeline)
  const setShowTimeline = useUI((s) => s.setShowTimeline)
  const showExplorer = useUI((s) => s.showExplorer)
  const setShowExplorer = useUI((s) => s.setShowExplorer)
  const showVideoPlayer = useUI((s) => s.showVideoPlayer)
  const setShowVideoPlayer = useUI((s) => s.setShowVideoPlayer)
  const showAssistant = useUI((s) => s.showAssistant)
  const setShowAssistant = useUI((s) => s.setShowAssistant)
  const setIsTopMenuOpen = useUI((s) => s.setIsTopMenuOpen)
  const windowLayout = useUI((s) => s.windowLayout)
  const setWindowLayout = useUI((s) => s.setWindowLayout)
  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

  return (
    <Menubar
      className="w-full pl-2"
      onValueChange={(value) => {
        setIsTopMenuOpen(!!value)
      }}
    >
      <TopMenuLogo />
      <TopMenuFile />
      {hasBetaAccess && <TopMenuEdit />}
      <TopMenuImage />
      <TopMenuVideo />
      <TopMenuVoice />
      <TopMenuSound />
      <TopMenuMusic />
      <TopMenuAssistant />
      <TopMenuPlugins />
      <TopMenuView />
      <div
        className={cn(
          `flex flex-grow flex-row items-center justify-end space-x-3 px-2 text-xs`
        )}
      >
        {
          // clap?.meta?.title || "Untitled"
        }

        {isSupported && (
          <IconSwitch
            onIcon={BiMicrophone}
            offIcon={BiMicrophoneOff}
            isToggledOn={isListening}
            onClick={() => {
              if (isListening) {
                stop()
              } else {
                start()
              }
            }}
            size="xs"
            iconClass={isListening ? 'text-green-500' : 'text-red-500'}
          >
            {
              // isListening ? 'AI is listening..' : 'voice control disabled'
            }
          </IconSwitch>
        )}

        {windowLayout === UIWindowLayout.GRID ? (
          <>
            <ToggleView
              className="col-span-1 row-span-4 row-start-1 border-r"
              isVisible={showExplorer}
              setVisible={setShowExplorer}
            >
              Toggle Explorer
            </ToggleView>
            {/*
          <ToggleView
            className="col-span-4 row-span-1 row-start-4 border-t"
            isVisible={showTimeline}
            setVisible={setShowTimeline}
          >
            Toggle Timeline
          </ToggleView>
          */}

            <ToggleView
              className="col-span-1 col-start-3 row-span-2 border-r border-b border-l"
              isVisible={showVideoPlayer}
              setVisible={setShowVideoPlayer}
            >
              Toggle Monitor
            </ToggleView>
            <ToggleView
              className="col-span-1 col-start-4 row-span-4 border-l"
              isVisible={showAssistant}
              setVisible={setShowAssistant}
            >
              Toggle Assistant
            </ToggleView>
          </>
        ) : (
          <>
            <Tasks />
          </>
        )}

        <ToggleFullScreen />

        <ToggleWindowLayout />

        <Tooltip>
          <TooltipTrigger className="">
            <div className="ml-2 scale-100 cursor-pointer text-neutral-300/70 transition-all duration-200 ease-in-out hover:scale-110 hover:text-neutral-100/90">
              <a href="https://discord.gg/AEruz9B92B" target='"_blank'>
                <TbBrandDiscord className="h-4 w-4" />
              </a>
            </div>
          </TooltipTrigger>
          <TooltipContent className="mt-2 mr-4 text-xs font-light">
            Community
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger className="">
            <div className="scale-100 cursor-pointer text-neutral-300/70 transition-all duration-200 ease-in-out hover:scale-110 hover:text-neutral-100/90">
              <a href="https://github.com/jbilcke-hf/clapper" target='"_blank'>
                <FaGithubAlt className="h-4 w-4" />
              </a>
            </div>
          </TooltipTrigger>
          <TooltipContent className="mt-2 mr-4 text-xs font-light">
            Code
          </TooltipContent>
        </Tooltip>
      </div>
    </Menubar>
  )
}
