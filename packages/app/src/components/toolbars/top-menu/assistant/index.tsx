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
import { useUI } from '@/services/ui'
import { SettingsCategory } from '@aitube/clapper-services'
import { AssistantWorkflows } from '../lists/AssistantWorkflows'
import { useAutocomplete } from '@/services/autocomplete/useAutocomplete'

export function TopMenuAssistant() {
  const setShowSettings = useUI((s) => s.setShowSettings)
  const convertImagesToStory = useAutocomplete((s) => s.convertImagesToStory)

  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

  return (
    <MenubarMenu>
      <MenubarTrigger>Assistant</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarItem
            onClick={() => {
              setShowSettings(SettingsCategory.ASSISTANT)
            }}
          >
            Show advanced settings
          </MenubarItem>
          <MenubarSeparator />
          <AssistantWorkflows />
          {hasBetaAccess && (
            <>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  convertImagesToStory()
                }}
              >
                Storyboards-to-captions (beta, client-side AI)
              </MenubarItem>
            </>
          )}
          <MenubarSeparator />
          <MenubarItem disabled>Usage and costs: not implemented</MenubarItem>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}
