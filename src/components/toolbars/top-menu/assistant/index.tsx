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
import { AssistantModelList } from '../lists/AssistantModelList'
import { useAutocomplete } from '@/services/autocomplete/useAutocomplete'

export function TopMenuAssistant() {
  const setShowSettings = useUI((s) => s.setShowSettings)
  const storyboardsToStory = useAutocomplete((s) => s.storyboardsToStory)

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
          <AssistantModelList />
          {hasBetaAccess && (
            <>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  storyboardsToStory()
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
