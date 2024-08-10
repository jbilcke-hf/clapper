import { ClapWorkflow } from '@aitube/clap'

import { comfydeployWorkflows } from './comfydeploy'
import { falaiWorkflows } from './falai'
import { elevenlabsWorkflows } from './elevenlabs'
import { stabilityaiWorkflows } from './stabilityai'
import { replicateWorkflows } from './replicate'
import { fireworksaiWorkflows } from './fireworksai'
import { huggingfaceWorkflows } from './huggingface'
import { comfyicuWorkflows } from './comfyicu'

// I haven't ported all the workflows yet, there are still some here
// (eg. utilities for segmentation etc)
// https://github.com/jbilcke-hf/clapper/blob/872298838ea3721f9945140fb00f0239b253b172/src/components/settings/constants.ts#L329

export const workflows: ClapWorkflow[] = [
  ...comfydeployWorkflows,
  ...comfyicuWorkflows,
  ...elevenlabsWorkflows,
  ...falaiWorkflows,
  ...fireworksaiWorkflows,
  ...huggingfaceWorkflows,
  ...replicateWorkflows,
  ...stabilityaiWorkflows,
]
