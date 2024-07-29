import { FormSection } from '@/components/forms/FormSection'
import { useWorkflowEditor } from '@/services/editors'
import { useUI } from '@/services'
import { ReactFlowCanvas } from './ReactFlowCanvas'
import { cn } from '@/lib/utils'

export function WorkflowViewer({
  className = '',
}: {
  className?: string
} = {}) {
  const current = useWorkflowEditor((s) => s.current)
  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

  const content = hasBetaAccess ? (
    <ReactFlowCanvas />
  ) : !current ? (
    <FormSection label={'Workflow Editor'} className="p-4">
      Workflows are WIP and not available yet.
    </FormSection>
  ) : (
    <FormSection label={'Workflow Editor'} className="p-4">
      <div>Should be a form to edit the parameters.</div>
      <div>
        We can also display a link or an iframe with the actual workflow graph.
      </div>
    </FormSection>
  )

  return <div className={cn('h-full w-full', className)}>{content}</div>
}
