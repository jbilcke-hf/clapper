import { Menubar } from "@/components/ui/menubar"

import { TopMenuFile } from "./file"
import { TopMenuView } from "./view"
import { TopMenuSettings } from "./settings"

export function TopMenu() {
  return (
    <Menubar>
      <TopMenuFile />
      <TopMenuSettings />
      <TopMenuView />
    </Menubar>
  )
}
