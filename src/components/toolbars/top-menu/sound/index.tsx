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
import { SettingsCategory } from "@aitube/clapper-services"
import { SoundGenerationModelList } from "../lists/SoundGenerationModelList"
import { useResolver } from "@/services/resolver/useResolver"
import { IsBusy } from "../IsBusy"

export function TopMenuSound() {
  const nbPendingRequestsForSound = useResolver(s => s.nbPendingRequestsForSound)
  const setShowSettings = useUI(s => s.setShowSettings)
  const soundRenderingStrategy = useSettings((s) => s.soundRenderingStrategy)
  const setSoundRenderingStrategy = useSettings((s) => s.setSoundRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger><span>Sound</span><IsBusy nbPendingTasks={nbPendingRequestsForSound} /></MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.SOUND) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <SoundGenerationModelList />
          <RenderingStrategyList current={soundRenderingStrategy} setter={setSoundRenderingStrategy} />
          <MenubarSeparator />
          <MenubarItem
             disabled
            >Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
