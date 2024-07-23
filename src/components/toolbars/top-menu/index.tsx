import { cn } from '@aitube/timeline'

import { Menubar } from '@/components/ui/menubar'
import { APP_REVISION } from '@/lib/core/constants'
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
          `pointer-events-none flex flex-grow flex-row items-center justify-end px-2 text-xs text-stone-300`
        )}
      >
        {
          // clap?.meta?.title || "Untitled"
        }
      </div>
    </Menubar>
  )
}
