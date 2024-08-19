import { ClapWorkflowProvider } from '@aitube/clap'

const none = '/images/providers/none.png'

// ------------

const aitube = '/images/providers/none.png' // <- TODO
const anthropic = '/images/providers/anthropic.png'
const bigmodel = '/images/providers/bigmodel.jpeg'
const builtin = '/images/providers/none.png' // <-- TODO put Clapper logo here
const civitai = '/images/providers/civitai.png'
const cohere = '/images/providers/cohere.png'
const comfydeploy = '/images/providers/none.png' // <- feel free to open a PR
const comfyicu = '/images/providers/comfyicu.png'
const comfyui = '/images/providers/comfyui.png'
const elevenlabs = '/images/providers/elevenlabs.png'
const everartai = '/images/providers/everartai.png'
const falai = '/images/providers/falai.png'
const fireworks = '/images/providers/fireworks.png'
const google = '/images/providers/google.png'
const groq = '/images/providers/groq.png'
const hedra = '/images/providers/hedra.png'
const hotshot = '/images/providers/hotshot.png'
const huggingface = '/images/providers/huggingface.png'
const kitsai = '/images/providers/kitsai.png'
const kuaishou = '/images/providers/kuaishou.png'
const leonardoai = '/images/providers/leonardoai.png'
const letzai = '/images/providers/letzai.png'
const lumalabs = '/images/providers/lumalabs.png'
const midjourney = '/images/providers/midjourney.png'
const mistralai = '/images/providers/mistralai.png'
const modelslab = '/images/providers/modelslab.jpeg'
const openai = '/images/providers/openai.png'
const piapi = '/images/providers/piapi.jpg'
const replicate = '/images/providers/replicate.jpeg'
const runwayml = '/images/providers/runwayml.png'
const stabilityai = '/images/providers/stabilityai.png'
const suno = '/images/providers/suno.png'
const udio = '/images/providers/udio.png'

export const ClapWorkflowProvidersLogos: Record<ClapWorkflowProvider, string> =
  {
    [ClapWorkflowProvider.NONE]: none,
    // ----
    [ClapWorkflowProvider.AITUBE]: aitube,
    [ClapWorkflowProvider.ANTHROPIC]: anthropic,
    [ClapWorkflowProvider.BIGMODEL]: bigmodel,
    [ClapWorkflowProvider.BUILTIN]: builtin,
    [ClapWorkflowProvider.CIVITAI]: civitai,
    [ClapWorkflowProvider.COHERE]: cohere,
    [ClapWorkflowProvider.COMFYDEPLOY]: comfydeploy,
    [ClapWorkflowProvider.COMFYICU]: comfyicu,
    [ClapWorkflowProvider.COMFYUI]: comfyui,
    [ClapWorkflowProvider.CUSTOM]: none,
    [ClapWorkflowProvider.ELEVENLABS]: elevenlabs,
    [ClapWorkflowProvider.EVERARTAI]: everartai,
    [ClapWorkflowProvider.FALAI]: falai,
    [ClapWorkflowProvider.FIREWORKSAI]: fireworks,
    [ClapWorkflowProvider.GOOGLE]: google,
    [ClapWorkflowProvider.GROQ]: groq,
    [ClapWorkflowProvider.HEDRA]: hedra,
    [ClapWorkflowProvider.HOTSHOT]: hotshot,
    [ClapWorkflowProvider.HUGGINGFACE]: huggingface,
    [ClapWorkflowProvider.KITSAI]: kitsai,
    [ClapWorkflowProvider.KUAISHOU]: kuaishou,
    [ClapWorkflowProvider.LEONARDOAI]: leonardoai,
    [ClapWorkflowProvider.LETZAI]: letzai,
    [ClapWorkflowProvider.LUMALABS]: lumalabs,
    [ClapWorkflowProvider.MIDJOURNEY]: midjourney,
    [ClapWorkflowProvider.MISTRALAI]: mistralai,
    [ClapWorkflowProvider.MODELSLAB]: modelslab,
    [ClapWorkflowProvider.OPENAI]: openai,
    [ClapWorkflowProvider.PIAPI]: piapi,
    [ClapWorkflowProvider.REPLICATE]: replicate,
    [ClapWorkflowProvider.RUNWAYML]: runwayml,
    [ClapWorkflowProvider.STABILITYAI]: stabilityai,
    [ClapWorkflowProvider.SUNO]: suno,
    [ClapWorkflowProvider.UDIO]: udio,
  }
