import { ClapInputField } from '@aitube/clap'
import { ClapInputCategory } from '@aitube/clap'

// IMPORTANT: do NOT modify those default fields,
// otherwise you might break the workflow of someone else!
//
// instead you should extend/overwrite them in your own workflow

export const genericInput: ClapInputField = {
  id: 'input',
  label: 'Input',
  description: 'Input',
  category: ClapInputCategory.PROMPT,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericText: ClapInputField = {
  id: 'text',
  label: 'Text',
  description: 'Text',
  category: ClapInputCategory.PROMPT,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericPrompt: ClapInputField = {
  id: 'prompt',
  label: 'Prompt',
  description: 'Prompt',
  category: ClapInputCategory.PROMPT,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericRatio: ClapInputField = {
  id: 'ratio',
  label: 'Image ratio',
  description: 'Image ratio (default to 1:1)',
  category: ClapInputCategory.UNKNOWN,
  type: 'string',
  allowedValues: ['1:1', '16:9', '9:16'],
  defaultValue: '1:1',
}

export const genericSeed: ClapInputField = {
  id: 'seed',
  label: 'Seed',
  description: 'Seed',
  category: ClapInputCategory.SEED,
  type: 'number', // <-- TODO: replace by 'integer' (might break stuff)
  minValue: 0,
  maxValue: Math.pow(2, 31),
  defaultValue: 0,
}

export const genericLora: ClapInputField = {
  id: 'lora',
  label: 'Lora URL',
  description: 'Lora URL',
  category: ClapInputCategory.LORA,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericLoraUrl: ClapInputField = {
  id: 'lora_url',
  label: 'Lora URL',
  description: 'Lora URL',
  category: ClapInputCategory.LORA,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericImage: ClapInputField = {
  id: 'image',
  label: 'Image',
  description: 'Image',
  category: ClapInputCategory.IMAGE_URL,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericImageUrl: ClapInputField = {
  id: 'image_url',
  label: 'Image URL',
  description: 'Image URL',
  category: ClapInputCategory.IMAGE_URL,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericVideo: ClapInputField = {
  id: 'video',
  label: 'Video',
  description: 'Video',
  category: ClapInputCategory.VIDEO_URL,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericVideoUrl: ClapInputField = {
  id: 'video_url',
  label: 'Video URL',
  description: 'Video URL',
  category: ClapInputCategory.VIDEO_URL,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericVoice: ClapInputField = {
  id: 'voice',
  label: 'Voice',
  description: 'Voice',
  category: ClapInputCategory.SOUND_URL,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericAudio: ClapInputField = {
  id: 'audio',
  label: 'Audio',
  description: 'Audio',
  category: ClapInputCategory.SOUND_URL,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericLoras: ClapInputField = {
  id: 'loras',
  label: 'LoRAs',
  description: 'Comma-separated LoRAs',
  category: ClapInputCategory.LORA,
  type: 'string',
  allowedValues: [],
  defaultValue: '',
}

export const genericInferenceSteps: ClapInputField = {
  id: 'num_inference_steps',
  label: 'Inference steps',
  description: 'Number of inference steps',
  category: ClapInputCategory.ITERATION_STEPS,
  type: 'number',
  minValue: 1,
  maxValue: 50,
  defaultValue: 28,
}

export const genericUpscalingFactor: ClapInputField = {
  id: 'upscaling_factor',
  label: 'Upscaling Factor',
  description: 'Upscaling Factor (2, 3, 4..)',
  category: ClapInputCategory.UPSCALING_FACTOR,
  type: 'number', // <-- TODO: replace by 'integer' (might break stuff)
  minValue: 2,
  maxValue: 4,
  defaultValue: 2,
}

export const genericOverlappingTiles: ClapInputField = {
  id: 'overlapping_tiles',
  label: 'Overlapping Tiles',
  description:
    'Overlapping tiles should reduce visible seams, but doubles the inference time.',
  category: ClapInputCategory.UNKNOWN,
  type: 'boolean',
  defaultValue: true,
}

export const genericMotionBucketId: ClapInputField = {
  id: 'motion_bucket_id',
  label: 'Motion Bucket ID',
  description:
    'The motion bucket ID determines the motion of the generated video. The higher the number, the more motion there will be.',
  category: ClapInputCategory.UNKNOWN,
  type: 'number', // <-- TODO: replace by 'integer' (might break stuff)
  minValue: 0,
  maxValue: 255,
  defaultValue: 127,
}

export const genericConditioningAugmentation: ClapInputField = {
  id: 'conditioning_augmentation',
  label: 'Conditioning Augmentation',
  description:
    'The conditoning augmentation determines the amount of noise that will be added to the conditioning frame. The higher the number, the more noise there will be, and the less the video will look like the initial image. Increase it for more motion.',
  category: ClapInputCategory.UNKNOWN,
  type: 'number',
  minValue: 0,
  maxValue: 1,
  defaultValue: 0.02,
}

export const genericWidth1024: ClapInputField = {
  id: 'width',
  label: 'Width',
  description: 'Width',
  category: ClapInputCategory.WIDTH,
  type: 'number',
  minValue: 256,
  maxValue: 1024,
  defaultValue: 1024,
}

export const genericWidth2048: ClapInputField = {
  id: 'width',
  label: 'Width',
  description: 'Width',
  category: ClapInputCategory.WIDTH,
  type: 'number',
  minValue: 256,
  maxValue: 2048,
  defaultValue: 1024,
}

export const genericHeight1024: ClapInputField = {
  id: 'height',
  label: 'Height',
  description: 'Height',
  category: ClapInputCategory.HEIGHT,
  type: 'number',
  minValue: 256,
  maxValue: 1024,
  defaultValue: 576,
}

export const genericHeight2048: ClapInputField = {
  id: 'height',
  label: 'Height',
  description: 'Height',
  category: ClapInputCategory.HEIGHT,
  type: 'number',
  minValue: 256,
  maxValue: 2048,
  defaultValue: 576,
}
