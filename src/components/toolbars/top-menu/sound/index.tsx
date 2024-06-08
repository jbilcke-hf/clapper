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
import { useSettings } from "@/controllers/settings"
import { useUI } from "@/controllers/ui"

import { ProviderList } from "../lists/ProviderList"
import { RenderingStrategyList } from "../lists/RenderingStrategyList"
import { availableComputeProvidersForSound } from "@/components/settings/constants"
import { SettingsCategory } from "@/types"

export function TopMenuSound() {
  const setShowSettings = useUI(s => s.setShowSettings)
  const soundProvider = useSettings(s => s.soundProvider)
  const setSoundProvider = useSettings(s => s.setSoundProvider)
  const soundRenderingStrategy = useSettings((s) => s.soundRenderingStrategy)
  const setSoundRenderingStrategy = useSettings((s) => s.setSoundRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger>Sound</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.SOUND) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <ProviderList providers={availableComputeProvidersForSound} current={soundProvider} setter={setSoundProvider} />
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
