import { FormField } from './FormField'
import { FormInput } from './FormInput'
import { GrDocumentConfig } from 'react-icons/gr'
import debounce from 'lodash/debounce'
import { FormSelect } from './FormSelect'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { MdInfo, MdWarning } from 'react-icons/md'
import { ClapInputField, ClapWorkflow } from '@aitube/clap'
import { FormArea } from './FormArea'
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import { ComfyUIWorkflowApiGraph } from '@/app/api/resolve/providers/comfyui/graph'
import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'
import { MainClapWorkflowInputsLabels } from '@/app/api/resolve/providers/comfyui/utils'
import { getComfyUiWorkflowPresetsForCategory } from '@/services/editors/workflow-editor/workflows/comfyui'
import { comfyUiToReactWorkflow } from '@/components/editors/WorkflowEditor/WorkflowViewer/ReactFlowCanvas/formats/comfyui/comfyUiToReactWorkflow'
import { Button } from '../ui/button'

export function FormComfyUIWorkflowSettings({
  label,
  clapWorkflow,
  defaultClapWorkflow,
  onChange,
  className,
}: {
  label: string
  clapWorkflow: ClapWorkflow
  defaultClapWorkflow: ClapWorkflow
  onChange: (clapWorkflow: ClapWorkflow) => void
  className?: any
}) {
  const [clapWorkflowDataDraft, setClapWorkflowDataDraft] = useState(
    clapWorkflow?.data || defaultClapWorkflow.data
  )
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [errors, setErrors] = useState<{ workflow: string | null }>({
    workflow: null,
  })

  useEffect(() => {
    if (clapWorkflow?.data && clapWorkflow.data !== clapWorkflowDataDraft) {
      setClapWorkflowDataDraft(clapWorkflow.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clapWorkflow?.data])

  const categoryPresets = useMemo(
    () =>
      getComfyUiWorkflowPresetsForCategory(
        clapWorkflow?.category || defaultClapWorkflow.category
      ),
    [clapWorkflow?.category, defaultClapWorkflow.category]
  )

  const graphPreview = useMemo(() => {
    if (!ComfyUIWorkflowApiGraph.isValidWorkflow(clapWorkflowDataDraft)) {
      return { nodes: [], edges: [] }
    }
    return comfyUiToReactWorkflow(clapWorkflowDataDraft)
  }, [clapWorkflowDataDraft])

  const mappedRoleByNodeId = useMemo(() => {
    const roles: Record<string, string[]> = {}
    const inputValues = clapWorkflow?.inputValues || {}
    for (const [mainKey, labelText] of Object.entries(
      MainClapWorkflowInputsLabels
    )) {
      const target = inputValues[mainKey] as { id?: string } | undefined
      if (!target?.id) continue
      const nodeId = target.id.includes('.inputs.')
        ? target.id.split('.inputs.')[0]
        : target.id
      if (!roles[nodeId]) roles[nodeId] = []
      roles[nodeId].push(labelText)
    }
    return roles
  }, [clapWorkflow?.inputValues])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChangeClapWorkflow = useCallback(
    debounce((updatedWorkflow: ClapWorkflow) => {
      onChange(updatedWorkflow)
    }, 300),
    [onChange]
  )

  const applyWorkflowJsonImmediately = (json: string) => {
    setClapWorkflowDataDraft(json || '')
    if (ComfyUIWorkflowApiGraph.isValidWorkflow(json)) {
      setErrors({ ...errors, workflow: null })
      const converted = structuredClone(
        convertComfyUiWorkflowApiToClapWorkflow(
          json,
          clapWorkflow?.category || defaultClapWorkflow.category
        )
      )
      onChange(converted)
    } else {
      setErrors({ ...errors, workflow: 'Please, provide a valid workflow.' })
    }
  }

  const handleOnChangeJson = (json: string) => {
    setClapWorkflowDataDraft(json || '')
    if (ComfyUIWorkflowApiGraph.isValidWorkflow(json)) {
      setErrors({ ...errors, workflow: null })
      debouncedOnChangeClapWorkflow(
        structuredClone(
          convertComfyUiWorkflowApiToClapWorkflow(
            json,
            clapWorkflow?.category || defaultClapWorkflow.category
          )
        )
      )
    } else {
      setErrors({ ...errors, workflow: 'Please, provide a valid workflow.' })
    }
  }

  const handleSelectPreset = (presetId?: string) => {
    if (!presetId) return
    setSelectedPresetId(presetId)
    const preset = categoryPresets.find((p) => p.id === presetId)
    if (preset) {
      applyWorkflowJsonImmediately(preset.data)
    }
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      applyWorkflowJsonImmediately(text)
    } catch {
      setErrors({
        ...errors,
        workflow: 'Failed to read workflow file.',
      })
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleOnChangeInputValue = (inputId, inputValue) => {
    clapWorkflow.inputValues[inputId] = inputValue
    const workflowGraph = ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data)
    // Apply same change to the graph
    workflowGraph.setInputValue(inputId, inputValue, { ignoreErrors: true })
    // Update the generated 'data' based on new input values
    clapWorkflow.data = workflowGraph.toString()
    setClapWorkflowDataDraft(clapWorkflow.data || '')
    if (ComfyUIWorkflowApiGraph.isValidWorkflow(clapWorkflow.data)) {
      setErrors({ ...errors, workflow: null })
      debouncedOnChangeClapWorkflow(structuredClone(clapWorkflow))
    } else {
      setErrors({ ...errors, workflow: 'Please, provide a valid workflow.' })
    }
  }

  const renderInputTooltip = (tooltip) => {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="absolute right-0 top-0 flex h-full w-auto items-center justify-center px-2">
            <div className="h-4 w-4">
              {tooltip.type == 'info' ? (
                <MdInfo color="white" className="h-full w-full" />
              ) : (
                <MdWarning color="yellow" className="h-full w-full" />
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p
            className={clsx('max-w-96 text-xs font-bold leading-4', {
              'text-yellow-500': tooltip.type === 'warning',
              'text-slate-100': tooltip.type === 'info',
            })}
          >
            {tooltip.message}
          </p>
        </TooltipContent>
      </Tooltip>
    )
  }

  const renderInputFields = (
    inputFields: ClapInputField[],
    inputValues: Record<string, any>
  ) => {
    return inputFields.map((inputField) => {
      switch (inputField.type as any) {
        case 'group': {
          return (
            <div className="w-full" key={inputField.id}>
              <div className="flex items-center gap-2 text-white/50">
                <GrDocumentConfig />
                <span className="text-sm font-normal">{inputField.label}</span>
              </div>
              <div className="w-full">
                <div className="mt-3 flex w-full flex-col gap-5 rounded-md border border-neutral-50/80 p-4 dark:border-neutral-100/10">
                  {inputField.inputFields &&
                    renderInputFields(inputField.inputFields, inputValues)}
                </div>
              </div>
            </div>
          )
        }
        case 'nodeInput':
        case 'node': {
          return (
            <div
              className="relative flex items-center justify-center"
              key={inputField.id}
            >
              <FormSelect
                className={clsx({
                  'pr-10': inputField.metadata?.tooltip,
                })}
                key={inputField.id}
                label={inputField.label}
                items={inputField.metadata?.options}
                selectedItemId={inputValues[inputField.id]?.id}
                selectedItemLabel={
                  !inputValues[inputField.id]
                    ? 'Not found'
                    : inputValues[inputField.id].label
                }
                onSelect={(value) =>
                  handleOnChangeInputValue(inputField.id, value)
                }
              />
              {inputField.metadata?.tooltip &&
                renderInputTooltip(inputField.metadata.tooltip)}
            </div>
          )
        }
        default: {
          return (
            <div className="relative" key={inputField.id}>
              <FormInput
                key={inputField.id}
                label={inputField.label}
                value={inputValues[inputField.id]}
                defaultValue={inputField.defaultValue}
                type={inputField.type}
                minValue={0}
                maxValue={Number.MAX_VALUE}
                onChange={(value) =>
                  handleOnChangeInputValue(inputField.id, value)
                }
                className="pr-8"
              />
              {inputField.metadata?.tooltip &&
                renderInputTooltip(inputField.metadata.tooltip)}
            </div>
          )
        }
      }
    })
  }

  return (
    <>
      {categoryPresets.length > 0 && (
        <div className="flex flex-wrap items-end gap-3 pb-2">
          <FormSelect<string>
            label="Workflow preset template"
            selectedItemId={selectedPresetId}
            selectedItemLabel={
              categoryPresets.find((p) => p.id === selectedPresetId)?.label ||
              'Choose a built-in ComfyUI preset...'
            }
            items={categoryPresets.map((preset) => ({
              id: preset.id,
              label: preset.label,
              value: preset.id,
            }))}
            onSelect={handleSelectPreset}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Import .json
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              applyWorkflowJsonImmediately(defaultClapWorkflow.data)
            }
          >
            Reset to default
          </Button>
        </div>
      )}

      <FormArea
        label={label}
        value={clapWorkflowDataDraft}
        defaultValue={''}
        onChange={handleOnChangeJson}
        rows={8}
        error={errors['workflow']}
      />

      {Object.values(errors).filter(Boolean).length == 0 && (
        <div className={className}>
          {graphPreview.nodes.length > 0 && (
            <div className="mb-5 rounded-md border border-neutral-100/10 bg-neutral-900/40 p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                <span className="font-medium text-white/80">
                  Workflow Graph Preview
                </span>
                <span>
                  {graphPreview.nodes.length} nodes ·{' '}
                  {graphPreview.edges.length} connections
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {graphPreview.nodes.map((node) => {
                  const roles = mappedRoleByNodeId[node.id] || []
                  return (
                    <div
                      key={node.id}
                      className={clsx(
                        'flex flex-col rounded border px-2.5 py-1.5 text-xs',
                        roles.length > 0
                          ? 'border-amber-500/50 bg-amber-950/30 text-amber-100'
                          : 'border-neutral-700/60 bg-neutral-800/50 text-neutral-200'
                      )}
                    >
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="text-white/40">#{node.id}</span>
                        <span>{String(node.data?.label || node.id)}</span>
                      </div>
                      {node.data?.classType && (
                        <span className="text-[10px] text-white/40">
                          {String(node.data.classType)}
                        </span>
                      )}
                      {roles.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {roles.map((role) => (
                            <span
                              key={role}
                              className="rounded bg-amber-500/20 px-1 py-0.5 text-[10px] font-semibold text-amber-300"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <FormField
            label={' '}
            className="relative flex flex-col items-start gap-5"
          >
            {renderInputFields(
              clapWorkflow.inputFields,
              clapWorkflow.inputValues
            )}
          </FormField>
        </div>
      )}
    </>
  )
}
