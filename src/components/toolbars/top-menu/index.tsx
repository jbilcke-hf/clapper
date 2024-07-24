import { cn } from '@aitube/timeline'
import { TbBrandDiscord } from 'react-icons/tb'
import { FaGithubAlt } from 'react-icons/fa'

import { Menubar } from '@/components/ui/menubar'
import { useUI, useResolver } from '@/services'

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

export function TopMenu() {
  const isBusyResolving = useResolver((s) => s.isBusyResolving)

  const setIsTopMenuOpen = useUI((s) => s.setIsTopMenuOpen)

  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

  return (
    <Menubar
      className="ml-1 w-full"
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
        <Tooltip>
          <TooltipTrigger className="">
            <div className="scale-100 cursor-pointer text-stone-300/70 transition-all duration-200 ease-in-out hover:scale-110 hover:text-stone-100/90">
              <a href="https://discord.gg/AEruz9B92B" target='"_blank'>
                <TbBrandDiscord className="h-4 w-4" />
              </a>
            </div>
          </TooltipTrigger>
          <TooltipContent className="mr-4 mt-2 text-xs font-light">
            Community
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger className="">
            <div className="scale-100 cursor-pointer text-stone-300/70 transition-all duration-200 ease-in-out hover:scale-110 hover:text-stone-100/90">
              <a href="https://discord.gg/AEruz9B92B" target='"_blank'>
                <FaGithubAlt className="h-4 w-4" />
              </a>
            </div>
          </TooltipTrigger>
          <TooltipContent className="mr-4 mt-2 text-xs font-light">
            Code
          </TooltipContent>
        </Tooltip>
      </div>
    </Menubar>
  )
}
