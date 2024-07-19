import { StaticImageData } from 'next/image'

import { ComputeProvider } from '@aitube/clapper-services'

import none from '../../../../public/images/providers/none.png'
import anthropic from '../../../../public/images/providers/anthropic.png'
import cohere from '../../../../public/images/providers/cohere.png'
import elevenlabs from '../../../../public/images/providers/elevenlabs.png'
import everartai from '../../../../public/images/providers/everartai.png'
import falai from '../../../../public/images/providers/falai.png'
import fireworks from '../../../../public/images/providers/fireworks.png'
import google from '../../../../public/images/providers/google.png'
import groq from '../../../../public/images/providers/groq.png'
import hedra from '../../../../public/images/providers/hedra.png'
import huggingface from '../../../../public/images/providers/huggingface.png'
import kitsai from '../../../../public/images/providers/kitsai.png'
import kuaishou from '../../../../public/images/providers/kuaishou.png'
import leonardoai from '../../../../public/images/providers/leonardoai.png'
import lumalabs from '../../../../public/images/providers/lumalabs.png'
import midjourney from '../../../../public/images/providers/midjourney.png'
import mistralai from '../../../../public/images/providers/mistralai.png'
import modelslab from '../../../../public/images/providers/modelslab.jpeg'
import openai from '../../../../public/images/providers/openai.png'
import replicate from '../../../../public/images/providers/replicate.jpeg'
import runwayml from '../../../../public/images/providers/runwayml.png'
import stabilityai from '../../../../public/images/providers/stabilityai.png'
import suno from '../../../../public/images/providers/suno.png'
import udio from '../../../../public/images/providers/udio.png'

export const computeProvidersLogos: Record<ComputeProvider, StaticImageData> = {
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
