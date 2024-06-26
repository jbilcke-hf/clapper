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
import { VideoGenerationModelList } from "../lists/VideoGenerationModelList"
import { VideoUpscalingModelList } from "../lists/VideoUpscalingModelList"
import { SettingsCategory } from "@/types"
import { useResolver } from "@/services/resolver/useResolver"
import { IsBusy } from "../IsBusy"
import { VideoDepthModelList } from "../lists/VideoDepthModelList"
import { VideoSegmentationModelList } from "../lists/VideoSegmentationModelList"

export function TopMenuVideo() {
  const nbPendingRequestsForVideo = useResolver(s => s.nbPendingRequestsForVideo)
  const setShowSettings = useUI(s => s.setShowSettings)

  const videoRenderingStrategy = useSettings((s) => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useSettings((s) => s.setVideoRenderingStrategy)
 
  return (
    <MenubarMenu>
      <MenubarTrigger><span>Video</span><IsBusy nbPendingTasks={nbPendingRequestsForVideo} /></MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.VIDEO) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <VideoGenerationModelList />
          <VideoUpscalingModelList />
          <VideoDepthModelList />
          <VideoSegmentationModelList />
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
