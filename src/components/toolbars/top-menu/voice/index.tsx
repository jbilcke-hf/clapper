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
import { availableComputeProvidersForVoice } from "@/components/settings/constants"
import { VoiceGenerationModelList } from "../lists/VoiceGenerationModelList"
import { ComputeProvider, SettingsCategory } from "@/types"
import { useResolver } from "@/controllers/resolver/useResolver"
import { IsBusy } from "../IsBusy"

export function TopMenuVoice() {
  const nbPendingRequestsForVoice = useResolver(s => s.nbPendingRequestsForVoice)
  const setShowSettings = useUI(s => s.setShowSettings)
  const voiceProvider = useSettings(s => s.voiceProvider)
  const setVoiceProvider = useSettings(s => s.setVoiceProvider)
  const voiceGenerationModel = useSettings(s => s.voiceGenerationModel)
  const setVoiceGenerationModel = useSettings(s => s.setVoiceGenerationModel)
  const voiceRenderingStrategy = useSettings((s) => s.voiceRenderingStrategy)
  const setVoiceRenderingStrategy = useSettings((s) => s.setVoiceRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger><span>Voice</span><IsBusy nbPendingTasks={nbPendingRequestsForVoice} /></MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.VOICE) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <VoiceGenerationModelList provider={voiceProvider} current={voiceGenerationModel} setter={setVoiceGenerationModel} />
          <ProviderList providers={availableComputeProvidersForVoice} current={voiceProvider} setter={(newProvider: ComputeProvider) => {
            if (voiceProvider === newProvider) { return }
            setVoiceProvider(newProvider)
            setVoiceGenerationModel(undefined)
           }} />
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
