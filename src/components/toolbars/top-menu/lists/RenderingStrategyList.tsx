"use client"

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

import { RenderingStrategy } from "@aitube/timeline"
import { strategyLabels } from "../constants"
import { Tag } from "@/components/tags/Tag"
import { TagColor } from "@/components/tags/types"

const defaultStrategies: RenderingStrategy[] = Object.keys(strategyLabels) as RenderingStrategy[]

export function RenderingStrategyList({
  strategies = defaultStrategies,
  current,
  setter,
}: {
  strategies?: RenderingStrategy[]
  current?: RenderingStrategy
  setter: (strategy: RenderingStrategy) => void
}) {
  return (
    <MenubarSub>
      <MenubarSubTrigger>
        {/* todo display either autorender or manual render */}
        <Tag size="lg" color={TagColor.NEUTRAL}>auto&nbsp;rendering</Tag>
        {(strategyLabels as any)[current || ""] || "None"}
      </MenubarSubTrigger>
      <MenubarSubContent>
      {strategies.map(strategy => (
          <MenubarCheckboxItem
             key={strategy}
            checked={current === strategy}
            onClick={(e) => {
              setter(strategy)
              e.stopPropagation()
              e.preventDefault()
              return false
            }}>
            {strategyLabels[strategy]}
          </MenubarCheckboxItem>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}