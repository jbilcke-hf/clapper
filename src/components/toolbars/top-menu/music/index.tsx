"use client"

import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from "@/components/ui/menubar"
import { useSettings } from "@/services/settings"
import { useUI } from "@/services/ui"

import { RenderingStrategyList } from "../lists/RenderingStrategyList"
import { SettingsCategory } from "@/types"
import { MusicGenerationModelList } from "../lists/MusicGenerationModelList"
import { useResolver } from "@/services/resolver/useResolver"
import { IsBusy } from "../IsBusy"

export function TopMenuMusic() {
  const nbPendingRequestsForMusic = useResolver(s => s.nbPendingRequestsForMusic)
  const setShowSettings = useUI(s => s.setShowSettings)
  const musicRenderingStrategy = useSettings((s) => s.musicRenderingStrategy)
  const setMusicRenderingStrategy = useSettings((s) => s.setMusicRenderingStrategy)

  return (
    <MenubarMenu>
      <MenubarTrigger><span>Music</span><IsBusy nbPendingTasks={nbPendingRequestsForMusic} /></MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.MUSIC) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <MusicGenerationModelList />
          <RenderingStrategyList current={musicRenderingStrategy} setter={setMusicRenderingStrategy} />
          <MenubarSeparator />
          <MenubarItem
             disabled
            >Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
