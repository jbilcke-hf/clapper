import { FormSection } from '@/components/forms'
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
    <FormSection label={'Filter Editor'} className="p-4">
      <p>Put filter parameters</p>
    </FormSection>
  )
}
