import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSettingsView } from "@/settings/view"

import { SettingsSectionRendering } from "./SettingsSectionRendering"

export function SettingsDialog() {

  const showSettings = useSettingsView(s => s.showSettings)
  const setShowSettings = useSettingsView(s => s.setShowSettings)
  const [_isPending, startTransition] = useTransition()

  const panels = {
    rendering: <SettingsSectionRendering />,
  }

  const panelLabels = {
    rendering: "Rendering",
  } as any

  const [configPanel, setConfigPanel] = useState<keyof typeof panels>("rendering")

  return (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className={cn(
        // DialogContent comes with some hardcoded values so we need to override them
        `w-[95w] md:w-[85vw] max-w-6xl h-[80%]`,
        `flex flex-row`
      )}>
         <ScrollArea className="flex flex-col h-full w-44">
          <div className="flex flex-col items-end">
            {Object.keys(panels).map(key => (
              <Button
                key={key}
                variant="ghost"
                className="flex flex-col capitalize w-full items-end text-right text-md"
                onClick={() => setConfigPanel(key as keyof typeof panels)}>{panelLabels[key]}</Button>
              ))}
            </div>
        </ScrollArea>

        <div className="flex flex-col h-full flex-grow justify-between max-w-[calc(100%-200px)]">
          <ScrollArea className="flex flex-row h-full">
            {panels[configPanel]}
          </ScrollArea>
          <DialogFooter className="text-gray-800">
            <Button onClick={() => { setShowSettings(false) }}>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}