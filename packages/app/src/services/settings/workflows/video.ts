/**
 * https://comfyanonymous.github.io/ComfyUI_examples/video/
 *
 * Modifications:
 * - Replaced 'Load Image' node by 'Load Image From Base64'
 */

import { ClapWorkflowCategory } from '@aitube/clap'

import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'

export const defaultWorkflowForVideos = convertComfyUiWorkflowApiToClapWorkflow(
  JSON.stringify({
    '3': {
      inputs: {
        seed: 524650296754258,
        steps: 20,
        cfg: 2.5,
        sampler_name: 'euler',
        scheduler: 'karras',
        denoise: 1,
        model: ['14', 0],
        positive: ['12', 0],
        negative: ['12', 1],
        latent_image: ['12', 2],
      },
      class_type: 'KSampler',
      _meta: {
        title: 'KSampler',
      },
    },
    '8': {
      inputs: {
        samples: ['3', 0],
        vae: ['15', 2],
      },
      class_type: 'VAEDecode',
      _meta: {
        title: 'VAE Decode',
      },
    },
    '12': {
      inputs: {
        width: 1024,
        height: 576,
        video_frames: 14,
        motion_bucket_id: 127,
        fps: 6,
        augmentation_level: 0,
        clip_vision: ['15', 1],
        init_image: ['24', 0],
        vae: ['15', 2],
      },
      class_type: 'SVD_img2vid_Conditioning',
      _meta: {
        title: 'SVD_img2vid_Conditioning',
      },
    },
    '14': {
      inputs: {
        min_cfg: 1,
        model: ['15', 0],
      },
      class_type: 'VideoLinearCFGGuidance',
      _meta: {
        title: 'VideoLinearCFGGuidance',
      },
    },
    '15': {
      inputs: {
        ckpt_name: 'svd/svd.safetensors',
      },
      class_type: 'ImageOnlyCheckpointLoader',
      _meta: {
        title: 'Image Only Checkpoint Loader (img2vid model)',
      },
    },
    '23': {
      inputs: {
        image: 'download.jpeg',
        upload: 'image',
      },
      class_type: 'LoadImage',
      _meta: {
        title: 'Load Image',
      },
    },
    '24': {
      inputs: {
        data: '@clapper/image',
      },
      class_type: 'LoadImageFromBase64',
      _meta: {
        title: 'Load Image From Base64',
      },
    },
    '25': {
      inputs: {
        frame_rate: 8,
        loop_count: 0,
        filename_prefix: 'AnimateDiff',
        format: 'video/h264-mp4',
        pix_fmt: 'yuv420p',
        crf: 0,
        save_metadata: false,
        pingpong: false,
        save_output: true,
        images: ['8', 0],
      },
      class_type: 'VHS_VideoCombine',
      _meta: {
        title: 'Video Combine 🎥🅥🅗🅢',
      },
    },
  }),
  ClapWorkflowCategory.VIDEO_GENERATION
)
