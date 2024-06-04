import { Menubar } from "@/components/ui/menubar"

import { TopMenuFile } from "./file"
import { TopMenuView } from "./view"
import { TopMenuRendering } from "./rendering"

export function TopMenu() {
  return (
    <Menubar>
      <TopMenuFile />
      {/*
      <TopMenuEdit />
      <TopMenuPlayback />
      <TopMenuAssistant />
      */}
      <TopMenuRendering />
      {/*<TopMenuView />*/}
    </Menubar>
  )
}
