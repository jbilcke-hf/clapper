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
import { availableComputeProvidersForVideos } from "@/components/settings/constants"


export function TopMenuVideo() {
  const setShowSettings = useUI(s => s.setShowSettings)
  const videoProvider = useSettings(s => s.videoProvider)
  const setVideoProvider = useSettings(s => s.setVideoProvider)
  const videoRenderingStrategy = useSettings((s) => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useSettings((s) => s.setVideoRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger>Video</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(true) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <ProviderList providers={availableComputeProvidersForVideos} current={videoProvider} setter={setVideoProvider} />
          <RenderingStrategyList current={videoRenderingStrategy} setter={setVideoRenderingStrategy} />
          <MenubarSeparator />
          <MenubarItem
             disabled
            >Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
