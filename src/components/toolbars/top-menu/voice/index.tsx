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
import { availableComputeProvidersForVoice } from "@/components/settings/constants"


export function TopMenuVoice() {
  const setShowSettings = useUI(s => s.setShowSettings)
  const voiceProvider = useSettings(s => s.voiceProvider)
  const setVoiceProvider = useSettings(s => s.setVoiceProvider)
  const voiceRenderingStrategy = useSettings((s) => s.voiceRenderingStrategy)
  const setVoiceRenderingStrategy = useSettings((s) => s.setVoiceRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger>Voice</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(true) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <ProviderList providers={availableComputeProvidersForVoice} current={voiceProvider} setter={setVoiceProvider} />
          <RenderingStrategyList current={voiceRenderingStrategy} setter={setVoiceRenderingStrategy} />
          <MenubarSeparator />
          <MenubarItem
             disabled
            >Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
