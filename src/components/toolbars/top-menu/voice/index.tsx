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
import { VoiceGenerationModelList } from "../lists/VoiceGenerationModelList"
import { SettingsCategory } from "@aitube/clapper-services"
import { useResolver } from "@/services/resolver/useResolver"
import { IsBusy } from "../IsBusy"

export function TopMenuVoice() {
  const nbPendingRequestsForVoice = useResolver(s => s.nbPendingRequestsForVoice)
  const setShowSettings = useUI(s => s.setShowSettings)
  const voiceRenderingStrategy = useSettings((s) => s.voiceRenderingStrategy)
  const setVoiceRenderingStrategy = useSettings((s) => s.setVoiceRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger><span>Voice</span><IsBusy nbPendingTasks={nbPendingRequestsForVoice} /></MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.VOICE) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <VoiceGenerationModelList />
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
