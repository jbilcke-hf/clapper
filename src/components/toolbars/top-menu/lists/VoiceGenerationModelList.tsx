"use client"

import {
  MenubarCheckboxItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar"

import { TagColor } from "@/components/tags/types"
import { Tag } from "@/components/tags/Tag"
import { ComputeProvider } from "@/types"
import { availableModelsForVoiceGeneration } from "@/components/settings/constants"
import { useSettings } from "@/services/settings"
import { ComputeProviderName } from "@/components/core/providers/ComputeProviderName"
import { ComputeProviderLogo } from "@/components/core/providers/ComputeProviderLogo"
import { cn } from "@/lib/utils"

import { hasNoPublicAPI } from "./hasNoPublicAPI"
import { formatProvider } from "./formatProvider"

export function VoiceGenerationModelList() {

  const provider = useSettings(s => s.voiceProvider)
  const setProvider = useSettings(s => s.setVoiceProvider)
  const model = useSettings(s => s.voiceGenerationModel)
  const setModel = useSettings(s => s.setVoiceGenerationModel)

  const availableProviders = Object.keys(availableModelsForVoiceGeneration) as ComputeProvider[]
  if (!availableProviders) { return null }

  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <Tag size="lg" color={TagColor.ORANGE}>generate&nbsp;voice</Tag>
        <div className={cn(`flex flex-row space-x-2 items-center`)}>
          <ComputeProviderLogo
            provider={(provider && model) ? provider : undefined}
            height={18}
            className={cn(`rounded-full`)}
          />
          <div>{model || "None"}</div>
        </div>
      </MenubarSubTrigger>
      <MenubarSubContent>
        {availableProviders.map(p => (
        <MenubarSub key={p}>
          <MenubarSubTrigger>
            <ComputeProviderName>{p}</ComputeProviderName>
          </MenubarSubTrigger>
          <MenubarSubContent>
            {(availableModelsForVoiceGeneration[p] || []).map(m => (
              <MenubarCheckboxItem
                key={m}
                checked={provider === p && model === m}
                disabled={hasNoPublicAPI(m)}
                onClick={(e) => {
                  if (hasNoPublicAPI(m)) {
                    e.stopPropagation()
                    e.preventDefault()
                    return false
                  }
                  setProvider(p)
                  setModel(m)
                  e.stopPropagation()
                  e.preventDefault()
                  return false
                }}>
                {m}
              </MenubarCheckboxItem>
            ))}
          </MenubarSubContent>
        </MenubarSub>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}