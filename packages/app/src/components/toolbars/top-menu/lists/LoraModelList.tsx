'use client'

import { ClapWorkflow } from '@aitube/clap'

import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar'

import { defaultLoraModels } from '@/services/editors/workflow-editor/workflows/common/loras'
import { Lora } from '@/services/editors/workflow-editor/workflows/common/types'

export function LoraModelList({
  workflow,
  currentLora,
  onChange,
}: {
  workflow: ClapWorkflow
  currentLora?: Lora
  onChange: (lora?: Lora) => void
}) {
  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <div className="pl-6">
          <span>{workflow.label}</span>
          <span className="ml-1 opacity-70">{currentLora ? `(${currentLora.label})` : `(no lora selected)`}</span>
        </div>
      </MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarCheckboxItem
          key={'no_lora'}
          checked={!currentLora?.id}
          onClick={(e) => {
            onChange(undefined)
            e.stopPropagation()
            e.preventDefault()
            return false
          }}
        >
          No LoRA
        </MenubarCheckboxItem>
        {defaultLoraModels.map((lora: Lora) => (
          <MenubarCheckboxItem
            key={lora.id}
            checked={currentLora?.id === lora.id}
            onClick={(e) => {
              onChange(lora)
              e.stopPropagation()
              e.preventDefault()
              return false
            }}
          >
            {lora.label}
          </MenubarCheckboxItem>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}
