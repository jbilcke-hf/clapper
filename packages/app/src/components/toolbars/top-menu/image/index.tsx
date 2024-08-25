'use client'

import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useSettings } from '@/services/settings'
import { useUI } from '@/services/ui'

import { RenderingStrategyList } from '../lists/RenderingStrategyList'
import { ImageGenerationWorkflows } from '../lists/ImageGenerationWorkflows'
import { ImageUpscalingWorkflows } from '../lists/ImageUpscalingWorkflows'
import { IsBusy } from '../IsBusy'

import { SettingsCategory } from '@aitube/clapper-services'
import { useResolver } from '@/services/resolver/useResolver'
import { ImageDepthWorkflows } from '../lists/ImageDepthWorkflows'
import { ImageSegmentationWorkflows } from '../lists/ImageSegmentationWorkflows'
import { ImageFaceswapWorkflows } from '../lists/ImageFaceswapWorkflows'

export function TopMenuImage() {
  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

  const nbPendingRequestsForImage = useResolver(
    (s) => s.nbPendingRequestsForImage
  )
  const setShowSettings = useUI((s) => s.setShowSettings)

  const imageRenderingStrategy = useSettings((s) => s.imageRenderingStrategy)
  const setImageRenderingStrategy = useSettings(
    (s) => s.setImageRenderingStrategy
  )
  return (
    <MenubarMenu>
      <MenubarTrigger>
        <span>Image</span>
        <IsBusy nbPendingTasks={nbPendingRequestsForImage} />
      </MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem
            onClick={() => {
              setShowSettings(SettingsCategory.IMAGE)
            }}
          >
            Show advanced settings
          </MenubarItem>
          <MenubarSeparator />
          <ImageGenerationWorkflows />
          <ImageFaceswapWorkflows />
          {hasBetaAccess && (
            <>
              <ImageUpscalingWorkflows />
              <ImageDepthWorkflows />
              <ImageSegmentationWorkflows />
            </>
          )}
          <RenderingStrategyList
            current={imageRenderingStrategy}
            setter={setImageRenderingStrategy}
          />
          <MenubarSeparator />
          <MenubarItem disabled>Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
