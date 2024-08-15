import { FormSection } from '@/components/forms/FormSection'

export function SettingsSectionAssistant() {
  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="AI Assistant">
        <p>No settings for the AI assistant yet.</p>
        <p>(in the future we might add a system prompt here)</p>
      </FormSection>
    </div>
  )
}
