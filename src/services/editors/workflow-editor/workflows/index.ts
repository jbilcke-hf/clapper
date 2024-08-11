import { ClapWorkflow } from '@aitube/clap'

import { anthropicWorkflows } from './anthropic'
import { comfydeployWorkflows } from './comfydeploy'
import { comfyicuWorkflows } from './comfyicu'
import { elevenlabsWorkflows } from './elevenlabs'
import { falaiWorkflows } from './falai'
import { fireworksaiWorkflows } from './fireworksai'
import { googleWorkflows } from './google'
import { huggingfaceWorkflows } from './huggingface'
import { openaiWorkflows } from './openai'
import { replicateWorkflows } from './replicate'
import { stabilityaiWorkflows } from './stabilityai'

// I haven't ported all the workflows yet, there are still some here
// (eg. utilities for segmentation etc)
// https://github.com/jbilcke-hf/clapper/blob/872298838ea3721f9945140fb00f0239b253b172/src/components/settings/constants.ts#L329

export const workflows: ClapWorkflow[] = [
  ...anthropicWorkflows,
  ...comfydeployWorkflows,
  ...comfyicuWorkflows,
  ...elevenlabsWorkflows,
  ...falaiWorkflows,
  ...fireworksaiWorkflows,
  ...googleWorkflows,
  ...huggingfaceWorkflows,
  ...openaiWorkflows,
  ...replicateWorkflows,
  ...stabilityaiWorkflows,
]
