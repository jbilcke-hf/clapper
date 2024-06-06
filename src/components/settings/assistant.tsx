import { FormSection } from "@/components/forms/FormSection"
import { useSettings } from "@/controllers/settings"
import { ComputeProvider } from "@/types"

import { FormSelect } from "../forms/FormSelect"
import { availableComputeProvidersForAssistant } from "./constants"

export function SettingsSectionAssistant() {
  const assistantProvider = useSettings(s => s.assistantProvider)
  const setAssistantProvider = useSettings(s => s.setAssistantProvider)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="AI Assistant">

        <FormSelect<ComputeProvider>
          label="Assistant provider"
          selectedItemId={assistantProvider}
          selectedItemLabel={
            (availableComputeProvidersForAssistant as any)[assistantProvider]
            || ComputeProvider.NONE
          }
          items={Object.entries(availableComputeProvidersForAssistant).map(([provider, label]) => ({
            id: provider,
            label,
            disabled: false,
            value: provider as ComputeProvider,
          }))}
          onSelect={setAssistantProvider}
          horizontal
        />
      </FormSection>
    </div>
  )
}