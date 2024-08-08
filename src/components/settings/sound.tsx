import { FormSection } from '@/components/forms/FormSection'

export function SettingsSectionSound() {
  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Sound rendering">
        <p>No settings for the sound yet.</p>
        <p>
          (In the future we might add a system prompt or prompt template here)
        </p>
      </FormSection>
    </div>
  )
}
