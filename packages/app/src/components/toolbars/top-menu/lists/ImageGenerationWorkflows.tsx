'use client'

import {
  ClapInputCategory,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'

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
import { Lora } from '@/services/editors/workflow-editor/workflows/common/types'
import { getWorkflowLora } from '@/services/editors/workflow-editor/workflows/common/loras/getWorkflowLora'
import { getWorkflowInputField } from '@/services/editors/workflow-editor/workflows/common/loras/getWorkflowInputField'

import { LoraModelList } from './LoraModelList'

const category = ClapWorkflowCategory.IMAGE_GENERATION

export function ImageGenerationWorkflows() {
  const imageGenerationWorkflow = useSettings((s) => s.imageGenerationWorkflow)
  const setImageGenerationWorkflow = useSettings(
    (s) => s.setImageGenerationWorkflow
  )
  const availableWorkflows = useWorkflowEditor((s) => s.availableWorkflows)

  const { providers, nbProviders } = findWorkflows(availableWorkflows, {
    category,
  })

  if (!nbProviders) {
    return null
  }

  const workflow = parseWorkflow(imageGenerationWorkflow, category)
  const workflowLora = getWorkflowLora(workflow)

  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <Tag size="lg" color={TagColor.SKY}>
          generate&nbsp;image
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
              {workflows?.map((w) => {
                // if this workflow has at least one field of type lora
                const loraFieldName = getWorkflowInputField(
                  w,
                  ClapInputCategory.LORA
                )?.id
                if (loraFieldName) {
                  return (
                    <LoraModelList
                      key={`wf_${w.id}`}
                      workflow={w}
                      currentLora={workflowLora}
                      onChange={(newLora?: Lora) => {
                        console.log(`onChange:`, {
                          w,
                          newLora,
                          loraFieldName,
                          repoUrl: newLora?.repoOrUrl,
                          newWorkflowValue: {
                            ...w,
                            inputValues: {
                              ...w.inputValues,
                              [loraFieldName]: newLora?.repoOrUrl || '',
                            },
                          },
                        })
                        setImageGenerationWorkflow({
                          ...w,
                          inputValues: {
                            ...w.inputValues,
                            [loraFieldName]: newLora?.repoOrUrl || '',
                          },
                        })
                      }}
                    />
                  )
                }

                return (
                  <MenubarCheckboxItem
                    key={`wf_${w.id}`}
                    checked={workflow.id === w.id}
                    disabled={hasNoPublicAPI(w)}
                    onClick={(e) => {
                      if (hasNoPublicAPI(w)) {
                        e.stopPropagation()
                        e.preventDefault()
                        return false
                      }
                      setImageGenerationWorkflow(w)
                      e.stopPropagation()
                      e.preventDefault()
                      return false
                    }}
                  >
                    {w.label}
                  </MenubarCheckboxItem>
                )
              })}
            </MenubarSubContent>
          </MenubarSub>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}
