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
import { availableComputeProvidersForMusic } from "@/components/settings/constants"
import { ComputeProvider, SettingsCategory } from "@/types"
import { MusicGenerationModelList } from "../lists/MusicGenerationModelList"
import { useResolver } from "@/controllers/resolver/useResolver"
import { IsBusy } from "../IsBusy"

export function TopMenuMusic() {
  const nbPendingRequestsForMusic = useResolver(s => s.nbPendingRequestsForMusic)
  const setShowSettings = useUI(s => s.setShowSettings)
  const musicProvider = useSettings(s => s.musicProvider)
  const setMusicProvider = useSettings(s => s.setMusicProvider)
  const musicGenerationModel = useSettings(s => s.musicGenerationModel)
  const setMusicGenerationModel = useSettings(s => s.setMusicGenerationModel)
  const musicRenderingStrategy = useSettings((s) => s.musicRenderingStrategy)
  const setMusicRenderingStrategy = useSettings((s) => s.setMusicRenderingStrategy)

  return (
    <MenubarMenu>
      <MenubarTrigger><span>Music</span><IsBusy nbPendingTasks={nbPendingRequestsForMusic} /></MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.MUSIC) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <MusicGenerationModelList provider={musicProvider} current={musicGenerationModel} setter={setMusicGenerationModel} />
          <ProviderList providers={availableComputeProvidersForMusic} current={musicProvider} setter={(newProvider: ComputeProvider) => {
            if (musicProvider === newProvider) { return }
            setMusicProvider(newProvider)
            setMusicGenerationModel(undefined)
          }} />
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
