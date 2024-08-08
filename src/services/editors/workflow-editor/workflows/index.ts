import { ClapWorkflow } from '@aitube/clap'

import { falaiWorkflows } from './falai'
import { stabilityaiWorkflows } from './stabilityai'
import { replicateWorkflows } from './replicate'
import { fireworksaiWorkflows } from './fireworksai'
import { huggingfaceWorkflows } from './huggingface'
import { comfyicuWorkflows } from './comfyicu'

export const workflows: ClapWorkflow[] = [
  ...falaiWorkflows,
  ...stabilityaiWorkflows,
  ...replicateWorkflows,
  ...fireworksaiWorkflows,
  ...huggingfaceWorkflows,
  ...comfyicuWorkflows,
]
