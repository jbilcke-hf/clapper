import { FormSection } from "@/components/forms/FormSection"
import { useSettings } from "@/services/settings"

import { FormSwitch } from "../forms/FormSwitch"

export function SettingsSectionEditors() {
  const scriptEditorShowLineNumbers = useSettings(s => s.scriptEditorShowLineNumbers)
  const setScriptEditorShowLineNumbers = useSettings(s => s.setScriptEditorShowLineNumbers)

  const scriptEditorShowMinimap = useSettings(s => s.scriptEditorShowMinimap)
  const setScriptEditorShowMinimap = useSettings(s => s.setScriptEditorShowMinimap)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Editors">

        <h3 className="text-2xl font-thin pb-2 text-stone-400">Screenplay editor</h3>
      
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