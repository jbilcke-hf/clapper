import { ClapWorkflow } from '@aitube/clap'

import { DynamicClapWorkflow } from './common/types'

import { aitubeWorkflows } from './aitube'
import { anthropicWorkflows } from './anthropic'
import { bigModelWorkflows } from './bigmodel'
import { civitaiWorkflows } from './civitai'
import { cohereWorkflows } from './cohere'
import { comfydeployWorkflows } from './comfydeploy'
import { comfyicuWorkflows } from './comfyicu'
import { comfyuiWorkflows, getDynamicComfyuiWorkflows } from './comfyui'
import { elevenlabsWorkflows } from './elevenlabs'
import { falaiWorkflows } from './falai'
import { fireworksaiWorkflows } from './fireworksai'
import { googleWorkflows } from './google'
import { groqWorkflows } from './groq'
import { hotshotWorkflows } from './hotshot'
import { huggingfaceWorkflows } from './huggingface'
import { letzAiWorkflows } from './letzai'
import { lumalabsWorkflows } from './lumalabs'
import { mistralaiWorkflows } from './mistralai'
import { openaiWorkflows } from './openai'
import { piApiWorkflows } from './piapi'
import { replicateWorkflows } from './replicate'
import { stabilityaiWorkflows } from './stabilityai'
import { noneWorkflows } from './none'

// I haven't ported all the workflows yet, there are still some here
// (eg. utilities for segmentation etc)
// https://github.com/jbilcke-hf/clapper/blob/872298838ea3721f9945140fb00f0239b253b172/src/components/settings/constants.ts#L329

export const staticWorkflows: ClapWorkflow[] = [
  ...noneWorkflows,
  ...aitubeWorkflows,
  ...anthropicWorkflows,
  ...bigModelWorkflows,
  ...civitaiWorkflows,
  ...cohereWorkflows,
  ...comfydeployWorkflows,
  ...comfyicuWorkflows,
  ...comfyuiWorkflows,
  ...elevenlabsWorkflows,
  ...falaiWorkflows,
  ...fireworksaiWorkflows,
  ...googleWorkflows,
  ...groqWorkflows,
  ...hotshotWorkflows,
  ...huggingfaceWorkflows,
  ...letzAiWorkflows,
  ...lumalabsWorkflows,
  ...mistralaiWorkflows,
  ...openaiWorkflows,
  ...piApiWorkflows,
  ...replicateWorkflows,
  ...stabilityaiWorkflows,
]

export const dynamicWorkflows: DynamicClapWorkflow[] = [
  getDynamicComfyuiWorkflows,
]
