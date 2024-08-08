import { ClapInputField } from '@aitube/clap'

// IMPORTANT: do NOT modify those default fields,
// otherwise you might break the workflow of someone else!
//
// instead you should extend/overwrite them in your own workflow

export const genericTextPrompt: ClapInputField = {
  id: 'prompt',
  label: 'Prompt',
  description: 'Prompt',
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericWidth1024: ClapInputField = {
  id: 'width',
  label: 'Width',
  description: 'Width',
  type: 'number',
  minValue: 256,
  maxValue: 1024,
  defaultValue: 1024,
}

export const genericWidth2048: ClapInputField = {
  id: 'width',
  label: 'Width',
  description: 'Width',
  type: 'number',
  minValue: 256,
  maxValue: 2048,
  defaultValue: 1024,
}

export const genericHeight1024: ClapInputField = {
  id: 'height',
  label: 'Height',
  description: 'Height',
  type: 'number',
  minValue: 256,
  maxValue: 1024,
  defaultValue: 576,
}

export const genericHeight2048: ClapInputField = {
  id: 'height',
  label: 'Height',
  description: 'Height',
  type: 'number',
  minValue: 256,
  maxValue: 2048,
  defaultValue: 576,
}
