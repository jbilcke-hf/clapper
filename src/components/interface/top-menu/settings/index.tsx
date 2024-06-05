"use client"

import { useEffect } from "react"

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
import { useSettingsRendering } from "@/settings/rendering"
import { RenderingStrategy } from "@aitube/timeline"
import { useSettingsView } from "@/settings/view"

export function TopMenuSettings() {
  const setShowSettings = useSettingsView(s => s.setShowSettings)

  const storyboardRenderingStrategy = useSettingsRendering((s) => s.storyboardRenderingStrategy)
  const setStoryboardRenderingStrategy = useSettingsRendering((s) => s.setStoryboardRenderingStrategy)

  const videoRenderingStrategy = useSettingsRendering((s) => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useSettingsRendering((s) => s.setVideoRenderingStrategy)

  const labels = {
    [RenderingStrategy.ON_DEMAND]: "Render on click",
    [RenderingStrategy.ON_SCREEN_ONLY]: "Render visible items",
    [RenderingStrategy.ON_SCREEN_THEN_SURROUNDING]: "Render visible + surrounding items",
    [RenderingStrategy.ON_SCREEN_THEN_ALL]: "Full rendering (for GPU-rich people)"
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>Settings</MenubarTrigger>
      <MenubarContent>

        <MenubarSub>
          <MenubarItem
            onClick={() => { setShowSettings(true) }}>All settings (API, tokens..)</MenubarItem>
          <MenubarSeparator />
          <MenubarSubTrigger>Storyboards generation</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarCheckboxItem
              disabled
              checked={storyboardRenderingStrategy === RenderingStrategy.ON_DEMAND}
              onClick={(e) => {
                setStoryboardRenderingStrategy(RenderingStrategy.ON_DEMAND)
                e.stopPropagation()
                e.preventDefault()
                return false
              }}>
             {labels[RenderingStrategy.ON_DEMAND]}
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              disabled
              checked={storyboardRenderingStrategy === RenderingStrategy.ON_SCREEN_ONLY}
              onClick={(e) => {
                setStoryboardRenderingStrategy(RenderingStrategy.ON_SCREEN_ONLY)
                e.stopPropagation()
                e.preventDefault()
                return false
              }}>
              {labels[RenderingStrategy.ON_SCREEN_ONLY]}
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              disabled
              checked={storyboardRenderingStrategy === RenderingStrategy.ON_SCREEN_THEN_SURROUNDING}
              onClick={(e) => {
                setStoryboardRenderingStrategy(RenderingStrategy.ON_SCREEN_THEN_SURROUNDING)
                e.stopPropagation()
                e.preventDefault()
                return false
              }}>
              {labels[RenderingStrategy.ON_SCREEN_THEN_SURROUNDING]}
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              disabled
              checked={storyboardRenderingStrategy === RenderingStrategy.ON_SCREEN_THEN_ALL}
              onClick={(e) => {
                setStoryboardRenderingStrategy(RenderingStrategy.ON_SCREEN_THEN_ALL)
                e.stopPropagation()
                e.preventDefault()
                return false
              }}>
              {labels[RenderingStrategy.ON_SCREEN_THEN_ALL]}
            </MenubarCheckboxItem>
          </MenubarSubContent>
        </MenubarSub>

        <MenubarSub>
          <MenubarSubTrigger>Videos generation</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarCheckboxItem
              disabled
              checked={videoRenderingStrategy === RenderingStrategy.ON_DEMAND}
              onClick={(e) => {
                setVideoRenderingStrategy(RenderingStrategy.ON_DEMAND)
                e.stopPropagation()
                e.preventDefault()
                return false
              }}>
              {labels[RenderingStrategy.ON_DEMAND]}
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              disabled
              checked={videoRenderingStrategy === RenderingStrategy.ON_SCREEN_ONLY}
              onClick={(e) => {
                setVideoRenderingStrategy(RenderingStrategy.ON_SCREEN_ONLY)
                e.stopPropagation()
                e.preventDefault()
                return false
              }}>
              {labels[RenderingStrategy.ON_SCREEN_ONLY]}
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              disabled
              checked={videoRenderingStrategy === RenderingStrategy.ON_SCREEN_THEN_SURROUNDING}
              onClick={(e) => {
                setVideoRenderingStrategy(RenderingStrategy.ON_SCREEN_THEN_SURROUNDING)
                e.stopPropagation()
                e.preventDefault()
                return false
              }}>
              {labels[RenderingStrategy.ON_SCREEN_THEN_SURROUNDING]}
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              disabled
              checked={videoRenderingStrategy === RenderingStrategy.ON_SCREEN_THEN_ALL}
              onClick={(e) => {
                setVideoRenderingStrategy(RenderingStrategy.ON_SCREEN_THEN_ALL)
                e.stopPropagation()
                e.preventDefault()
                return false
              }}>
              {labels[RenderingStrategy.ON_SCREEN_THEN_ALL]}
            </MenubarCheckboxItem>
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
