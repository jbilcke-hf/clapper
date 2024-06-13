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
import { availableModelsForVideoGeneration } from "@/components/settings/constants"
import { hasNoPublicAPI } from "./hasNoPublicAPI"

export function VideoGenerationModelList({
  provider,
  current,
  setter,
}: {
  provider?: ComputeProvider
  current?: string
  setter: (model: string) => void
}) {
  const models: string[] = provider ? (availableModelsForVideoGeneration[provider] || []) : []

  if (models.length === 0) { return null }
  
  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <Tag size="lg" color={TagColor.RED}>generate&nbsp;video</Tag>
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
            {
              // if the model is unavailable, we should add a tooltip like this:
              // https://x.com/flngr/status/1800968844581929094
              model
            }
          </MenubarCheckboxItem>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}