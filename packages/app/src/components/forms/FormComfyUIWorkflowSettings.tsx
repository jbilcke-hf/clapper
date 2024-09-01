import { FormField } from './FormField'
import { FormInput } from './FormInput'
import { GrDocumentConfig } from 'react-icons/gr'
import debounce from 'lodash/debounce'
import { FormSelect } from './FormSelect'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { MdInfo, MdWarning } from 'react-icons/md'
import { ClapInputField, ClapWorkflow } from '@aitube/clap'
import { FormArea } from './FormArea'
import { useCallback, useState } from 'react'
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

  const [errors, setErrors] = useState<{ workflow: string | null }>({
    workflow: null,
  })

  const debouncedOnChangeClapWorkflow = useCallback(
    debounce((clapWorkflow: ClapWorkflow) => {
      onChange(clapWorkflow)
    }, 300),
    [onChange]
  )

  const handleOnChangeJson = (json: string) => {
    setClapWorkflowDataDraft(json || '')
    if (ComfyUIWorkflowApiGraph.isValidWorkflow(json)) {
      setErrors({ ...errors, workflow: null })
      debouncedOnChangeClapWorkflow(
        structuredClone(
          convertComfyUiWorkflowApiToClapWorkflow(json, clapWorkflow.category)
        )
      )
    } else {
      setErrors({ ...errors, workflow: 'Please, provide a valid workflow.' })
    }
  }

  const handleOnChangeInputValue = (inputId, inputValue) => {
    clapWorkflow.inputValues[inputId] = inputValue
    const workflowGraph = ComfyUIWorkflowApiGraph.fromString(clapWorkflow.data)
    // Apply same change to the graph
    // TODO: add a setter to clapWorkflow to update its data when updating inputFields
    workflowGraph.setInputValue(inputId, inputValue, { ignoreErrors: true })
    // Update the generate 'data' based on new input values
    clapWorkflow.data = workflowGraph.toString()
    setClapWorkflowDataDraft(clapWorkflow.data || '')
    if (ComfyUIWorkflowApiGraph.isValidWorkflow(clapWorkflow.data)) {
      setErrors({ ...errors, workflow: null })
      // If changes on JSON, convert it to ClapWorkflow
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
            <div className="w-full">
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
