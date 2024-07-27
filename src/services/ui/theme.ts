/**
 * TODO:
 *
 * - more colors for Monaco editor
 *
 * - change shadcn/ui colors
 *
 * - timeline CSS filter is a quick hack to get a hue,
 *   instead (or in addition to it) we could pass color parameters
 *
 * - handle light and dark themes
 *
 */

import { ClapSegmentCategory } from '@aitube/clap'
import {
  UITheme,
  UIThemeColorMode,
  UIThemeName,
  WorkflowEditorTheme,
} from '@aitube/clapper-services'
import { ClapSegmentCategoryColors } from '@aitube/timeline'

export const baseClapSegmentCategoryColors: ClapSegmentCategoryColors = {
  [ClapSegmentCategory.SPLAT]: { hue: 347, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.MESH]: { hue: 32, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.DEPTH]: { hue: 242, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.EVENT]: { hue: 270, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.EFFECT]: { hue: 270, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.INTERFACE]: {
    hue: 216,
    saturation: 30,
    lightness: 78.6,
  },
  [ClapSegmentCategory.PHENOMENON]: {
    hue: 270,
    saturation: 30,
    lightness: 78.6,
  },
  [ClapSegmentCategory.VIDEO]: { hue: 70, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.STORYBOARD]: {
    hue: 70,
    saturation: 30,
    lightness: 78.6,
  },
  [ClapSegmentCategory.TRANSITION]: {
    hue: 55,
    saturation: 30,
    lightness: 78.6,
  },
  [ClapSegmentCategory.CHARACTER]: {
    hue: 285.8,
    saturation: 30,
    lightness: 78.6,
  },
  [ClapSegmentCategory.LOCATION]: {
    hue: 80.9,
    saturation: 30,
    lightness: 78.6,
  },
  [ClapSegmentCategory.TIME]: { hue: 250, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.ERA]: { hue: 250, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.LIGHTING]: { hue: 50, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.WEATHER]: {
    hue: 197.2,
    saturation: 30,
    lightness: 78.6,
  },
  [ClapSegmentCategory.ACTION]: { hue: 3, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.MUSIC]: { hue: 100, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.SOUND]: { hue: 60, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.DIALOGUE]: { hue: 23, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.STYLE]: { hue: 285, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.CAMERA]: { hue: 10, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.GENERIC]: { hue: 200, saturation: 30, lightness: 78.6 },
}

// a grey and yellow theme, inspired by the entertainment world
export const backstage: UITheme = {
  id: 'backstage',
  label: 'Backstage',
  author: 'Clapper',
  colorMode: UIThemeColorMode.DARK,
  description: '',
  defaultBgColor: '#1c1917',
  defaultTextColor: '#d6d3d1',
  defaultPrimaryColor: '#FACC15',
  defaultBorderColor: '#3e3a39',
  logoColor: '#FACC15',
  editorBgColor: '#292524',
  editorCursorColor: '#f5f5f4',
  editorTextColor: '#d6d3d1',
  editorMenuBgColor: '#1c1917',
  editorMenuTextColor: '494544',
  editorBorderColor: '#3c3837',
  monitorBgColor: '#201d1c',
  monitorSecondaryTextColor: '#D6D3D1',
  monitorPrimaryTextColor: '#FACC15',

  assistantBgColor: '#242120',
  assistantUserBgColor: '#075985',
  assistantUserTextColor: '#bae6fd',
  assistantRobotBgColor: '#3730a3',
  assistantRobotTextColor: '#e0e7ff',

  formInputRadius: '8px',

  timeline: {
    topBarTimeScale: {
      backgroundColor: '#7d7c78',
      textColor: '#ffffff',
      lineColor: '#E6E6E6',
    },
    leftBarTrackScale: {
      backgroundColor: '#7d7c78',
      textColor: '#ffffff',
      lineColor: '#B3B3B3',
    },
    grid: {
      backgroundColor: '#292524',
    },
    cell: {
      categoryColors: baseClapSegmentCategoryColors,

      waveform: {
        // "original" style
        lineSpacing: 2,
        gradientStart: 1.0,
        gradientEnd: 0.6,

        // "drapes" style
        // lineSpacing: 0,
        // gradientStart: 0.7,
        // gradientEnd: 0.1,

        // that is an "aggressive" style
        // lineSpacing: 1,
        // gradientStart: 0.6,
        // gradientEnd: 1.0,
      },
    },
    playbackCursor: {
      lineColor: '#FACC15',
    },
  },

  workflow: {
    bgColor: '#242120',
    node: {
      bgColor: '#393534',
      borderColor: '#494544',
      textPrimaryColor: '#d6d3d1',
      textSecondaryColor: '#b6b3b1',
      radius: '8px',
    },
    handle: {
      inputColor: '#FACC15',
      outputColor: '#FACC15',
    },
  },
}

export const midnight: UITheme = {
  id: 'midnight',
  label: 'Midnight',
  author: 'Clapper',
  colorMode: UIThemeColorMode.DARK,
  description: '',
  defaultBgColor: '#101e2d',
  defaultTextColor: '#b8bdc3',
  defaultPrimaryColor: '#5A9DF7',
  defaultBorderColor: '#152639',
  logoColor: '#5A9DF7',
  editorBgColor: '#011222',
  editorCursorColor: '#5A9DF7',
  editorTextColor: '#b8bdc3',
  editorMenuBgColor: '#000e1d',
  editorMenuTextColor: 'b8bdc3',
  editorBorderColor: '#232e3b',
  monitorBgColor: '#011222',
  monitorSecondaryTextColor: '#b8bdc3',
  monitorPrimaryTextColor: '#5A9DF7',
  assistantBgColor: '#001121',
  assistantUserBgColor: '#075985',
  assistantUserTextColor: '#bae6fd',
  assistantRobotBgColor: '#3730a3',
  assistantRobotTextColor: '#e0e7ff',

  formInputRadius: '8px',

  timeline: {
    topBarTimeScale: {
      backgroundColor: '#32506b',
      textColor: '#ffffff',
      lineColor: '#E6E6E6',
    },
    leftBarTrackScale: {
      backgroundColor: '#32506b',
      textColor: '#ffffff',
      lineColor: '#B3B3B3',
    },
    grid: {
      backgroundColor: '#000e1d',
    },
    cell: {
      categoryColors: baseClapSegmentCategoryColors,
      waveform: {
        lineSpacing: 1,
        gradientStart: 0.6,
        gradientEnd: 1.0,
      },
    },
    playbackCursor: {
      lineColor: '#5A9DF7',
    },
  },
  workflow: {
    bgColor: '#011222',
    node: {
      bgColor: '#152639',
      borderColor: '#253649',
      textPrimaryColor: '#d3d1d6',
      textSecondaryColor: '#b3b1b6',
      radius: '8px',
    },
    handle: {
      inputColor: '#5A9DF7',
      outputColor: '#5A9DF7',
    },
  },
}

export const lavender: UITheme = {
  id: 'lavender',
  label: 'Lavender',
  author: 'Clapper',
  colorMode: UIThemeColorMode.DARK,
  description: '',
  defaultBgColor: '#32294b',
  defaultTextColor: '#dbd0fd',
  defaultPrimaryColor: '#A78BFA',
  defaultBorderColor: '#152639',
  logoColor: '#A78BFA',
  editorBgColor: '#211b30',
  editorCursorColor: '#A78BFA',
  editorTextColor: '#dbd0fd',
  editorMenuBgColor: '#1a1526',
  editorMenuTextColor: 'dbd0fd',
  editorBorderColor: '#312b42',
  monitorBgColor: '#211b30',
  monitorSecondaryTextColor: '#D6D3D1',
  monitorPrimaryTextColor: '#A78BFA',
  assistantBgColor: '#211b30',
  assistantUserBgColor: '#075985',
  assistantUserTextColor: '#bae6fd',
  assistantRobotBgColor: '#3730a3',
  assistantRobotTextColor: '#e0e7ff',

  formInputRadius: '8px',

  timeline: {
    topBarTimeScale: {
      backgroundColor: '#6E5A7F',
      textColor: '#ffffff',
      lineColor: '#E6E6E6',
    },
    leftBarTrackScale: {
      backgroundColor: '#6E5A7F',
      textColor: '#ffffff',
      lineColor: '#B3B3B3',
    },
    grid: {
      backgroundColor: '#211b32',
    },
    cell: {
      categoryColors: baseClapSegmentCategoryColors,
      waveform: {
        // "original" style
        // lineSpacing: 2,
        // gradientStart: 1.0,
        // gradientEnd: 0.6,

        // "drapes" style
        lineSpacing: 0,
        gradientStart: 0.7,
        gradientEnd: 0.1,

        // that is an "aggressive" style
        // lineSpacing: 1,
        // gradientStart: 0.6,
        // gradientEnd: 1.0,
      },
    },
    playbackCursor: {
      lineColor: '#A78BFA',
    },
  },
  workflow: {
    bgColor: '#211b30',
    node: {
      bgColor: '#22192b',
      borderColor: '#62597b',
      textPrimaryColor: '#d6ccdf',
      textSecondaryColor: '#6E5A7F',
      radius: '8px',
    },
    handle: {
      inputColor: '#A78BFA',
      outputColor: '#A78BFA',
    },
  },
}

export const flix: UITheme = {
  id: 'flix',
  label: 'Flix',
  author: 'Clapper',
  colorMode: UIThemeColorMode.DARK,
  description: 'A new DVD rent-by-mail business',
  defaultBgColor: '#000000',
  defaultTextColor: '#D22F27',
  defaultPrimaryColor: '#D22F27',
  defaultBorderColor: '#152639',
  logoColor: '#D22F27',
  editorBgColor: '#000000',
  editorCursorColor: '#D22F27',
  editorTextColor: '#ffeeee',
  editorMenuBgColor: '#000000',
  editorMenuTextColor: 'ffeeee',
  editorBorderColor: '#232323',
  monitorBgColor: '#000000',
  monitorSecondaryTextColor: '#D6D3D1',
  monitorPrimaryTextColor: '#D22F27',
  assistantBgColor: '#000000',
  assistantUserBgColor: '#075985',
  assistantUserTextColor: '#bae6fd',
  assistantRobotBgColor: '#3730a3',
  assistantRobotTextColor: '#e0e7ff',

  formInputRadius: '8px',

  timeline: {
    topBarTimeScale: {
      backgroundColor: 'rgb(80,80,80)',
      textColor: '#ffffff',
      lineColor: '#E6E6E6',
    },
    leftBarTrackScale: {
      backgroundColor: 'rgb(80,80,80)',
      textColor: '#ffffff',
      lineColor: '#B3B3B3',
    },
    grid: {
      backgroundColor: '#000000',
    },
    cell: {
      categoryColors: baseClapSegmentCategoryColors,

      waveform: {
        // "original" style
        //lineSpacing: 2,
        //gradientStart: 1.0,
        //gradientEnd: 0.6,

        // "drapes" style
        // lineSpacing: 0,
        // gradientStart: 0.7,
        // gradientEnd: 0.1,

        // that is an "aggressive" style
        lineSpacing: 1,
        gradientStart: 0.6,
        gradientEnd: 1.0,
      },
    },
    playbackCursor: {
      lineColor: '#D22F27',
    },
  },
  workflow: {
    bgColor: '#000000',
    node: {
      bgColor: '#0f0f0f',
      borderColor: '#3e3939',
      textPrimaryColor: '#d6d3d1',
      textSecondaryColor: '#b6b3b1',
      radius: '8px',
    },
    handle: {
      inputColor: '#B23F37',
      outputColor: '#B23F37',
    },
  },
}

export const lore: UITheme = {
  id: 'lore',
  label: 'Lore',
  author: 'Clapper',
  colorMode: UIThemeColorMode.DARK,
  description: '',
  defaultBgColor: '#151520',
  defaultTextColor: '#f6d6d8',
  defaultPrimaryColor: '#DE4A80',
  defaultBorderColor: '#152639',
  logoColor: '#DE4A80',
  editorBgColor: '#151520',
  editorCursorColor: '#DE4A80',
  editorTextColor: '#f6d6d8',
  editorMenuBgColor: '#151520',
  editorMenuTextColor: 'f6d6d8',
  editorBorderColor: '#282834',
  monitorBgColor: '#151520',
  monitorSecondaryTextColor: '#D6D3D1',
  monitorPrimaryTextColor: '#DE4A80',
  assistantBgColor: '#151520',
  assistantUserBgColor: '#075985',
  assistantUserTextColor: '#bae6fd',
  assistantRobotBgColor: '#3730a3',
  assistantRobotTextColor: '#e0e7ff',

  formInputRadius: '8px',

  timeline: {
    topBarTimeScale: {
      backgroundColor: 'rgb(98,94,111)',
      textColor: '#ffffff',
      lineColor: '#E6E6E6',
    },
    leftBarTrackScale: {
      backgroundColor: 'rgb(98,94,111)',
      textColor: '#ffffff',
      lineColor: '#B3B3B3',
    },
    grid: {
      backgroundColor: '#151520',
    },
    cell: {
      categoryColors: baseClapSegmentCategoryColors,

      waveform: {
        // "original" style
        // lineSpacing: 2,
        // gradientStart: 1.0,
        // gradientEnd: 0.6,

        // "drapes" style
        // lineSpacing: 0,
        // gradientStart: 0.7,
        // gradientEnd: 0.1,

        // that is an "aggressive" style
        lineSpacing: 1,
        gradientStart: 0.6,
        gradientEnd: 1.0,
      },
    },
    playbackCursor: {
      lineColor: '#DE4A80',
    },
  },
  workflow: {
    bgColor: '#151520',
    node: {
      bgColor: '#151520',
      borderColor: '#555560',
      textPrimaryColor: '#d6d3d1',
      textSecondaryColor: '#b6b3b1',
      radius: '8px',
    },
    handle: {
      inputColor: '#DE4A80',
      outputColor: '#DE4A80',
    },
  },
}
export const gordon: UITheme = {
  id: 'gordon',
  label: 'Gordon',
  author: 'Clapper',
  colorMode: UIThemeColorMode.DARK,
  description: '',
  defaultBgColor: '#525252',
  defaultTextColor: '#e0e0e0',
  defaultPrimaryColor: '#ff8400',
  defaultBorderColor: '#2e2e2e',
  logoColor: '#ff8400',
  editorBgColor: '#434343',
  editorCursorColor: '#ffffff',
  editorTextColor: '#e0e0e0',
  editorMenuBgColor: '#323232',
  editorMenuTextColor: 'e0e0e0',
  editorBorderColor: '#2e2e2e',
  monitorBgColor: '#333333',
  monitorSecondaryTextColor: '#e0e0e0',
  monitorPrimaryTextColor: '#ff8400',

  assistantBgColor: '#535353',
  assistantUserBgColor: '#ff8400',
  assistantUserTextColor: '#ffffff',
  assistantRobotBgColor: '#6b6b6b',
  assistantRobotTextColor: '#ffffff',

  formInputRadius: '8px',

  timeline: {
    topBarTimeScale: {
      backgroundColor: '#7b7b7b',
      textColor: '#ffffff',
      lineColor: '#808080',
    },
    leftBarTrackScale: {
      backgroundColor: '#7b7b7b',
      textColor: '#ffffff',
      lineColor: '#808080',
    },
    grid: {
      backgroundColor: '#434343',
    },
    cell: {
      categoryColors: baseClapSegmentCategoryColors,

      waveform: {
        // "original" style
        lineSpacing: 2,
        gradientStart: 1.0,
        gradientEnd: 0.6,

        // "drapes" style
        // lineSpacing: 0,
        // gradientStart: 0.7,
        // gradientEnd: 0.1,

        // that is an "aggressive" style
        // lineSpacing: 1,
        // gradientStart: 0.6,
        // gradientEnd: 1.0,
      },
    },
    playbackCursor: {
      lineColor: '#ff8400',
    },
  },
  workflow: {
    bgColor: '#444444',
    node: {
      bgColor: '#333333',
      borderColor: '#636363',
      textPrimaryColor: '#d6d3d1',
      textSecondaryColor: '#b6b3b1',
      radius: '8px',
    },
    handle: {
      inputColor: '#ff8400',
      outputColor: '#ff8400',
    },
  },
}

export const silent: UITheme = {
  id: 'silent',
  label: 'Silent',
  author: 'Clapper',
  colorMode: UIThemeColorMode.DARK,
  description: 'Monochrome theme inspired by classic films',
  defaultBgColor: '#1a1a1a',
  defaultTextColor: '#d0d0d0',
  defaultPrimaryColor: '#ffffff',
  defaultBorderColor: '#2a2a2a',
  logoColor: '#ffffff',
  editorBgColor: '#1a1a1a',
  editorCursorColor: '#ffffff',
  editorTextColor: '#d0d0d0',
  editorMenuBgColor: '#1a1a1a',
  editorMenuTextColor: 'd0d0d0',
  editorBorderColor: '#2a2a2a',
  monitorBgColor: '#0f0f0f',
  monitorSecondaryTextColor: '#b0b0b0',
  monitorPrimaryTextColor: '#ffffff',
  assistantBgColor: '#1a1a1a',
  assistantUserBgColor: '#3a3a3a',
  assistantUserTextColor: '#ffffff',
  assistantRobotBgColor: '#2a2a2a',
  assistantRobotTextColor: '#e0e0e0',

  formInputRadius: '32px',

  timeline: {
    topBarTimeScale: {
      backgroundColor: '#3a3a3a',
      textColor: '#ffffff',
      lineColor: '#707070',
    },
    leftBarTrackScale: {
      backgroundColor: '#3a3a3a',
      textColor: '#ffffff',
      lineColor: '#707070',
    },
    grid: {
      backgroundColor: '#1f1f1f',
    },
    cell: {
      categoryColors: {
        [ClapSegmentCategory.SPLAT]: { hue: 347, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.MESH]: { hue: 32, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.DEPTH]: { hue: 242, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.EVENT]: { hue: 270, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.EFFECT]: {
          hue: 270,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.INTERFACE]: {
          hue: 216,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.PHENOMENON]: {
          hue: 270,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.VIDEO]: { hue: 70, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.STORYBOARD]: {
          hue: 70,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.TRANSITION]: {
          hue: 55,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.CHARACTER]: {
          hue: 285.8,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.LOCATION]: {
          hue: 80.9,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.TIME]: { hue: 250, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.ERA]: { hue: 250, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.LIGHTING]: {
          hue: 50,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.WEATHER]: {
          hue: 197.2,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.ACTION]: { hue: 3, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.MUSIC]: { hue: 100, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.SOUND]: { hue: 60, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.DIALOGUE]: {
          hue: 23,
          saturation: 0,
          lightness: 85,
        },
        [ClapSegmentCategory.STYLE]: { hue: 285, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.CAMERA]: { hue: 10, saturation: 0, lightness: 85 },
        [ClapSegmentCategory.GENERIC]: {
          hue: 200,
          saturation: 0,
          lightness: 85,
        },
      },

      waveform: {
        // "original" style
        // lineSpacing: 2,
        // gradientStart: 1.0,
        // gradientEnd: 0.6,

        // "drapes" style
        lineSpacing: 0,
        gradientStart: 0.7,
        gradientEnd: 0.1,

        // that is an "aggressive" style
        // lineSpacing: 1,
        // gradientStart: 0.6,
        // gradientEnd: 1.0,
      },
    },
    playbackCursor: {
      lineColor: '#ffffff',
    },
  },
  workflow: {
    bgColor: '#100e0e',
    node: {
      bgColor: '#121212',
      borderColor: '#3a3a3a',
      textPrimaryColor: '#d6d6d6',
      textSecondaryColor: '#b3b3b3',
      radius: '8px',
    },
    handle: {
      inputColor: '#5A5A5A',
      outputColor: '#5A5A5A',
    },
  },
}

export const ripley: UITheme = {
  id: 'ripley',
  label: 'Ripley',
  author: 'Clapper',
  colorMode: UIThemeColorMode.DARK,
  description: 'Inspired by a famous Weyland-Yutani employee.',
  defaultBgColor: '#292929',
  defaultTextColor: '#E0E7E0',
  defaultPrimaryColor: '#bcc227',
  defaultBorderColor: '#4A4A4A',
  logoColor: '#bcc227',
  editorBgColor: '#1E1E1E',
  editorCursorColor: '#bcc227',
  editorTextColor: '#E0E7E0',
  editorMenuBgColor: '#383838',
  editorMenuTextColor: '#E0E7E0',
  editorBorderColor: '#4A4A4A',
  monitorBgColor: '#1E1E1E',
  monitorSecondaryTextColor: '#bfbfb0',
  monitorPrimaryTextColor: '#bcc227',
  assistantBgColor: '#1E1E1E',
  assistantUserBgColor: '#3A4D3A',
  assistantUserTextColor: '#D1ECD1',
  assistantRobotBgColor: '#4A5E4A',
  assistantRobotTextColor: '#E6F3E6',

  formInputRadius: '32px',

  timeline: {
    topBarTimeScale: {
      backgroundColor: '#797979',
      textColor: '#FFFFFF',
      lineColor: '#D6D6D6',
    },
    leftBarTrackScale: {
      backgroundColor: '#797979',
      textColor: '#FFFFFF',
      lineColor: '#D6D6D6',
    },
    grid: {
      backgroundColor: '#292929',
    },
    cell: {
      categoryColors: baseClapSegmentCategoryColors, // Assuming this is defined elsewhere
      waveform: {
        lineSpacing: 2,
        gradientStart: 1.0,
        gradientEnd: 0.6,
      },
    },
    playbackCursor: {
      lineColor: '#bcc227',
    },
  },
  workflow: {
    bgColor: '#292929',
    node: {
      bgColor: '#383838',
      borderColor: '#4A4A4A',
      textPrimaryColor: '#bfbfb0',
      textSecondaryColor: '#A4D6A4',
      radius: '32px',
    },
    handle: {
      inputColor: '#bcc227',
      outputColor: '#bcc227',
    },
  },
}

// some themes I've made suck / need more work, so I've commented them out
export const themes: Record<UIThemeName, UITheme> = {
  backstage,
  midnight,
  lavender,
  flix,
  lore,
  gordon,
  ripley,
  silent,
}

// export type UIThemeName = keyof typeof themes
