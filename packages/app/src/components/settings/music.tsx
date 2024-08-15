import { FormSection } from '@/components/forms/FormSection'
import { getDefaultSettingsState } from '@/services/settings'

export function SettingsSectionMusic() {
  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Music rendering">
        <p>No settings for the music yet.</p>
        <p>
          (In the future we might add a system prompt or prompt template here)
        </p>
      </FormSection>
    </div>
  )
}
