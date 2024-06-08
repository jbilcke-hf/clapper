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
import { availableComputeProvidersForVideos } from "@/components/settings/constants"
import { VideoGenerationModelList } from "../lists/VideoGenerationModelList"
import { VideoUpscalingModelList } from "../lists/VideoUpscalingModelList"
import { SettingsCategory } from "@/types"

export function TopMenuVideo() {
  const setShowSettings = useUI(s => s.setShowSettings)
  const videoProvider = useSettings(s => s.videoProvider)
  const setVideoProvider = useSettings(s => s.setVideoProvider)
  const videoGenerationModel = useSettings(s => s.videoGenerationModel)
  const setVideoGenerationModel = useSettings(s => s.setVideoGenerationModel)
  const videoUpscalingModel = useSettings(s => s.videoUpscalingModel)
  const setVideoUpscalingModel = useSettings(s => s.setVideoUpscalingModel)
  const videoRenderingStrategy = useSettings((s) => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useSettings((s) => s.setVideoRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger>Video</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.VIDEO) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <VideoGenerationModelList provider={videoProvider} current={videoGenerationModel} setter={setVideoGenerationModel} />
          <VideoUpscalingModelList provider={videoProvider} current={videoUpscalingModel} setter={setVideoUpscalingModel} />
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
