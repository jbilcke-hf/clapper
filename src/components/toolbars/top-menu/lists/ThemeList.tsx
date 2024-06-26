"use client"

import { UIThemeName } from "@aitube/clapper-services"

import { Tag } from "@/components/tags/Tag"
import { TagColor } from "@/components/tags/types"
import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar"
import { useUI } from "@/services/ui"
import { themes } from "@/services/ui/theme"
import { useTheme } from "@/services/ui/useTheme"


export function ThemeList() {
  const theme = useTheme()
  const setThemeName = useUI(s => s.setThemeName)

  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <Tag size="lg" color={TagColor.GRAY}>theme</Tag>
        {theme.label}
      </MenubarSubTrigger>
      <MenubarSubContent>
        {Object.entries(themes).map(([id, { label }]) => (
          <MenubarCheckboxItem
            key={id}
            checked={id === theme.id}
            onClick={(e) => {
              setThemeName(id as UIThemeName)
              e.stopPropagation()
              e.preventDefault()
              return false
            }}>
            {label}
          </MenubarCheckboxItem>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}