export type ColorGradingParameter =
  | {
      name: string
      description: string
      type: 'number'
      minValue: number
      maxValue: number
      defaultValue: number
    }
  | {
      name: string
      description: string
      type: 'string'
      allowedValues: string[]
      defaultValue: string
    }

export type ColorGradingFilter = {
  name: string
  parameters: Array<ColorGradingParameter>
  shader: string // WGSL shader code for the filter
}
