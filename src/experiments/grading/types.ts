import { ClapInputField } from '@aitube/clap/dist/types'

export type ColorGradingFilter = {
  name: string
  parameters: Array<ClapInputField>
  shader: string // WGSL shader code for the filter
}
