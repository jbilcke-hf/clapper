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

import { ProviderList } from "../ProviderList"
import { RenderingStrategyList } from "../RenderingStrategyList"
import { availableComputeProvidersForMusic } from "@/components/settings/constants"


export function TopMenuMusic() {
  const setShowSettings = useUI(s => s.setShowSettings)
  const musicProvider = useSettings(s => s.musicProvider)
  const setMusicProvider = useSettings(s => s.setMusicProvider)
  const musicRenderingStrategy = useSettings((s) => s.musicRenderingStrategy)
  const setMusicRenderingStrategy = useSettings((s) => s.setMusicRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger>Music</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(true) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <ProviderList providers={availableComputeProvidersForMusic} current={musicProvider} setter={setMusicProvider} />
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
