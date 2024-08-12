import { ClapWorkflowProvider } from '@aitube/clap'

import { ComfyIcuAccelerator } from '@aitube/clapper-services'

export const ClapWorkflowProviderShortNames = {
  [ClapWorkflowProvider.BUILTIN]: 'Clapper',
  [ClapWorkflowProvider.ANTHROPIC]: 'Anthropic',
  [ClapWorkflowProvider.COHERE]: 'Cohere',
  [ClapWorkflowProvider.COMFYUI]: 'ComfyUI',
  [ClapWorkflowProvider.COMFYICU]: 'Comfy.icu',
  [ClapWorkflowProvider.COMFYDEPLOY]: 'ComfyDeploy.com',
  [ClapWorkflowProvider.CUSTOM]: 'Custom API',
  [ClapWorkflowProvider.ELEVENLABS]: 'ElevenLabs',
  [ClapWorkflowProvider.FALAI]: 'Fal.ai',
  [ClapWorkflowProvider.AITUBE]: 'AiTube.at',
  [ClapWorkflowProvider.FIREWORKSAI]: 'FireworksAI',
  [ClapWorkflowProvider.GOOGLE]: 'Google (VertexAI)',
  [ClapWorkflowProvider.GROQ]: 'Groq',
  [ClapWorkflowProvider.HUGGINGFACE]: 'Hugging Face',
  [ClapWorkflowProvider.KITSAI]: 'Kits.ai',
  [ClapWorkflowProvider.MISTRALAI]: 'MistralAI',
  [ClapWorkflowProvider.MODELSLAB]: 'ModelsLab',
  [ClapWorkflowProvider.NONE]: 'None', // <-- this is the default
  [ClapWorkflowProvider.OPENAI]: 'OpenAI',
  [ClapWorkflowProvider.REPLICATE]: 'Replicate',
  [ClapWorkflowProvider.STABILITYAI]: 'StabilityAI',
  [ClapWorkflowProvider.MIDJOURNEY]: 'Midjourney (no API)',
  [ClapWorkflowProvider.SUNO]: 'Suno (no music API)',
  [ClapWorkflowProvider.UDIO]: 'Udio (no music API)',
  [ClapWorkflowProvider.LUMALABS]: 'Luma: Dream Machine (no API)',
  [ClapWorkflowProvider.KUAISHOU]: 'KuaiShou: Kling (no API)',
  [ClapWorkflowProvider.RUNWAYML]: 'RunwayML: GEN-3 (no API)',
  [ClapWorkflowProvider.HEDRA]: 'Hedra: Character-1 (no API)',
  [ClapWorkflowProvider.LEONARDOAI]: 'Leonardo.ai (no API)',
  [ClapWorkflowProvider.EVERARTAI]: 'Everart.ai (no API)',
}

export const availableComfyIcuAccelerators = {
  [ComfyIcuAccelerator.L4]: 'L4',
  [ComfyIcuAccelerator.T4]: 'T4',
  [ComfyIcuAccelerator.A10]: 'A10',
  [ComfyIcuAccelerator.A100_40GB]: 'A100 (40 GB)',
  [ComfyIcuAccelerator.A100_80GB]: 'A100 (80 GB)',
  [ComfyIcuAccelerator.H100]: 'H100',
}
