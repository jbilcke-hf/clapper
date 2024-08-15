import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useUI } from '@/services'

import { SettingsSectionProvider } from './provider'
import { SettingsSectionAssistant } from './assistant'
import { SettingsSectionEditors } from './editors'
import { SettingsSectionImage } from './image'
import { SettingsSectionVideo } from './video'
import { SettingsSectionSound } from './sound'
import { SettingsSectionMusic } from './music'
import { SettingsSectionVoice } from './voice'
import { SettingsCategory } from '@aitube/clapper-services'

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
  [SettingsCategory.NONE]: '',
  [SettingsCategory.PROVIDER]: 'Providers',
  [SettingsCategory.ASSISTANT]: 'Assistant',
  [SettingsCategory.EDITORS]: 'Editors',
  [SettingsCategory.IMAGE]: 'Image',
  [SettingsCategory.VIDEO]: 'Video',
  [SettingsCategory.VOICE]: 'Voice',
  [SettingsCategory.SOUND]: 'Sound',
  [SettingsCategory.MUSIC]: 'Music',
} as any

export function SettingsDialog() {
  const showSettings = useUI((s) => s.showSettings)
  const setShowSettings = useUI((s) => s.setShowSettings)

  return (
    <Dialog
      open={showSettings !== SettingsCategory.NONE}
      onOpenChange={(open) =>
        setShowSettings(
          open ? SettingsCategory.PROVIDER : SettingsCategory.NONE
        )
      }
    >
      <DialogContent
        className={cn(
          `select-none`,
          // DialogContent comes with some hardcoded values so we need to override them
          `h-[70%] w-[95w] max-w-6xl md:w-[60vw]`,
          `flex flex-row`
        )}
      >
        <ScrollArea className="flex h-full w-44 flex-col">
          <div className="flex flex-col items-end">
            {Object.keys(panels).map((key) => (
              <Button
                key={key}
                variant="ghost"
                className="flex w-full flex-col items-end text-right text-lg font-thin capitalize text-neutral-300"
                onClick={() => setShowSettings(key as SettingsCategory)}
              >
                {panelLabels[key]}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex h-full max-w-[calc(100%-150px)] flex-grow select-none flex-col justify-between border-l border-neutral-800 pl-8">
          <ScrollArea className="flex h-full flex-row">
            {panels[showSettings]}
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-sm font-light dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
              onClick={() => {
                setShowSettings(SettingsCategory.NONE)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
