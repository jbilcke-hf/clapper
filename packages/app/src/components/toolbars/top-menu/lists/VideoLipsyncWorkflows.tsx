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

const category = ClapWorkflowCategory.VIDEO_LIPSYNC

export function VideoLipsyncWorkflows() {
  const videoLipsyncWorkflow = useSettings((s) => s.videoLipsyncWorkflow)
  const setVideoLipsyncWorkflow = useSettings((s) => s.setVideoLipsyncWorkflow)
  const availableWorkflows = useWorkflowEditor((s) => s.availableWorkflows)

  const { providers, nbProviders } = findWorkflows(availableWorkflows, {
    category: ClapWorkflowCategory.VIDEO_LIPSYNC,
  })

  const workflow = parseWorkflow(videoLipsyncWorkflow, category)

  if (!nbProviders) {
    return null
  }

  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <Tag size="lg" color={TagColor.ZINC}>
          lip&amp;sync
        </Tag>
        <div className={cn(`flex flex-row items-center space-x-2`)}>
          {workflow?.provider && (
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
                    setVideoLipsyncWorkflow(w)
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
