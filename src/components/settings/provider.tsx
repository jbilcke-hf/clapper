import { FormSection } from "@/components/forms/FormSection"
import { getDefaultSettingsState, useSettings } from "@/controllers/settings"
import { FormSelect } from "../forms/FormSelect"
import { ComfyIcuAccelerator } from "@/types"
import { FormInput } from "../forms/FormInput"
import { APP_NAME } from "@/lib/core/constants"
import { availableComfyIcuAccelerators } from "./constants"

export function SettingsSectionProvider() {
  const defaultSettings = getDefaultSettingsState()

  const replicateApiKey = useSettings(s => s.replicateApiKey)
  const setReplicateApiKey = useSettings(s => s.setReplicateApiKey)

  const comfyIcuApiKey = useSettings(s => s.comfyIcuApiKey)
  const setComfyIcuApiKey = useSettings(s => s.setComfyIcuApiKey)

  const comfyIcuAccelerator = useSettings(s => s.comfyIcuAccelerator)
  const setComfyIcuAccelerator = useSettings(s => s.setComfyIcuAccelerator)

  const huggingFaceApiKey = useSettings(s => s.huggingFaceApiKey)
  const setHuggingFaceApiKey = useSettings(s => s.setHuggingFaceApiKey)

  const falAiApiKey = useSettings(s => s.falAiApiKey)
  const setFalAiApiKey = useSettings(s => s.setFalAiApiKey)

  const modelsLabApiKey = useSettings(s => s.modelsLabApiKey)
  const setModelsLabApiKey = useSettings(s => s.setModelsLabApiKey)

  const openaiApiKey = useSettings(s => s.openaiApiKey)
  const setOpenaiApiKey = useSettings(s => s.setOpenaiApiKey)

  const groqApiKey = useSettings(s => s.groqApiKey)
  const setGroqApiKey = useSettings(s => s.setGroqApiKey)

  const googleApiKey = useSettings(s => s.googleApiKey)
  const setGoogleApiKey = useSettings(s => s.setGoogleApiKey)

  const anthropicApiKey = useSettings(s => s.anthropicApiKey)
  const setAnthropicApiKey = useSettings(s => s.setAnthropicApiKey)

  const cohereApiKey = useSettings(s => s.cohereApiKey)
  const setCohereApiKey = useSettings(s => s.setCohereApiKey)

  const mistralAiApiKey = useSettings(s => s.mistralAiApiKey)
  const setMistralAiApiKey = useSettings(s => s.setMistralAiApiKey)

  const stabilityAiApiKey = useSettings(s => s.stabilityAiApiKey)
  const setStabilityAiApiKey = useSettings(s => s.setStabilityAiApiKey)

  const elevenLabsApiKey = useSettings(s => s.elevenLabsApiKey)
  const setElevenLabsApiKey = useSettings(s => s.setElevenLabsApiKey)

  const kitsAiApiKey = useSettings(s => s.kitsAiApiKey)
  const setKitsAiApiKey = useSettings(s => s.setKitsAiApiKey)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Compute providers">

      <p className="italic text-sm text-stone-500 max-w-80">
          Note: preferences and credentials are stored inside your browser local storage.<br/>{APP_NAME} uses them to perform API calls on your behalf, but forgets them immediately.
        </p>
        
        <FormInput
          label="Hugging Face API key"
          value={huggingFaceApiKey}
          defaultValue={""}
          onChange={setHuggingFaceApiKey}
          type="password"
        />

        <FormInput
          label="Replicate API key"
          value={replicateApiKey}
          defaultValue={defaultSettings.replicateApiKey}
          onChange={setReplicateApiKey}
          type="password"
        />
        <FormInput
          label="Comfy.icu API key"
          value={comfyIcuApiKey}
          defaultValue={defaultSettings.comfyIcuApiKey}
          onChange={setComfyIcuApiKey}
          type="password"
        />

        <FormSelect<ComfyIcuAccelerator>
          label="Comfy.icu hardware accelerator"
          selectedItemId={comfyIcuAccelerator}
          selectedItemLabel={
            (availableComfyIcuAccelerators as any)[comfyIcuAccelerator]
            || ComfyIcuAccelerator.L4
          }
          items={Object.entries(availableComfyIcuAccelerators).map(([accelerator, label]) => ({
            id: accelerator,
            label,
            disabled: false,
            value: accelerator as ComfyIcuAccelerator,
          }))}
          onSelect={setComfyIcuAccelerator}
          horizontal
        />

        <FormInput
          label="Fal.ai API Key"
          value={falAiApiKey}
          defaultValue={defaultSettings.falAiApiKey}
          onChange={setFalAiApiKey}
          type="password"
        />

        <FormInput
          label="ModelsLab API Key"
          value={modelsLabApiKey}
          defaultValue={defaultSettings.modelsLabApiKey}
          onChange={setModelsLabApiKey}
          type="password"
        />

        <FormInput
          label="OpenAI API Key"
          value={openaiApiKey}
          defaultValue={defaultSettings.openaiApiKey}
          onChange={setOpenaiApiKey}
          type="password"
        />

        <FormInput
          label="Groq API Key"
          value={groqApiKey}
          defaultValue={defaultSettings.groqApiKey}
          onChange={setGroqApiKey}
          type="password"
        />

        <FormInput
          label="Google API Key"
          value={googleApiKey}
          defaultValue={defaultSettings.googleApiKey}
          onChange={setGoogleApiKey}
          type="password"
        />

        <FormInput
          label="Anthropic API Key"
          value={anthropicApiKey}
          defaultValue={defaultSettings.anthropicApiKey}
          onChange={setAnthropicApiKey}
          type="password"
        />

        <FormInput
          label="Cohere API Key"
          value={cohereApiKey}
          defaultValue={defaultSettings.cohereApiKey}
          onChange={setCohereApiKey}
          type="password"
        />

        <FormInput
          label="MistralAI API Key"
          value={mistralAiApiKey}
          defaultValue={defaultSettings.mistralAiApiKey}
          onChange={setMistralAiApiKey}
          type="password"
        />

        <FormInput
          label="StabilityAI API Key"
          value={stabilityAiApiKey}
          defaultValue={defaultSettings.stabilityAiApiKey}
          onChange={setStabilityAiApiKey}
          type="password"
        />

        <FormInput
          label="ElevenLabs API Key"
          value={elevenLabsApiKey}
          defaultValue={defaultSettings.elevenLabsApiKey}
          onChange={setElevenLabsApiKey}
          type="password"
        />
        
        <FormInput
          label="KitsAI API Key"
          value={kitsAiApiKey}
          defaultValue={defaultSettings.kitsAiApiKey}
          onChange={setKitsAiApiKey}
          type="password"
        />
      </FormSection>
    </div>
  )
}