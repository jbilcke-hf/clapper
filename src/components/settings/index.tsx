import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useUI } from "@/services"

import { SettingsSectionProvider } from "./provider"
import { SettingsSectionAssistant } from "./assistant"
import { SettingsSectionEditors } from "./editors"
import { SettingsSectionImage } from "./image"
import { SettingsSectionVideo } from "./video"
import { SettingsSectionSound } from "./sound"
import { SettingsSectionMusic } from "./music"
import { SettingsSectionVoice } from "./voice"
import { SettingsCategory } from "@aitube/clapper-services"

const panels: Record<SettingsCategory, JSX.Element> = {
  [SettingsCategory.NONE]: <></>,
  [SettingsCategory.PROVIDER]: <SettingsSectionProvider />,
  [SettingsCategory.ASSISTANT]: <SettingsSectionAssistant />,
  [SettingsCategory.EDITORS]: <SettingsSectionEditors />,
  [SettingsCategory.IMAGE]: <SettingsSectionImage />,
  [SettingsCategory.VIDEO]: <SettingsSectionVideo />,
  [SettingsCategory.VOICE]: <SettingsSectionVoice />,
  [SettingsCategory.SOUND]: <SettingsSectionSound />,
  [SettingsCategory.MUSIC]: <SettingsSectionMusic />,
}

const panelLabels = {
  [SettingsCategory.NONE]: "",
  [SettingsCategory.PROVIDER]: "Providers",
  [SettingsCategory.ASSISTANT]: "Assistant",
  [SettingsCategory.EDITORS]: "Editors",
  [SettingsCategory.IMAGE]: "Image",
  [SettingsCategory.VIDEO]: "Video",
  [SettingsCategory.VOICE]: "Voice",
  [SettingsCategory.SOUND]: "Sound",
  [SettingsCategory.MUSIC]: "Music",
} as any

export function SettingsDialog() {

  const showSettings = useUI(s => s.showSettings)
  const setShowSettings = useUI(s => s.setShowSettings)

  return (
    <Dialog open={showSettings !== SettingsCategory.NONE} onOpenChange={(open) => setShowSettings(open ? SettingsCategory.PROVIDER : SettingsCategory.NONE)}>
      <DialogContent className={cn(
        `select-none`,
        // DialogContent comes with some hardcoded values so we need to override them
        `w-[95w] md:w-[60vw] max-w-6xl h-[70%]`,
        `flex flex-row`
      )}>
         <ScrollArea className="flex flex-col h-full w-44">
          <div className="flex flex-col items-end">
            {Object.keys(panels).map(key => (
              <Button
                key={key}
                variant="ghost"
                className="flex flex-col capitalize w-full items-end text-right text-lg font-thin text-stone-300"
                onClick={() => setShowSettings(key as SettingsCategory)}>{panelLabels[key]}</Button>
              ))}
            </div>
        </ScrollArea>

        <div className="
        select-none
        flex flex-col h-full flex-grow justify-between max-w-[calc(100%-150px)]
        border-l border-stone-800
        pl-8
        ">
          <ScrollArea className="flex flex-row h-full">
            {panels[showSettings]}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" className=" dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700 text-sm font-light" onClick={() => { setShowSettings(SettingsCategory.NONE) }}>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}