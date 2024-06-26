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
import { useUI } from "@/services/ui"
import { SettingsCategory } from "@aitube/clapper-services"
import { AssistantModelList } from "../lists/AssistantModelList"
import { useInitAssistant } from "@/services/assistant/useAssistant"

export function TopMenuAssistant() {
  const setShowSettings = useUI(s => s.setShowSettings)

  // this should only be called on and at only one place in the project!
  useInitAssistant()

  return (
    <MenubarMenu>
      <MenubarTrigger>Assistant</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem onClick={() => { setShowSettings(SettingsCategory.ASSISTANT) }}>Show advanced settings</MenubarItem>
          <MenubarSeparator />
          <AssistantModelList />
          <MenubarSeparator />
          <MenubarItem
             disabled
            >Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
