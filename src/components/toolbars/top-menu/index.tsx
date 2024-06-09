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
import Image from "next/image"
import logo from "../../../app/logo-v2.png"

export function TopMenu() {
  return (
    <Menubar className="w-full">
      {/*
      it doesn't look great when minified like this
      <Image src={logo} height={32} alt="Clapper" /> */}
      <span
        className="scale-[88%] text-yellow-400 pl-2 text-lg font-bold tracking-[-0.03em] mr-2"
        ><span>Clapper</span><span className="text-yellow-100">.</span><span
      className="hidden absolute text-3xs text-red-500/100 tracking-[0.05em] uppercase mt-1.5 -ml-0 -rotate-6  ">ai</span></span>
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
