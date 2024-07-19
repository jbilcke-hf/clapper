import { ComputeProvider } from '@aitube/clapper-services'

const none = '/images/providers/none.png'
const anthropic = '/images/providers/anthropic.png'
const cohere = '/images/providers/cohere.png'
const elevenlabs = '/images/providers/elevenlabs.png'
const everartai = '/images/providers/everartai.png'
const falai = '/images/providers/falai.png'
const fireworks = '/images/providers/fireworks.png'
const google = '/images/providers/google.png'
const groq = '/images/providers/groq.png'
const hedra = '/images/providers/hedra.png'
const huggingface = '/images/providers/huggingface.png'
const kitsai = '/images/providers/kitsai.png'
const kuaishou = '/images/providers/kuaishou.png'
const leonardoai = '/images/providers/leonardoai.png'
const lumalabs = '/images/providers/lumalabs.png'
const midjourney = '/images/providers/midjourney.png'
const mistralai = '/images/providers/mistralai.png'
const modelslab = '/images/providers/modelslab.jpeg'
const openai = '/images/providers/openai.png'
const replicate = '/images/providers/replicate.jpeg'
const runwayml = '/images/providers/runwayml.png'
const stabilityai = '/images/providers/stabilityai.png'
const suno = '/images/providers/suno.png'
const udio = '/images/providers/udio.png'

export const computeProvidersLogos: Record<ComputeProvider, string> = {
  [ComputeProvider.NONE]: none,
  [ComputeProvider.ANTHROPIC]: anthropic,
  [ComputeProvider.COHERE]: cohere,
  [ComputeProvider.ELEVENLABS]: elevenlabs,
  [ComputeProvider.FALAI]: falai,
  [ComputeProvider.FIREWORKSAI]: fireworks,
  [ComputeProvider.GOOGLE]: google,
  [ComputeProvider.GROQ]: groq,
  [ComputeProvider.HEDRA]: hedra,
  [ComputeProvider.HUGGINGFACE]: huggingface,
  [ComputeProvider.KITSAI]: kitsai,
  [ComputeProvider.LUMALABS]: lumalabs,
  [ComputeProvider.MIDJOURNEY]: midjourney,
  [ComputeProvider.MISTRALAI]: mistralai,
  [ComputeProvider.MODELSLAB]: modelslab,
  [ComputeProvider.OPENAI]: openai,
  [ComputeProvider.REPLICATE]: replicate,
  [ComputeProvider.RUNWAYML]: runwayml,
  [ComputeProvider.STABILITYAI]: stabilityai,
  [ComputeProvider.SUNO]: suno,
  [ComputeProvider.UDIO]: udio,
  [ComputeProvider.CUSTOM]: none,
  [ComputeProvider.COMFY_HUGGINGFACE]: huggingface,
  [ComputeProvider.COMFY_REPLICATE]: replicate,
  [ComputeProvider.COMFY_COMFYICU]: none,
  [ComputeProvider.KUAISHOU]: kuaishou,
  [ComputeProvider.LEONARDOAI]: leonardoai,
  [ComputeProvider.EVERARTAI]: everartai,
}
