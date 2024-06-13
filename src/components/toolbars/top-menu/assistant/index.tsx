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
import { availableComputeProvidersForAssistant } from "@/components/settings/constants"
import { ComputeProvider, SettingsCategory } from "@/types"
import { AssistantModelList } from "../lists/AssistantModelList"

export function TopMenuAssistant() {
  const setShowSettings = useUI(s => s.setShowSettings)
  const assistantProvider = useSettings(s => s.assistantProvider)
  const setAssistantProvider = useSettings(s => s.setAssistantProvider)
  const assistantModel = useSettings(s => s.assistantModel)
  const setAssistantModel = useSettings(s => s.setAssistantModel)
  return (
    <MenubarMenu>
      <MenubarTrigger>Assistant</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.ASSISTANT) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <AssistantModelList provider={assistantProvider} current={assistantModel} setter={setAssistantModel} />
          <ProviderList providers={availableComputeProvidersForAssistant} current={assistantProvider} setter={(newProvider: ComputeProvider) => {
            if (assistantProvider === newProvider) { return }
            setAssistantProvider(newProvider)
            setAssistantModel(undefined)
          }} />
          <MenubarSeparator />
          <MenubarItem
             disabled
            >Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
