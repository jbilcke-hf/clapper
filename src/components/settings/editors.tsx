import { FormSection } from '@/components/forms/FormSection'
import { useSettings } from '@/services/settings'

import { FormSwitch } from '../forms/FormSwitch'

export function SettingsSectionEditors() {
  const scriptEditorShowLineNumbers = useSettings(
    (s) => s.scriptEditorShowLineNumbers
  )
  const setScriptEditorShowLineNumbers = useSettings(
    (s) => s.setScriptEditorShowLineNumbers
  )

  const scriptEditorShowMinimap = useSettings((s) => s.scriptEditorShowMinimap)
  const setScriptEditorShowMinimap = useSettings(
    (s) => s.setScriptEditorShowMinimap
  )

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Editors">
        <h3 className="pb-2 text-2xl font-thin text-stone-400">
          Screenplay editor
        </h3>

        <FormSwitch
          label="Show line numbers"
          checked={!scriptEditorShowLineNumbers}
          onCheckedChange={setScriptEditorShowLineNumbers}
          horizontal
        />

        <FormSwitch
          label="Show minimap"
          checked={!scriptEditorShowMinimap}
          onCheckedChange={setScriptEditorShowMinimap}
          horizontal
        />
      </FormSection>
    </div>
  )
}
