
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

import { ClapSegmentCategory } from "@aitube/clap"
import { UITheme, UIThemeName } from "@aitube/clapper-services"
import { ClapSegmentCategoryHues, ClapTimelineTheme } from "@aitube/timeline"

// TODO: give more control here, we should be able to adjust the individual
// saturation and lightness
export const baseClapSegmentCategoryHues: ClapSegmentCategoryHues = {
  [ClapSegmentCategory.SPLAT]: 347,
  [ClapSegmentCategory.MESH]: 32,
  [ClapSegmentCategory.DEPTH]: 242,
  [ClapSegmentCategory.EVENT]: 270,
  [ClapSegmentCategory.INTERFACE]: 216,
  [ClapSegmentCategory.PHENOMENON]: 270,
  [ClapSegmentCategory.VIDEO]: 70,
  [ClapSegmentCategory.STORYBOARD]: 70,
  [ClapSegmentCategory.TRANSITION]: 55,
  [ClapSegmentCategory.CHARACTER]: 285.8,
  [ClapSegmentCategory.LOCATION]: 80.9,
  [ClapSegmentCategory.TIME]: 250,
  [ClapSegmentCategory.ERA]: 250,
  [ClapSegmentCategory.LIGHTING]: 50,
  [ClapSegmentCategory.WEATHER]: 197.2,
  [ClapSegmentCategory.ACTION]: 3,
  [ClapSegmentCategory.MUSIC]: 100,
  [ClapSegmentCategory.SOUND]: 60,
  [ClapSegmentCategory.DIALOGUE]: 23,
  [ClapSegmentCategory.STYLE]: 285,
  [ClapSegmentCategory.CAMERA]: 10,
  [ClapSegmentCategory.GENERIC]: 200,
}

// a grey and yellow theme, inspired by the entertainment world
export const backstage: UITheme = {
  id: "backstage",
  label: "Backstage",
  author: "Clapper",
  description: "",
  defaultBgColor: "#1c1917",
  defaultTextColor: "#d6d3d1",
  defaultPrimaryColor: "#FACC15",
  defaultBorderColor: "#152639",
  logoColor: "#FACC15",
  editorBgColor: "#292524",
  editorCursorColor: '#f5f5f4',
  editorTextColor: "#d6d3d1",
  editorMenuBgColor: "#1c1917",
  editorMenuTextColor: "d6d3d1",
  editorBorderColor: "#152639",
  monitorBgColor: "#1c1917",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#FACC15",

  assistantBgColor: "#292524",
  assistantUserBgColor: "#075985",
  assistantUserTextColor: "#bae6fd",
  assistantRobotBgColor: "#3730a3",
  assistantRobotTextColor: "#e0e7ff",

  timeline: {
    topBarTimeScale: {
      backgroundColor: "#7d7c78",
      textColor: "#ffffff",
      lineColor: "#E6E6E6"
    },
    leftBarTrackScale: {
      backgroundColor: "#7d7c78",
      textColor: "#ffffff",
      lineColor: "#B3B3B3"
    },
    grid: {
      backgroundColor: "#27272A",
    },
    cell: {
      saturation: 30,
      lightness: 78.6,
      hues: baseClapSegmentCategoryHues,

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
      }
    }
  }

}

export const midnight: UITheme = {
  id: "midnight",
  label: "Midnight",
  author: "Clapper",
  description: "",
  defaultBgColor: "#101e2d",
  defaultTextColor: "#b8bdc3",
  defaultPrimaryColor: "#5B9DF1",
  defaultBorderColor: "#152639",
  logoColor: "#5B9DF1",
  editorBgColor: "#101e2d",
  editorCursorColor: '#5B9DF1',
  editorTextColor: "#b8bdc3",
  editorMenuBgColor: "#101e2d",
  editorMenuTextColor: "b8bdc3",
  editorBorderColor: "#152639",
  monitorBgColor: "#152639",
  monitorSecondaryTextColor: "#b8bdc3",
  monitorPrimaryTextColor: "#5B9DF1",
  assistantBgColor: "#101e2d",
  assistantUserBgColor: "#075985",
  assistantUserTextColor: "#bae6fd",
  assistantRobotBgColor: "#3730a3",
  assistantRobotTextColor: "#e0e7ff",
  timeline: {
    topBarTimeScale: {
      backgroundColor: "rgb(70,90,107)",
      textColor: "#ffffff",
      lineColor: "#E6E6E6"
    },
    leftBarTrackScale: {
      backgroundColor: "rgb(70,90,107)",
      textColor: "#ffffff",
      lineColor: "#B3B3B3"
    },
    grid: {
      backgroundColor: "#27372A",
    },
    cell: {
      saturation: 30,
      lightness: 78.6,
      hues: baseClapSegmentCategoryHues,

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
      }
    }
  }
}

export const lavender: UITheme = {
  id: "lavender",
  label: "Lavender",
  author: "Clapper",
  description: "",
  defaultBgColor: "#32294b",
  defaultTextColor: "#dbd0fd",
  defaultPrimaryColor: "#A78BFA",
  defaultBorderColor: "#152639",
  logoColor: "#A78BFA",
  editorBgColor: "#211b32",
  editorCursorColor: '#A78BFA',
  editorTextColor: "#dbd0fd",
  editorMenuBgColor: "#32294b",
  editorMenuTextColor: "dbd0fd",
  editorBorderColor: "#152639",
  monitorBgColor: "#32294b",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#A78BFA",
  assistantBgColor: "#32294b",
  assistantUserBgColor: "#075985",
  assistantUserTextColor: "#bae6fd",
  assistantRobotBgColor: "#3730a3",
  assistantRobotTextColor: "#e0e7ff",
  timeline: {
    topBarTimeScale: {
      backgroundColor: "rgb(110,90,127)",
      textColor: "#ffffff",
      lineColor: "#E6E6E6"
    },
    leftBarTrackScale: {
      backgroundColor: "rgb(110,90,127)",
      textColor: "#ffffff",
      lineColor: "#B3B3B3"
    },
    grid: {
      backgroundColor: "#27272A",
    },
    cell: {
      saturation: 30,
      lightness: 78.6,
      hues: baseClapSegmentCategoryHues,

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
      }
    }
  }
}

export const flix: UITheme = {
  id: "flix",
  label: "Flix",
  author: "Clapper",
  description: "A new DVD rent-by-mail business",
  defaultBgColor: "#000000",
  defaultTextColor: "#D22F27",
  defaultPrimaryColor: "#D22F27",
  defaultBorderColor: "#152639",
  logoColor: "#D22F27",
  editorBgColor: "#000000",
  editorCursorColor: '#D22F27',
  editorTextColor: "#ffeeee",
  editorMenuBgColor: "#000000",
  editorMenuTextColor: "ffeeee",
  editorBorderColor: "#152639",
  monitorBgColor: "#000000",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#D22F27",
  assistantBgColor: "#000000",
  assistantUserBgColor: "#075985",
  assistantUserTextColor: "#bae6fd",
  assistantRobotBgColor: "#3730a3",
  assistantRobotTextColor: "#e0e7ff",
  timeline: {
    topBarTimeScale: {
      backgroundColor: "rgb(90,80,80)",
      textColor: "#ffffff",
      lineColor: "#E6E6E6"
    },
    leftBarTrackScale: {
      backgroundColor: "rgb(90,80,80)",
      textColor: "#ffffff",
      lineColor: "#B3B3B3"
    },
    grid: {
      backgroundColor: "#27272A",
    },
    cell: {
      saturation: 30,
      lightness: 78.6,
      hues: baseClapSegmentCategoryHues,

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
      }
    }
  }
}

export const lore: UITheme = {
  id: "lore",
  label: "Lore",
  author: "Clapper",
  description: "",
  defaultBgColor: "#151520",
  defaultTextColor: "#f6d6d8",
  defaultPrimaryColor: "#DE4A80",
  defaultBorderColor: "#152639",
  logoColor: "#DE4A80",
  editorBgColor: "#151520",
  editorCursorColor: '#DE4A80',
  editorTextColor: "#f6d6d8",
  editorMenuBgColor: "#151520",
  editorMenuTextColor: "f6d6d8",
  editorBorderColor: "#152639",
  monitorBgColor: "#151520",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#DE4A80",
  assistantBgColor: "#151520",
  assistantUserBgColor: "#075985",
  assistantUserTextColor: "#bae6fd",
  assistantRobotBgColor: "#3730a3",
  assistantRobotTextColor: "#e0e7ff",
  timeline: {
    topBarTimeScale: {
      backgroundColor: "rgb(100,100,127)",
      textColor: "#ffffff",
      lineColor: "#E6E6E6"
    },
    leftBarTrackScale: {
      backgroundColor: "rgb(100,100,127)",
      textColor: "#ffffff",
      lineColor: "#B3B3B3"
    },
    grid: {
      backgroundColor: "#27272A",
    },
    cell: {
      saturation: 30,
      lightness: 78.6,
      hues: baseClapSegmentCategoryHues,

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
      }
    }
  }
}
export const gordon: UITheme = {
  id: "gordon",
  label: "Gordon",
  author: "Clapper",
  description: "",
  defaultBgColor: "#424242",
  defaultTextColor: "#e0e0e0",
  defaultPrimaryColor: "#ff8400",
  defaultBorderColor: "#2e2e2e",
  logoColor: "#ff8400",
  editorBgColor: "#535353",
  editorCursorColor: '#ffffff',
  editorTextColor: "#e0e0e0",
  editorMenuBgColor: "#424242",
  editorMenuTextColor: "e0e0e0",
  editorBorderColor: "#2e2e2e",
  monitorBgColor: "#424242",
  monitorSecondaryTextColor: "#e0e0e0",
  monitorPrimaryTextColor: "#ff8400",

  assistantBgColor: "#535353",
  assistantUserBgColor: "#ff8400",
  assistantUserTextColor: "#ffffff",
  assistantRobotBgColor: "#6b6b6b",
  assistantRobotTextColor: "#ffffff",

  timeline: {
    topBarTimeScale: {
      backgroundColor: "#6b6b6b",
      textColor: "#ffffff",
      lineColor: "#808080"
    },
    leftBarTrackScale: {
      backgroundColor: "#6b6b6b",
      textColor: "#ffffff",
      lineColor: "#808080"
    },
    grid: {
      backgroundColor: "#535353",
    },
    cell: {
      saturation: 30,
      lightness: 78.6,
      hues: baseClapSegmentCategoryHues,

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
      }
    }
  }
}

export const system360: UITheme = {
  id: "system360",
  label: "System/360",
  author: "Clapper",
  description: "Inspired by vintage IBM mainframes",
  defaultBgColor: "#e0e0d8", // Light smoky grey
  defaultTextColor: "#31312F",
  defaultPrimaryColor: "#C74E40", // IBM blue
  defaultBorderColor: "#b8b8b0", // Lighter grey for borders
  logoColor: "#C74E40",
  editorBgColor: "#d8d8d0", // "#f0f0e8", // Slightly lighter grey for contrast
  editorCursorColor: '#C74E40',
  editorTextColor: "#31312F",
  editorMenuBgColor: "#2A2522", // //  "#d8d8d0", // Slightly darker grey for menus
  editorMenuTextColor: "31312F",
  editorBorderColor: "#b8b8b0",
  monitorBgColor: "#2A2522", // Black for screen areas
  monitorSecondaryTextColor: "#4E88DA", // Green for terminal text
  monitorPrimaryTextColor: "#818173", // White for important text
  
  assistantBgColor: "#d8d8d0",
  assistantUserBgColor: "#0072c6",
  assistantUserTextColor: "#ffffff",
  assistantRobotBgColor: "#d62728", // Red accent from the image
  assistantRobotTextColor: "#ffffff",
  
  timeline: {
    topBarTimeScale: {
      backgroundColor: "#d8d8d3",
      textColor: "#333333",
      lineColor: "#666666"
    },
    leftBarTrackScale: {
      backgroundColor: "#d8d8d3",
      textColor: "#333333",
      lineColor: "#666666"
    },
    grid: {
      backgroundColor: "#f0f0e8",
    },
    cell: {
      saturation: 30,
      lightness: 78.6,
      hues: baseClapSegmentCategoryHues,

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
      }
    }
  }
}

export const silent: UITheme = {
  id: "silent",
  label: "Silent",
  author: "Clapper",
  description: "Monochrome theme inspired by classic films",
  defaultBgColor: "#1a1a1a",
  defaultTextColor: "#d0d0d0",
  defaultPrimaryColor: "#ffffff",
  defaultBorderColor: "#2a2a2a",
  logoColor: "#ffffff",
  editorBgColor: "#1a1a1a",
  editorCursorColor: '#ffffff',
  editorTextColor: "#d0d0d0",
  editorMenuBgColor: "#1a1a1a",
  editorMenuTextColor: "d0d0d0",
  editorBorderColor: "#2a2a2a",
  monitorBgColor: "#0f0f0f",
  monitorSecondaryTextColor: "#b0b0b0",
  monitorPrimaryTextColor: "#ffffff",
  assistantBgColor: "#1a1a1a",
  assistantUserBgColor: "#3a3a3a",
  assistantUserTextColor: "#ffffff",
  assistantRobotBgColor: "#2a2a2a",
  assistantRobotTextColor: "#e0e0e0",
  timeline: {
    topBarTimeScale: {
      backgroundColor: "#3a3a3a",
      textColor: "#ffffff",
      lineColor: "#707070"
    },
    leftBarTrackScale: {
      backgroundColor: "#3a3a3a",
      textColor: "#ffffff",
      lineColor: "#707070"
    },
    grid: {
      backgroundColor: "#1f1f1f",
    },
    cell: {
      saturation: 0,
      lightness: 85,
      hues: baseClapSegmentCategoryHues,

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
      }
    }
  }
}

export const sandy: UITheme = {
  id: "sandy",
  label: "Sandy",
  author: "Clapper",
  description: "Warm, sandy tones with a rosy tint and colorful accents",
  defaultBgColor: "#c2b3b3", // Main background color with rose tint
  defaultTextColor: "#4a3939",
  defaultPrimaryColor: "#e67a7a", // Rosier accent color
  defaultBorderColor: "#ab9e9e",
  logoColor: "#e67a7a",
  editorBgColor: "#d1c2c2", // Slightly lighter for contrast, with rose tint
  editorCursorColor: '#e67a7a',
  editorTextColor: "#4a3939",
  editorMenuBgColor: "#a29494", // Slightly darker for menus, with rose tint
  editorMenuTextColor: "4a3939",
  editorBorderColor: "#ab9e9e",
  monitorBgColor: "#e0d1d1", // Light rose-sand color for main workspace
  monitorSecondaryTextColor: "#755e5e",
  monitorPrimaryTextColor: "#4a3939",
  assistantBgColor: "#d1c2c2",
  assistantUserBgColor: "#e67a7a",
  assistantUserTextColor: "#ffffff",
  assistantRobotBgColor: "#b68e8e", // Rosier teal accent color
  assistantRobotTextColor: "#ffffff",
  timeline: {
    topBarTimeScale: {
      backgroundColor: "#e0d3d3",
      textColor: "#2a1919",
      lineColor: "#553e3e"
    },
    leftBarTrackScale: {
      backgroundColor: "#e0d3d3",
      textColor: "#2a1919",
      lineColor: "#553e3e"
    },
    grid: {
      backgroundColor: "#b0a3a3",
    },
    cell: {
      saturation: 30,
      lightness: 78.6,
      hues: baseClapSegmentCategoryHues,

      waveform: {
        // "original" style
        //lineSpacing: 2,
        //gradientStart: 1.0,
        //gradientEnd: 0.6,
  
        // "drapes" style
        lineSpacing: 0,
        gradientStart: 0.7,
        gradientEnd: 0.1,
  
        // that is an "aggressive" style
        // lineSpacing: 1,
        // gradientStart: 0.6,
        // gradientEnd: 1.0,
      }
    }
  }
}

export const themes: Record<UIThemeName, UITheme> = {
  backstage,
  midnight,
  lavender,
  sandy,
  flix,
  lore,
  gordon,
  system360,
  silent
}

// export type UIThemeName = keyof typeof themes