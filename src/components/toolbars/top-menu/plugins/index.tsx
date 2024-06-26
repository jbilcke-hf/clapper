"use client"
import { useEffect } from "react"

import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar"

import { usePlugins } from "@/services/plugins/usePlugins"

export function TopMenuPlugins() {
  const availablePlugins = usePlugins(s => s.availablePlugins)
  const installedPlugins = usePlugins(s => s.installedPlugins)

  return (
    <>
    <MenubarMenu>
      <MenubarTrigger>Plugins</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => {
        }}>
          Soon (not available yet)
        </MenubarItem>
       
      </MenubarContent>
    </MenubarMenu>
    </>
  )
}
