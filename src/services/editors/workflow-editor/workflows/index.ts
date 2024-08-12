import { ClapWorkflow } from '@aitube/clap'

import { anthropicWorkflows } from './anthropic'
import { aitubeWorkflows } from './aitube'
import { cohereWorkflows } from './cohere'
import { comfydeployWorkflows } from './comfydeploy'
import { comfyicuWorkflows } from './comfyicu'
import { comfyuiWorkflows } from './comfyui'
import { elevenlabsWorkflows } from './elevenlabs'
import { falaiWorkflows } from './falai'
import { fireworksaiWorkflows } from './fireworksai'
import { googleWorkflows } from './google'
import { groqWorkflows } from './groq'
import { huggingfaceWorkflows } from './huggingface'
import { mistralaiWorkflows } from './mistralai'
import { openaiWorkflows } from './openai'
import { replicateWorkflows } from './replicate'
import { stabilityaiWorkflows } from './stabilityai'

// I haven't ported all the workflows yet, there are still some here
// (eg. utilities for segmentation etc)
// https://github.com/jbilcke-hf/clapper/blob/872298838ea3721f9945140fb00f0239b253b172/src/components/settings/constants.ts#L329

export const workflows: ClapWorkflow[] = [
  ...anthropicWorkflows,
  ...aitubeWorkflows,
  ...cohereWorkflows,
  ...comfydeployWorkflows,
  ...comfyicuWorkflows,
  ...comfyuiWorkflows,
  ...elevenlabsWorkflows,
  ...falaiWorkflows,
  ...fireworksaiWorkflows,
  ...googleWorkflows,
  ...groqWorkflows,
  ...huggingfaceWorkflows,
  ...mistralaiWorkflows,
  ...openaiWorkflows,
  ...replicateWorkflows,
  ...stabilityaiWorkflows,
]
