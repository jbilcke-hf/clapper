import { ClapWorkflow } from '@aitube/clap'

export type DynamicClapWorkflow = () => Promise<ClapWorkflow[]>
