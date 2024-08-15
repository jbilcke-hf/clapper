import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex'
import { WorkflowTree } from './WorkflowTree'
import { WorkflowViewer } from './WorkflowViewer'

export function WorkflowEditor() {
  return (
    <ReflexContainer orientation="vertical">
      <ReflexElement minSize={70} size={200}>
        <WorkflowTree />
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement minSize={70}>
        <WorkflowViewer />
      </ReflexElement>
    </ReflexContainer>
  )
}
