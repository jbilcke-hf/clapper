import { ClapWorkflow } from '@aitube/clap'

export type DynamicClapWorkflow = () => Promise<ClapWorkflow[]>

export enum LoraBaseModel {
  FLUX = 'FLUX',
  SDXL = 'SDXL',
}

export type Lora = {
  id: string

  label: string

  baseModel: LoraBaseModel.FLUX

  description: string

  thumbnailUrl: string

  // URL to the page presenting the LoRA (eg. HF model page)
  projectUrl: string

  author: string

  // trigger (usually some kind of unique string sequence, eg TOK)
  trigger: string

  // additional keywords suggested by the author
  extensions: string

  // name of the model repository on Hugging Face
  // or direct URL to the weights
  repoOrUrl: string
}
