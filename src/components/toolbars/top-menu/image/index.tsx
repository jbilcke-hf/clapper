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
import { availableComputeProvidersForImages } from "@/components/settings/constants"


export function TopMenuImage() {
  const setShowSettings = useUI(s => s.setShowSettings)
  const imageProvider = useSettings(s => s.imageProvider)
  const setImageProvider = useSettings(s => s.setImageProvider)
  const imageRenderingStrategy = useSettings((s) => s.imageRenderingStrategy)
  const setImageRenderingStrategy = useSettings((s) => s.setImageRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger>Image</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(true) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <ProviderList providers={availableComputeProvidersForImages} current={imageProvider} setter={setImageProvider} />
          <RenderingStrategyList current={imageRenderingStrategy} setter={setImageRenderingStrategy} />
          <MenubarSeparator />
          <MenubarItem
             disabled
            >Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
