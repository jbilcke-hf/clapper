import { useEffect } from 'react'

import { FormInput } from '@/components/forms/FormInput'
import { FormSection } from '@/components/forms/FormSection'
import { useWorkflowEditor } from '@/services/editors'

export function WorkflowEditor() {
  const current = useWorkflowEditor((s) => s.current)
  const setCurrent = useWorkflowEditor((s) => s.setCurrent)
  const history = useWorkflowEditor((s) => s.history)
  const undo = useWorkflowEditor((s) => s.undo)
  const redo = useWorkflowEditor((s) => s.redo)

  if (!current) {
    return (
      <FormSection label={'Workflow Editor'} className="p-4">
        Workflows are not implemented yet.
      </FormSection>
    )
  }

  return (
    <FormSection label={'Workflow Editor'} className="p-4">
      <div>Should be a form to edit the parameters.</div>
      <div>
        We can also display a link or an iframe with the actual workflow graph.
      </div>
    </FormSection>
  )
}
