import { ComfyuiWorkflow } from '../formats/comfyui/types'

// live portrait
export const comfyicu: ComfyuiWorkflow[] = [
  {
    extra: {
      ds: {
        scale: 0.8264462809917354,
        offset: {
          '0': 173.4048767089844,
          '1': -0.9636010527610779,
        },
      },
    },
    links: [
      [30, 8, 0, 19, 0, 'IMAGE'],
      [32, 19, 0, 18, 0, 'IMAGE'],
      [58, 1, 0, 30, 0, 'LIVEPORTRAITPIPE'],
      [59, 4, 0, 30, 1, 'IMAGE'],
      [60, 8, 0, 30, 2, 'IMAGE'],
      [64, 18, 0, 23, 0, 'IMAGE'],
      [67, 30, 1, 18, 1, 'IMAGE'],
      [68, 30, 1, 19, 1, 'IMAGE'],
    ],
    nodes: [
      {
        id: 4,
        pos: [138, 323],
        mode: 0,
        size: {
          '0': 272.85791015625,
          '1': 331.6089477539062,
        },
        type: 'LoadImage',
        flags: {},
        order: 0,
        outputs: [
          {
            name: 'IMAGE',
            type: 'IMAGE',
            links: [59],
            shape: 3,
            slot_index: 0,
          },
          {
            name: 'MASK',
            type: 'MASK',
            links: null,
            shape: 3,
          },
        ],
        properties: {
          'Node name for S&R': 'LoadImage',
        },
        widgets_values: ['monolisa.jpg', 'image'],
      },
      {
        id: 19,
        pos: [507, 675],
        mode: 0,
        size: {
          '0': 315,
          '1': 242,
        },
        type: 'ImageResizeKJ',
        flags: {},
        order: 4,
        inputs: [
          {
            link: 30,
            name: 'image',
            type: 'IMAGE',
          },
          {
            link: 68,
            name: 'get_image_size',
            type: 'IMAGE',
          },
          {
            link: null,
            name: 'width_input',
            type: 'INT',
            widget: {
              name: 'width_input',
            },
          },
          {
            link: null,
            name: 'height_input',
            type: 'INT',
            widget: {
              name: 'height_input',
            },
          },
        ],
        outputs: [
          {
            name: 'IMAGE',
            type: 'IMAGE',
            links: [32],
            shape: 3,
            slot_index: 0,
          },
          {
            name: 'width',
            type: 'INT',
            links: null,
            shape: 3,
          },
          {
            name: 'height',
            type: 'INT',
            links: null,
            shape: 3,
          },
        ],
        properties: {
          'Node name for S&R': 'ImageResizeKJ',
        },
        widgets_values: [512, 512, 'nearest-exact', false, 2, 0, 0],
      },
      {
        id: 18,
        pos: [860, 679],
        mode: 0,
        size: {
          '0': 210,
          '1': 150,
        },
        type: 'ImageConcatMulti',
        flags: {},
        order: 5,
        inputs: [
          {
            link: 32,
            name: 'image_1',
            type: 'IMAGE',
          },
          {
            link: 67,
            name: 'image_2',
            type: 'IMAGE',
          },
        ],
        outputs: [
          {
            name: 'images',
            type: 'IMAGE',
            links: [64],
            shape: 3,
            slot_index: 0,
          },
        ],
        properties: {
          'Node name for S&R': 'ImageConcatMulti',
        },
        widgets_values: [2, 'right', false, null],
      },
      {
        id: 1,
        pos: [142, 205],
        mode: 0,
        size: {
          '0': 252,
          '1': 58,
        },
        type: 'DownloadAndLoadLivePortraitModels',
        flags: {},
        order: 1,
        outputs: [
          {
            name: 'live_portrait_pipe',
            type: 'LIVEPORTRAITPIPE',
            links: [58],
            shape: 3,
            slot_index: 0,
          },
        ],
        properties: {
          'Node name for S&R': 'DownloadAndLoadLivePortraitModels',
        },
        widgets_values: ['auto'],
      },
      {
        id: 30,
        pos: [500, 249],
        mode: 0,
        size: {
          '0': 367.7999877929688,
          '1': 362,
        },
        type: 'LivePortraitProcess',
        flags: {},
        order: 3,
        inputs: [
          {
            link: 58,
            name: 'pipeline',
            type: 'LIVEPORTRAITPIPE',
          },
          {
            link: 59,
            name: 'source_image',
            type: 'IMAGE',
          },
          {
            link: 60,
            name: 'driving_images',
            type: 'IMAGE',
          },
        ],
        outputs: [
          {
            name: 'cropped_images',
            type: 'IMAGE',
            links: [],
            shape: 3,
            slot_index: 0,
          },
          {
            name: 'full_images',
            type: 'IMAGE',
            links: [67, 68],
            shape: 3,
            slot_index: 1,
          },
        ],
        properties: {
          'Node name for S&R': 'LivePortraitProcess',
        },
        widgets_values: [
          512,
          2.3,
          0,
          -0.11,
          true,
          false,
          1,
          false,
          1,
          true,
          true,
          'CPU',
        ],
      },
      {
        id: 8,
        pos: [161, 714],
        mode: 0,
        size: [235.1999969482422, 491.1999969482422],
        type: 'VHS_LoadVideo',
        flags: {},
        order: 2,
        inputs: [
          {
            link: null,
            name: 'meta_batch',
            type: 'VHS_BatchManager',
          },
          {
            link: null,
            name: 'vae',
            type: 'VAE',
          },
        ],
        outputs: [
          {
            name: 'IMAGE',
            type: 'IMAGE',
            links: [30, 60],
            shape: 3,
            slot_index: 0,
          },
          {
            name: 'frame_count',
            type: 'INT',
            links: null,
            shape: 3,
          },
          {
            name: 'audio',
            type: 'VHS_AUDIO',
            links: null,
            shape: 3,
          },
          {
            name: 'video_info',
            type: 'VHS_VIDEOINFO',
            links: null,
            shape: 3,
          },
        ],
        properties: {
          'Node name for S&R': 'VHS_LoadVideo',
        },
        widgets_values: {
          video: 'd1.mp4',
          force_rate: 0,
          force_size: 'Disabled',
          custom_width: 512,
          videopreview: {
            hidden: false,
            params: {
              type: 'input',
              format: 'video/mp4',
              filename: 'd1.mp4',
              force_rate: 0,
              frame_load_cap: 0,
              select_every_nth: 1,
              skip_first_frames: 0,
            },
            paused: false,
          },
          custom_height: 512,
          frame_load_cap: 0,
          select_every_nth: 1,
          skip_first_frames: 0,
          'choose video to upload': 'image',
        },
      },
      {
        id: 23,
        pos: [1098, 240],
        mode: 0,
        size: [1253.234130859375, 940.6170654296875],
        type: 'VHS_VideoCombine',
        flags: {},
        order: 6,
        inputs: [
          {
            link: 64,
            name: 'images',
            type: 'IMAGE',
          },
          {
            link: null,
            name: 'audio',
            type: 'VHS_AUDIO',
          },
          {
            link: null,
            name: 'meta_batch',
            type: 'VHS_BatchManager',
          },
          {
            link: null,
            name: 'vae',
            type: 'VAE',
          },
        ],
        outputs: [
          {
            name: 'Filenames',
            type: 'VHS_FILENAMES',
            links: null,
            shape: 3,
          },
        ],
        properties: {
          'Node name for S&R': 'VHS_VideoCombine',
        },
        widgets_values: {
          crf: 19,
          format: 'video/h264-mp4',
          pix_fmt: 'yuv420p',
          pingpong: false,
          frame_rate: 24,
          loop_count: 0,
          save_output: true,
          videopreview: {
            hidden: false,
            params: {
              src: 'http://comfy.icu/api/v1/view/workflows/mV51t3g_DcTcIHhwBU7p1/temp/LivePortrait_00001.mp4',
              type: 'temp',
              format: 'video/h264-mp4',
              filename:
                '/workflows/mV51t3g_DcTcIHhwBU7p1/temp/LivePortrait_00001.mp4',
              subfolder: '',
              frame_rate: 24,
            },
            paused: false,
          },
          save_metadata: true,
          filename_prefix: 'LivePortrait',
        },
      },
    ],
    config: {},
    groups: [],
    version: 0.4,
    last_link_id: 68,
    last_node_id: 31,
  },
]
