import { ReactNode } from 'react'

import { FormSection } from '@/components/forms/FormSection'
import { getDefaultSettingsState, useSettings } from '@/services/settings'
import { ComfyIcuAccelerator } from '@aitube/clapper-services'
import { APP_NAME } from '@/lib/core/constants'

import { availableComfyIcuAccelerators } from './constants'

import { FormSelect } from '../forms/FormSelect'
import { FormInput } from '../forms/FormInput'
import { useUI } from '@/services/ui'
import { FormSwitch } from '../forms/FormSwitch'

function GetItHere({ href, children }: { href: string; children: ReactNode }) {
  return (
    <span>
      {children} (
      <a
        className="text-stone-500 underline hover:text-stone-400"
        href={href}
        target="_blank"
      >
        get one
      </a>
      )
    </span>
  )
}
export function SettingsSectionProvider() {
  const defaultSettings = getDefaultSettingsState()

  const showApiKeys = useUI((s) => s.showApiKeys)
  const setShowApiKeys = useUI((s) => s.setShowApiKeys)

  const replicateApiKey = useSettings((s) => s.replicateApiKey)
  const setReplicateApiKey = useSettings((s) => s.setReplicateApiKey)

  const comfyUiApiUrl = useSettings((s) => s.comfyUiApiUrl)
  const setComfyUiApiUrl = useSettings((s) => s.setComfyUiApiUrl)

  const comfyUiClientId = useSettings((s) => s.comfyUiClientId)
  const setComfyUiClientId = useSettings((s) => s.setComfyUiClientId)

  const comfyIcuApiKey = useSettings((s) => s.comfyIcuApiKey)
  const setComfyIcuApiKey = useSettings((s) => s.setComfyIcuApiKey)

  const comfyIcuAccelerator = useSettings((s) => s.comfyIcuAccelerator)
  const setComfyIcuAccelerator = useSettings((s) => s.setComfyIcuAccelerator)

  const huggingFaceApiKey = useSettings((s) => s.huggingFaceApiKey)
  const setHuggingFaceApiKey = useSettings((s) => s.setHuggingFaceApiKey)

  const falAiApiKey = useSettings((s) => s.falAiApiKey)
  const setFalAiApiKey = useSettings((s) => s.setFalAiApiKey)

  const modelsLabApiKey = useSettings((s) => s.modelsLabApiKey)
  const setModelsLabApiKey = useSettings((s) => s.setModelsLabApiKey)

  const openaiApiKey = useSettings((s) => s.openaiApiKey)
  const setOpenaiApiKey = useSettings((s) => s.setOpenaiApiKey)

  const groqApiKey = useSettings((s) => s.groqApiKey)
  const setGroqApiKey = useSettings((s) => s.setGroqApiKey)

  const googleApiKey = useSettings((s) => s.googleApiKey)
  const setGoogleApiKey = useSettings((s) => s.setGoogleApiKey)

  const anthropicApiKey = useSettings((s) => s.anthropicApiKey)
  const setAnthropicApiKey = useSettings((s) => s.setAnthropicApiKey)

  const cohereApiKey = useSettings((s) => s.cohereApiKey)
  const setCohereApiKey = useSettings((s) => s.setCohereApiKey)

  const mistralAiApiKey = useSettings((s) => s.mistralAiApiKey)
  const setMistralAiApiKey = useSettings((s) => s.setMistralAiApiKey)

  const stabilityAiApiKey = useSettings((s) => s.stabilityAiApiKey)
  const setStabilityAiApiKey = useSettings((s) => s.setStabilityAiApiKey)

  const elevenLabsApiKey = useSettings((s) => s.elevenLabsApiKey)
  const setElevenLabsApiKey = useSettings((s) => s.setElevenLabsApiKey)

  const kitsAiApiKey = useSettings((s) => s.kitsAiApiKey)
  const setKitsAiApiKey = useSettings((s) => s.setKitsAiApiKey)

  const apiKeyType = showApiKeys ? 'text' : 'password'

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Compute providers">
        <p className="max-w-80 text-sm italic text-stone-500">
          Note: preferences and credentials are stored inside your browser local
          storage.
          <br />
          {APP_NAME} uses them to perform API calls on your behalf, but forgets
          them immediately.
        </p>

        <FormSwitch
          label="Hide API Keys"
          checked={!showApiKeys}
          onCheckedChange={setShowApiKeys}
        />

        <FormInput
          label="Hugging Face API key"
          value={huggingFaceApiKey}
          defaultValue={''}
          onChange={setHuggingFaceApiKey}
          type={apiKeyType}
        />

        <FormInput
          label="Replicate API key"
          value={replicateApiKey}
          defaultValue={defaultSettings.replicateApiKey}
          onChange={setReplicateApiKey}
          type={apiKeyType}
        />
        
        <FormInput
          label="ComfyUI API URL"
          value={comfyUiApiUrl}
          defaultValue={defaultSettings.comfyUiApiUrl}
          onChange={setComfyIcuApiKey}
          type="text"
        />

        <FormInput
          label="ComfyUI Client ID"
          value={comfyUiClientId}
          defaultValue={defaultSettings.comfyUiClientId}
          onChange={setComfyUiClientId}
          type={apiKeyType}
        />

        <FormInput
          label="Comfy.icu API key"
          value={comfyIcuApiKey}
          defaultValue={defaultSettings.comfyIcuApiKey}
          onChange={setComfyIcuApiKey}
          type={apiKeyType}
        />

        <FormSelect<ComfyIcuAccelerator>
          label="Comfy.icu hardware accelerator"
          selectedItemId={comfyIcuAccelerator}
          selectedItemLabel={
            (availableComfyIcuAccelerators as any)[comfyIcuAccelerator] ||
            ComfyIcuAccelerator.L4
          }
          items={Object.entries(availableComfyIcuAccelerators).map(
            ([accelerator, label]) => ({
              id: accelerator,
              label,
              disabled: false,
              value: accelerator as ComfyIcuAccelerator,
            })
          )}
          onSelect={setComfyIcuAccelerator}
        />

        <FormInput
          label={
            <GetItHere href="https://fal.ai/dashboard/keys">
              Fal.ai API Key
            </GetItHere>
          }
          value={falAiApiKey}
          defaultValue={defaultSettings.falAiApiKey}
          onChange={setFalAiApiKey}
          type={apiKeyType}
        />

        <FormInput
          label="ModelsLab API Key"
          value={modelsLabApiKey}
          defaultValue={defaultSettings.modelsLabApiKey}
          onChange={setModelsLabApiKey}
          type={apiKeyType}
        />

        <FormInput
          label={
            <GetItHere href="https://platform.openai.com/api-keys">
              OpenAI API Key
            </GetItHere>
          }
          value={openaiApiKey}
          defaultValue={defaultSettings.openaiApiKey}
          onChange={setOpenaiApiKey}
          type={apiKeyType}
        />

        <FormInput
          label="Groq API Key"
          value={groqApiKey}
          defaultValue={defaultSettings.groqApiKey}
          onChange={setGroqApiKey}
          type={apiKeyType}
        />

        <FormInput
          label={
            <GetItHere href="https://aistudio.google.com/app/apikey">
              Google API Key
            </GetItHere>
          }
          value={googleApiKey}
          defaultValue={defaultSettings.googleApiKey}
          onChange={setGoogleApiKey}
          type={apiKeyType}
        />

        <FormInput
          label={
            <GetItHere href="https://console.anthropic.com/settings/keys">
              Anthropic API Key
            </GetItHere>
          }
          value={anthropicApiKey}
          defaultValue={defaultSettings.anthropicApiKey}
          onChange={setAnthropicApiKey}
          type={apiKeyType}
        />

        <FormInput
          label={
            <GetItHere href="https://dashboard.cohere.com/api-keys">
              Cohere API Key
            </GetItHere>
          }
          value={cohereApiKey}
          defaultValue={defaultSettings.cohereApiKey}
          onChange={setCohereApiKey}
          type={apiKeyType}
        />

        <FormInput
          label="MistralAI API Key"
          value={mistralAiApiKey}
          defaultValue={defaultSettings.mistralAiApiKey}
          onChange={setMistralAiApiKey}
          type={apiKeyType}
        />

        <FormInput
          label={
            <GetItHere href="https://platform.stability.ai/account/keys">
              StabilityAI API Key
            </GetItHere>
          }
          value={stabilityAiApiKey}
          defaultValue={defaultSettings.stabilityAiApiKey}
          onChange={setStabilityAiApiKey}
          type={apiKeyType}
        />

        <FormInput
          label="ElevenLabs API Key"
          value={elevenLabsApiKey}
          defaultValue={defaultSettings.elevenLabsApiKey}
          onChange={setElevenLabsApiKey}
          type={apiKeyType}
        />

        <FormInput
          label="KitsAI API Key"
          value={kitsAiApiKey}
          defaultValue={defaultSettings.kitsAiApiKey}
          onChange={setKitsAiApiKey}
          type={apiKeyType}
        />
      </FormSection>
    </div>
  )
}
