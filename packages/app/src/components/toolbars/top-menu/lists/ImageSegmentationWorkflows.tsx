'use client'

import { ClapWorkflowCategory, ClapWorkflowProvider } from '@aitube/clap'

import {
  MenubarCheckboxItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar'

import { TagColor } from '@/components/tags/types'
import { Tag } from '@/components/tags/Tag'
import { useSettings } from '@/services/settings'
import { cn } from '@/lib/utils'

import { hasNoPublicAPI } from './hasNoPublicAPI'
import { useWorkflowEditor } from '@/services/editors'
import { findWorkflows } from './getWorkflowProviders'
import {
  ClapWorkflowProviderLogo,
  ClapWorkflowProviderName,
} from '@/components/core/providers'
import { parseWorkflow } from '@/services/settings/workflows/parseWorkflow'

const category = ClapWorkflowCategory.IMAGE_SEGMENTATION

export function ImageSegmentationWorkflows() {
  const imageSegmentationWorkflow = useSettings(
    (s) => s.imageSegmentationWorkflow
  )
  const setImageSegmentationWorkflow = useSettings(
    (s) => s.setImageSegmentationWorkflow
  )
  const availableWorkflows = useWorkflowEditor((s) => s.availableWorkflows)

  const { providers, nbProviders } = findWorkflows(availableWorkflows, {
    category,
  })

  const workflow = parseWorkflow(imageSegmentationWorkflow, category)

  if (!nbProviders) {
    return null
  }

  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <Tag size="lg" color={TagColor.ZINC}>
          segmentation
        </Tag>
        <div className={cn(`flex flex-row items-center space-x-2`)}>
          {workflow?.provider &&
            workflow?.provider !== ClapWorkflowProvider.NONE && (
              <ClapWorkflowProviderLogo
                provider={workflow?.provider}
                height={18}
                className={cn(`rounded-full`)}
              />
            )}
          <div>{workflow?.label || 'None'}</div>
        </div>
      </MenubarSubTrigger>
      <MenubarSubContent>
        {Object.entries(providers).map(([p, workflows]) => (
          <MenubarSub key={p}>
            <MenubarSubTrigger>
              <ClapWorkflowProviderName>
                {p as ClapWorkflowProvider}
              </ClapWorkflowProviderName>
            </MenubarSubTrigger>
            <MenubarSubContent>
              {workflows?.map((w) => (
                <MenubarCheckboxItem
                  key={w.id}
                  checked={workflow.id === w.id}
                  disabled={hasNoPublicAPI(w)}
                  onClick={(e) => {
                    if (hasNoPublicAPI(w)) {
                      e.stopPropagation()
                      e.preventDefault()
                      return false
                    }
                    setImageSegmentationWorkflow(w)
                    e.stopPropagation()
                    e.preventDefault()
                    return false
                  }}
                >
                  {w.label}
                </MenubarCheckboxItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}
