import { StaticImageData } from "next/image"

import { ComputeProvider } from "@aitube/clapper-services"

import none from "./none.png"
import anthropic from "./anthropic.png"
import cohere from "./cohere.png"
import elevenlabs from "./elevenlabs.png"
import everartai from "./everartai.png"
import falai from "./falai.png"
import fireworks from "./fireworks.png"
import google from "./google.png"
import groq from "./groq.png"
import hedra from "./hedra.png"
import huggingface from "./huggingface.png"
import kitsai from "./kitsai.png"
import kuaishou from "./kuaishou.png"
import leonardoai from "./leonardoai.png"
import lumalabs from "./lumalabs.png"
import midjourney from "./midjourney.png"
import mistralai from "./mistralai.png"
import modelslab from "./modelslab.jpeg"
import openai from "./openai.png"
import replicate from "./replicate.jpeg"
import runwayml from "./runwayml.png"
import stabilityai from "./stabilityai.png"
import suno from "./suno.png"
import udio from "./udio.png"

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