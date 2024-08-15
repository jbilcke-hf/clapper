import { FormSection } from '@/components/forms/FormSection'

export function SettingsSectionVoice() {
  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Voice rendering">
        <p>No settings for the voice yet.</p>
        <p>
          (In the future we might add a system prompt or prompt template here)
        </p>
      </FormSection>
    </div>
  )
}
