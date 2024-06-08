import { Menubar } from "@/components/ui/menubar"

import { TopMenuFile } from "./file"

import { TopMenuImage } from "./image"
import { TopMenuVideo } from "./video"
import { TopMenuVoice } from "./voice"
import { TopMenuSound } from "./sound"
import { TopMenuMusic } from "./music"

import { TopMenuView } from "./view"
import { cn } from "@aitube/timeline"
import { APP_REVISION } from "@/lib/core/constants"

export function TopMenu() {
  return (
    <Menubar className="w-full">
      <span className="scale-[88%] text-purple-300/80 pl-1 text-lg font-bold tracking-[-0.03em] mr-4">Clapper<span
      className="hidden absolute text-4xs text-purple-100/70 tracking-[0.05em] uppercase mt-1.5 -ml-0 -rotate-6  ">ai</span></span>
      <TopMenuFile />
      <TopMenuImage />
      <TopMenuVideo />
      <TopMenuVoice />
      <TopMenuSound />
      <TopMenuMusic />
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
