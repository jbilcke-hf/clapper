import { FormField } from './FormField'
import { FormInput } from './FormInput'
import { GrDocumentConfig } from 'react-icons/gr'
import debounce from 'lodash/debounce'
import { FormSelect } from './FormSelect'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { MdWarning } from 'react-icons/md'
import { ClapInputField, ClapWorkflow } from '@aitube/clap'
import { FormArea } from './FormArea'
import { useCallback, useState } from 'react'
import {
  ComfyUIWorkflowApiGraph,
  convertComfyUiWorkflowApiToClapWorkflow,
} from '@/app/api/resolve/providers/comfyui/utils'

export function FormComfyUIWorkflowSettings({
  clapWorkflow,
  defaultClapWorkflow,
  onChange,
  className,
}: {
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
        structuredClone(convertComfyUiWorkflowApiToClapWorkflow(json))
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
            <FormSelect
              key={inputField.id}
              label={inputField.label}
              items={inputField.metadata?.options}
              selectedItemId={inputValues[inputField.id].id}
              selectedItemLabel={
                !inputValues[inputField.id]
                  ? 'Not found'
                  : inputValues[inputField.id].label
              }
              onSelect={(value) =>
                handleOnChangeInputValue(inputField.id, value)
              }
            />
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
              {inputField.metadata?.mainInput && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="absolute right-0 top-0 m-2 h-4 w-4">
                      <MdWarning color="yellow" className="h-full w-full" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-xs font-bold text-yellow-500">
                      This value will be overwritten by Clapper because it is
                      used as &quot;{inputField.metadata?.mainInput} &quot;.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )
        }
      }
    })
  }

  return (
    <>
      <FormArea
        label="Custom ComfyUI workflow for images"
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
