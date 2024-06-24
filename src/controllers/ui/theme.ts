
// note: this should also change the look of the timeline
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
  editorFgColor?: string

  // background color of the video preview monitor
  monitorBgColor?: string

  // text of the elapsed/total duration counter in the video preview monitor
  monitorSecondaryTextColor?: string
  monitorPrimaryTextColor?: string
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
  editorFgColor: "#d6d3d1", // bg-stone-300
  monitorBgColor: "#1c1917", // bg-stone-900
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#FACC15",
}

export const mythril: UITheme = {
  id: "mythril",
  label: "Mythril",
  author: "Clapper",
  description: "Sleek",
  defaultBgColor: "#092a26",
  defaultTextColor: "#b3c0c0",
  defaultPrimaryColor: "#2DD4BF",
  logoColor: "#2DD4BF",
  editorBgColor: "#092a26",
  editorFgColor: "#4ADE80",
  monitorBgColor: "#0d3f39",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#2DD4BF",
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
  editorFgColor: "#dbd0fd",
  monitorBgColor: "#32294b",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#A78BFA",
}
// Aka Flixed
export const kibble: UITheme = {
  id: "kibble",
  label: "Kibble",
  author: "Clapper",
  description: "A new DVD rent-by-mail business",
  defaultBgColor: "#000000",
  defaultTextColor: "#D22F27",
  defaultPrimaryColor: "#D22F27",
  logoColor: "#D22F27",
  editorBgColor: "#000000",
  editorFgColor: "#D22F27",
  monitorBgColor: "#000000",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#D22F27",
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
  editorFgColor: "#F8D44E",
  monitorBgColor: "#312702",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#312702",
}

export const circus: UITheme = {
  id: "circus",
  label: "Circus",
  author: "Clapper",
  description: "",
  defaultBgColor: "#151520",
  defaultTextColor: "#E3747B",
  defaultPrimaryColor: "#DE4A80",
  logoColor: "#DE4A80",
  editorBgColor: "#151520",
  editorFgColor: "#E3747B",
  monitorBgColor: "#151520",
  monitorSecondaryTextColor: "#D6D3D1",
  monitorPrimaryTextColor: "#DE4A80",
}

export const cappuccino: UITheme = {
  id: "cappuccino",
  label: "Cappuccino",
  author: "Clapper",
  description: "",
  defaultBgColor: "#412f1f",
  defaultTextColor: "#CDA983",
  defaultPrimaryColor: "#D4AA6E",
  logoColor: "#D4AA6E",
  editorBgColor: "#271c12",
  editorFgColor: "#CDA983",
  monitorBgColor: "#342619",
  monitorSecondaryTextColor: "#c1af9e",
  monitorPrimaryTextColor: "#D4AA6E",
}
export const themes = {
  backstage,
  lavender,
  // midnight // blue like theme
  mythril, // teal-like theme
  kibble,
  // sendhugs,
  circus,
  cappuccino
}

export type UIThemeName = keyof typeof themes