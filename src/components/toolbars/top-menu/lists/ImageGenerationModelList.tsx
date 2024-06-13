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
} from "@/components/ui/menubar"

import { TagColor } from "@/components/tags/types"
import { Tag } from "@/components/tags/Tag"
import { ComputeProvider } from "@/types"
import { availableModelsForImageGeneration } from "@/components/settings/constants"
import { hasNoPublicAPI } from "./hasNoPublicAPI"

export function ImageGenerationModelList({
  provider,
  current,
  setter,
}: {
  provider?: ComputeProvider
  current?: string
  setter: (model: string) => void
}) {
  const models: string[] = provider ? (availableModelsForImageGeneration[provider] || []) : []

  if (models.length === 0) { return null }
  
  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <Tag size="lg" color={TagColor.BLUE}>generate&nbsp;image</Tag>
        {current || "None"}
      </MenubarSubTrigger>
      <MenubarSubContent>
        {models.map(model => (
          <MenubarCheckboxItem
             key={model}
            checked={current === model}
            disabled={hasNoPublicAPI(model)}
            onClick={(e) => {
              if (hasNoPublicAPI(model)) {
                e.stopPropagation()
                e.preventDefault()
                return false
              }
              setter(model)
              e.stopPropagation()
              e.preventDefault()
              return false
            }}>
            {model}
          </MenubarCheckboxItem>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}