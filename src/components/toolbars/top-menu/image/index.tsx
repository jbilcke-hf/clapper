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
import { availableComputeProvidersForImages } from "@/components/settings/constants"
import { ImageGenerationModelList } from "../lists/ImageGenerationModelList"
import { ImageUpscalingModelList } from "../lists/ImageUpscalingModelList"
import { ComputeProvider, SettingsCategory } from "@/types"

export function TopMenuImage() {
  const setShowSettings = useUI(s => s.setShowSettings)
  const imageProvider = useSettings(s => s.imageProvider)
  const setImageProvider = useSettings(s => s.setImageProvider)
  const imageGenerationModel = useSettings(s => s.imageGenerationModel)
  const setImageGenerationModel = useSettings(s => s.setImageGenerationModel)
  const imageUpscalingModel = useSettings(s => s.imageUpscalingModel)
  const setImageUpscalingModel = useSettings(s => s.setImageUpscalingModel)
  const imageRenderingStrategy = useSettings((s) => s.imageRenderingStrategy)
  const setImageRenderingStrategy = useSettings((s) => s.setImageRenderingStrategy)
  return (
    <MenubarMenu>
      <MenubarTrigger>Image</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.IMAGE) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <ImageGenerationModelList provider={imageProvider} current={imageGenerationModel} setter={setImageGenerationModel} />
          <ImageUpscalingModelList provider={imageProvider} current={imageUpscalingModel} setter={setImageUpscalingModel} />
          <ProviderList providers={availableComputeProvidersForImages} current={imageProvider} setter={(newProvider: ComputeProvider) => {
            if (imageProvider === newProvider) { return }
            setImageProvider(newProvider)
            setImageGenerationModel(undefined)
            setImageUpscalingModel(undefined)
          }} />
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
