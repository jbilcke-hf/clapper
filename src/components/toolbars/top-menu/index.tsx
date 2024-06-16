import { cn } from "@aitube/timeline"

import { Menubar } from "@/components/ui/menubar"
import { APP_REVISION } from "@/lib/core/constants"
import { useResolver } from "@/controllers/resolver/useResolver"

import { TopMenuFile } from "./file"
import { TopMenuImage } from "./image"
import { TopMenuVideo } from "./video"
import { TopMenuVoice } from "./voice"
import { TopMenuSound } from "./sound"
import { TopMenuMusic } from "./music"
import { TopMenuAssistant } from "./assistant"
import { TopMenuView } from "./view"
import { TopMenuLogo } from "./TopMenuLogo"

export function TopMenu() {
  const isBusyResolving = useResolver(s => s.isBusyResolving)

  return (
    <Menubar className="w-full ml-1">
      <TopMenuLogo />
      <TopMenuFile />
      <TopMenuImage />
      <TopMenuVideo />
      <TopMenuVoice />
      <TopMenuSound />
      <TopMenuMusic />
      <TopMenuAssistant />
      <TopMenuView />
      <div className={cn(`
        flex flex-row flex-grow
        px-2
        items-center justify-end
        pointer-events-none
        text-xs text-stone-300
        `
      )}>
        {
        // clap?.meta?.title || "Untitled"
        }
        <span className="text-stone-500">{APP_REVISION}</span>
      </div>
    </Menubar>
  )
}
