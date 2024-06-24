
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
export type UITheme = {
  id: string
  label: string
  author: string
  description: string
  defaultBgColor?: string
  defaultTextColor?: string
  defaultPrimaryColor?: string
  logoColor?: string
  editorBgColor?: string
  editorCursorColor?: string
  editorTextColor?: string

  // background color of the video preview monitor
  monitorBgColor?: string

  // text of the elapsed/total duration counter in the video preview monitor
  monitorSecondaryTextColor?: string
  monitorPrimaryTextColor?: string

  timelineFilter: string
}

// a grey and yellow theme, inspired by the entertainment world
export const backstage: UITheme = {
  id: "backstage",
  label: "Backstage",
  author: "Clapper",
  description: "",
  defaultBgColor: "#1c1917", // bg-stone-900
  defaultTextColor: "#d6d3d1", // bg-stone-300
  defaultPrimaryColor: "#FACC15",
  logoColor: "#FACC15",
  editorBgColor: "#292524", // bg-stone-900
  editorCursorColor: '#f5f5f4',
  editorTextColor: "#d6d3d1",
  monitorBgColor: "#1c1917", // bg-stone-900
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#FACC15",
  timelineFilter: "",
}

export const mythril: UITheme = {
  id: "mythril",
  label: "Mythril",
  author: "Clapper",
  description: "You shall not pass",
  defaultBgColor: "#092a26",
  defaultTextColor: "#b3c0c0",
  defaultPrimaryColor: "#2DD4BF",
  logoColor: "#2DD4BF",
  editorBgColor: "#092a26",
  editorCursorColor: '#2DD4BF',
  editorTextColor: "#b3c0c0",
  monitorBgColor: "#0d3f39",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#2DD4BF",
  timelineFilter: "hue-rotate(93deg) saturate(0.2)",
}

export const midnight: UITheme = {
  id: "midnight",
  label: "Midnight",
  author: "Clapper",
  description: "",
  defaultBgColor: "#101e2d",
  defaultTextColor: "#b8bdc3",
  defaultPrimaryColor: "#5B9DF1",
  logoColor: "#5B9DF1",
  editorBgColor: "#101e2d",
  editorCursorColor: '#5B9DF1',
  editorTextColor: "#b8bdc3",
  monitorBgColor: "#152639",
  monitorSecondaryTextColor: "#b8bdc3",
  monitorPrimaryTextColor: "#5B9DF1",
  timelineFilter: "hue-rotate(147deg) saturate(0.3) brightness(0.95) contrast(1.05)"
}

export const lavender: UITheme = {
  id: "lavender",
  label: "Lavender",
  author: "Clapper",
  description: "",
  defaultBgColor: "#32294b",
  defaultTextColor: "#dbd0fd",
  defaultPrimaryColor: "#A78BFA",
  logoColor: "#A78BFA",
  editorBgColor: "#211b32",
  editorCursorColor: '#A78BFA',
  editorTextColor: "#dbd0fd",
  monitorBgColor: "#32294b",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#A78BFA",
  timelineFilter: "hue-rotate(221deg) saturate(0.3) brightness(0.9) sepia(0.15) contrast(1)"
}

export const flix: UITheme = {
  id: "flix",
  label: "Flix",
  author: "Clapper",
  description: "A new DVD rent-by-mail business",
  defaultBgColor: "#000000",
  defaultTextColor: "#D22F27",
  defaultPrimaryColor: "#D22F27",
  logoColor: "#D22F27",
  editorBgColor: "#000000",
  editorCursorColor: '#D22F27',
  editorTextColor: "#ffeeee",
  monitorBgColor: "#000000",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#D22F27",
  timelineFilter: "hue-rotate(47deg) saturate(0.2) brightness(0.85) contrast(1.15)"
}

export const sendhugs: UITheme = {
  id: "sendhugs",
  label: "Send Hugs",
  author: "Clapper",
  description: "",
  defaultBgColor: "#312702",
  defaultTextColor: "#F8D44E",
  defaultPrimaryColor: "#312702",
  logoColor: "#312702",
  editorBgColor: "#181301",
  editorCursorColor: '#F8D44E',
  editorTextColor: "#F8D44E",
  monitorBgColor: "#312702",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#312702",
    timelineFilter: ""
}

export const lore: UITheme = {
  id: "lore",
  label: "Lore",
  author: "Clapper",
  description: "",
  defaultBgColor: "#151520",
  defaultTextColor: "#f6d6d8",
  defaultPrimaryColor: "#DE4A80",
  logoColor: "#DE4A80",
  editorBgColor: "#151520",
  editorCursorColor: '#DE4A80',
  editorTextColor: "#f6d6d8",
  monitorBgColor: "#151520",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#DE4A80",
  timelineFilter: "hue-rotate(303deg) saturate(0.3) brightness(0.9) contrast(1.1)"
}

export const mocha: UITheme = {
  id: "mocha",
  label: "Mocha",
  author: "Clapper",
  description: "",
  defaultBgColor: "#412f1f",
  defaultTextColor: "#CDA983",
  defaultPrimaryColor: "#D4AA6E",
  logoColor: "#D4AA6E",
  editorBgColor: "#271c12",
  editorCursorColor: '#D4AA6E',
  editorTextColor: "#CDA983",
  monitorBgColor: "#342619",
  monitorSecondaryTextColor: "#c1af9e",
  monitorPrimaryTextColor: "#D4AA6E",
  timelineFilter: "hue-rotate(353deg) saturate(1.2) brightness(0.85) contrast(1.09) sepia(0.5)"
}
export const themes = {
  backstage,
  midnight,
  lavender,
  mythril,
  flix,
  // sendhugs,
  lore,
  mocha
}

export type UIThemeName = keyof typeof themes