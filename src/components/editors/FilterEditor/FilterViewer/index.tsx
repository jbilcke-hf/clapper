import {
  FormField,
  FormInput,
  FormSection,
  FormSwitch,
} from '@/components/forms'
import { useFilterEditor, useUI } from '@/services'

export function FilterViewer() {
  const current = useFilterEditor((s) => s.current)
  const setCurrent = useFilterEditor((s) => s.setCurrent)
  const undo = useFilterEditor((s) => s.undo)
  const redo = useFilterEditor((s) => s.redo)

  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

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
    <>
      {current.map(({ filter, parameters }) => (
        <FormSection key={filter.id} label={filter.label} className="p-4">
          {filter.parameters.map((filter) => (
            <FormField key={filter.id}>
              {filter.type === 'string' && (
                <FormInput
                  type="text"
                  label={filter.label}
                  value={parameters[filter.id]}
                  defaultValue={filter.defaultValue}
                />
              )}
              {filter.type === 'number' && (
                <FormInput
                  type="number"
                  label={filter.label}
                  value={parameters[filter.id]}
                  defaultValue={filter.defaultValue}
                />
              )}
              {filter.type === 'boolean' && (
                <FormSwitch
                  label={filter.label}
                  checked={!!parameters[filter.id]}
                  onCheckedChange={() => {
                    // TODO
                  }}
                />
              )}
            </FormField>
          ))}
        </FormSection>
      ))}
    </>
  )
}
