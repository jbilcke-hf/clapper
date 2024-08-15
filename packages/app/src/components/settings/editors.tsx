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
        <h2 className="text-base font-normal text-white/50">
          Screenplay editor
        </h2>

        <FormSwitch
          label="Show line numbers"
          checked={!scriptEditorShowLineNumbers}
          onCheckedChange={setScriptEditorShowLineNumbers}
        />

        <FormSwitch
          label="Show minimap"
          checked={!scriptEditorShowMinimap}
          onCheckedChange={setScriptEditorShowMinimap}
        />
      </FormSection>
    </div>
  )
}
