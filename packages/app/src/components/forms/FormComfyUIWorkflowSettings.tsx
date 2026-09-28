import { FormField } from './FormField'
import { FormInput } from './FormInput'
import { GrDocumentConfig } from 'react-icons/gr'
import debounce from 'lodash/debounce'
import { FormSelect } from './FormSelect'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { MdInfo, MdWarning } from 'react-icons/md'
import { ClapInputField, ClapWorkflow } from '@aitube/clap'
import { FormArea } from './FormArea'
import { useEffect, useMemo, useState } from 'react'
import { ComfyWorkflowPreview } from './ComfyWorkflowPreview'
import clsx from 'clsx'
import { ComfyUIWorkflowApiGraph } from '@/app/api/resolve/providers/comfyui/graph'
import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'

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
  className: any
}) {
  const [clapWorkflowDataDraft, setClapWorkflowDataDraft] = useState(
    clapWorkflow.data || defaultClapWorkflow.data
  )

  const [workflowDraft, setWorkflowDraft] = useState(clapWorkflow)

  const [errors, setErrors] = useState<{ workflow: string | null }>({
    workflow: null,
  })

  const debouncedOnChangeClapWorkflow = useMemo(
    () =>
      debounce((clapWorkflow: ClapWorkflow) => {
        onChange(clapWorkflow)
      }, 300),
    [onChange]
  )

  useEffect(
    () => () => debouncedOnChangeClapWorkflow.cancel(),
    [debouncedOnChangeClapWorkflow]
  )
  useEffect(() => {
    setClapWorkflowDataDraft(clapWorkflow.data || defaultClapWorkflow.data)
    setWorkflowDraft(clapWorkflow)
    setErrors({ workflow: null })
  }, [clapWorkflow, defaultClapWorkflow.data])

  const importFile = async (file?: File) => {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ workflow: 'Workflow JSON must be smaller than 2 MB.' })
      return
    }
    try {
      handleOnChangeJson(await file.text())
    } catch {
      setErrors({ workflow: 'Could not read this workflow file.' })
    }
  }

  const handleOnChangeJson = (json: string) => {
    setClapWorkflowDataDraft(json || '')
    if (ComfyUIWorkflowApiGraph.isValidWorkflow(json)) {
      setErrors({ ...errors, workflow: null })
      const converted = convertComfyUiWorkflowApiToClapWorkflow(
        json,
        clapWorkflow.category
      )
      setWorkflowDraft(converted)
      debouncedOnChangeClapWorkflow(converted)
    } else {
      debouncedOnChangeClapWorkflow.cancel()
      setErrors({
        ...errors,
        workflow:
          'Import ComfyUI API-format JSON with valid node connections. Use Save (API Format) in ComfyUI; the canvas/UI format is different.',
      })
    }
  }

  const handleOnChangeInputValue = (inputId, inputValue) => {
    const updatedWorkflow = structuredClone(workflowDraft)
    updatedWorkflow.inputValues[inputId] = inputValue
    const workflowGraph = ComfyUIWorkflowApiGraph.fromString(
      updatedWorkflow.data
    )
    // Apply same change to the graph
    // TODO: add a setter to clapWorkflow to update its data when updating inputFields
    workflowGraph.setInputValue(inputId, inputValue, { ignoreErrors: true })
    // Update the generate 'data' based on new input values
    updatedWorkflow.data = workflowGraph.toString()
    setClapWorkflowDataDraft(updatedWorkflow.data || '')
    if (ComfyUIWorkflowApiGraph.isValidWorkflow(updatedWorkflow.data)) {
      setErrors({ ...errors, workflow: null })
      // If changes on JSON, convert it to ClapWorkflow
      setWorkflowDraft(updatedWorkflow)
      debouncedOnChangeClapWorkflow(updatedWorkflow)
    } else {
      debouncedOnChangeClapWorkflow.cancel()
      setErrors({
        ...errors,
        workflow:
          'Import ComfyUI API-format JSON with valid node connections. Use Save (API Format) in ComfyUI; the canvas/UI format is different.',
      })
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
        case 'boolean': {
          return (
            <label key={inputField.id} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(inputValues[inputField.id])}
                onChange={(event) =>
                  handleOnChangeInputValue(inputField.id, event.target.checked)
                }
              />
              {inputField.label}
            </label>
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
      <div
        className="rounded border border-dashed border-neutral-500/50 p-3"
        onDragOver={(event) => {
          event.preventDefault()
        }}
        onDrop={(event) => {
          event.preventDefault()
          void importFile(event.dataTransfer.files[0])
        }}
      >
        <label className="block text-sm">
          Import a ComfyUI API workflow or drop its JSON file here
          <input
            aria-label={`Import ${label}`}
            type="file"
            accept=".json,application/json"
            className="mt-2 block w-full text-xs"
            onChange={(event) => {
              void importFile(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </label>
        <p className="mt-2 text-xs opacity-70">
          Download community workflows from{' '}
          <a
            href="https://openart.ai/workflows/home"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            OpenArt
          </a>
          , open them in ComfyUI, and export in API format. Install required
          models and nodes on your server first.
        </p>
      </div>
      <FormArea
        label={label}
        value={clapWorkflowDataDraft}
        defaultValue={''}
        onChange={handleOnChangeJson}
        rows={8}
        error={errors['workflow']}
      />
      {errors.workflow && (
        <p role="alert" className="text-sm text-red-400">
          {errors.workflow}
        </p>
      )}
      <ComfyWorkflowPreview json={clapWorkflowDataDraft} />
      {Object.values(errors).filter(Boolean).length == 0 && (
        <div className={className}>
          <FormField
            label={' '}
            className="relative flex flex-col items-start gap-5"
          >
            {renderInputFields(
              workflowDraft.inputFields,
              workflowDraft.inputValues
            )}
          </FormField>
        </div>
      )}
    </>
  )
}
