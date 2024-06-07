import { Menubar } from "@/components/ui/menubar"

import { TopMenuFile } from "./file"

import { TopMenuImage } from "./image"
import { TopMenuVideo } from "./video"
import { TopMenuVoice } from "./voice"
import { TopMenuSound } from "./sound"
import { TopMenuMusic } from "./music"

import { TopMenuView } from "./view"

export function TopMenu() {
  return (
    <Menubar>
      <TopMenuFile />
      <TopMenuImage />
      <TopMenuVideo />
      <TopMenuVoice />
      <TopMenuSound />
      <TopMenuMusic />
      <TopMenuView />
    </Menubar>
  )
}
