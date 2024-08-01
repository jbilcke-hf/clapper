import {
  FormField,
  FormInput,
  FormSection,
  FormSelect,
  FormSwitch,
} from '@/components/forms'
import { FormSlider } from '@/components/forms/FormSlider'
import { useFilterEditor, useRenderer, useUI } from '@/services'
import { getValidNumber } from '@aitube/clap'
import { FilterWithParams } from '@aitube/clapper-services'
import { useEffect, useState } from 'react'

// TODO: move this to the renderer service
// also since filters use WebGPU, I think one day we can run them in real-time
// over the video as well (or maybe using WebGL)
function useCurrentlyVisibleStoryboard(): string | undefined {
  const { activeStoryboardSegment } = useRenderer((s) => s.bufferedSegments)

  // can't return something if there is nothing
  if (!activeStoryboardSegment?.assetUrl.startsWith('data:image/')) {
    return undefined
  }

  return activeStoryboardSegment.assetUrl
}

function useFilteredStoryboard(input?: string): string | undefined {
  const current = useFilterEditor((s) => s.current)
  const runFilterPipeline = useFilterEditor((s) => s.runFilterPipeline)
  const [result, setResult] = useState('')

  const currentFiltersWithParams: FilterWithParams[] = current || []

  console.log('current changed?', current)

  useEffect(() => {
    const fn = async (input?: string) => {
      if (!input) {
        return undefined
      }
      try {
        console.log('running filter using WebGPU..')
        const res = await runFilterPipeline(input)
        setResult(res)
      } catch (err) {
        console.error(err)
      }
    }
    fn(input)
  }, [
    input,
    // whenever the pipeline, filter, input values.. change,
    // we re-generate the output as well
    currentFiltersWithParams,
    JSON.stringify(currentFiltersWithParams),
  ])

  return result ? result : undefined
}

export function FilterViewer() {
  const current = useFilterEditor((s) => s.current)
  const setCurrent = useFilterEditor((s) => s.setCurrent)
  const undo = useFilterEditor((s) => s.undo)
  const redo = useFilterEditor((s) => s.redo)

  const input = useCurrentlyVisibleStoryboard()
  const output = useFilteredStoryboard(input)

  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

  const setFilterParamValue = (
    filterId: string,
    fieldId: string,
    value: string | number | boolean
  ) => {
    console.log(`setFilterParamValue(${filterId}, ${fieldId}, ${value})`)
    setCurrent(
      (current || []).map((fwp) => {
        if (fwp.filter.id === filterId) {
          console.log('match!', fwp)
          return {
            ...fwp,
            parameters: {
              ...fwp.parameters,
              [fieldId]: value,
            },
          }
        } else {
          console.log('no match..', fwp)
          console.log('filterId:', filterId)
          console.log('fieldId:', fieldId)
        }
        return fwp
      })
    )
  }

  if (!hasBetaAccess) {
    return (
      <FormSection label={'Filter Editor'} className="p-4">
        Storyboard filters are WIP and not available yet.
      </FormSection>
    )
  }

  if (!current) {
    return (
      <FormSection label={'Filter Editor'} className="p-4">
        No filter selected.
      </FormSection>
    )
  }

  return (
    <div className="flex flex-row space-x-2">
      <div className="flex w-1/3 flex-col">
        {current.map(({ filter, parameters }) => (
          <FormSection key={filter.id} label={filter.label} className="p-4">
            {filter.parameters.map((field) => (
              <FormField key={field.id}>
                {field.type === 'string' && (
                  <FormSelect
                    label={field.label}
                    className=""
                    selectedItemId={parameters[field.id] as string}
                    selectedItemLabel={parameters[field.id] as string}
                    defaultItemId={field.defaultValue}
                    defaultItemLabel={field.defaultValue}
                    items={field.allowedValues.map((value) => ({
                      id: value,
                      label: value,
                      value,
                    }))}
                    onSelect={(value) => {
                      setFilterParamValue(filter.id, field.id, value || '')
                    }}
                  />
                )}
                {field.type === 'number' && (
                  <FormSlider
                    className="w-full"
                    label={field.label}
                    value={getValidNumber(
                      parameters[field.id],
                      field.minValue,
                      field.maxValue,
                      field.defaultValue
                    )}
                    defaultValue={field.defaultValue}
                    minValue={field.minValue}
                    maxValue={field.maxValue}
                    onChange={(newValue) => {
                      const value = getValidNumber(
                        newValue,
                        field.minValue,
                        field.maxValue,
                        field.defaultValue
                      )
                      setFilterParamValue(filter.id, field.id, value || '')
                    }}
                  />
                )}
                {field.type === 'boolean' && (
                  <FormSwitch
                    label={field.label}
                    checked={!!parameters[field.id]}
                    onCheckedChange={(checked) => {
                      setFilterParamValue(filter.id, field.id, checked || false)
                    }}
                  />
                )}
              </FormField>
            ))}
          </FormSection>
        ))}
      </div>
      <div className="flex w-2/3 flex-col">
        {output ? <img src={output}></img> : null}
      </div>
    </div>
  )
}
