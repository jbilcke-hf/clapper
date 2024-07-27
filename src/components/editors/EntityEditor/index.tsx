import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex'
import { EntityTree } from './EntityTree'
import { EntityViewer } from './EntityViewer'

export function EntityEditor() {
  return (
    <ReflexContainer orientation="vertical">
      <ReflexElement minSize={70} size={200}>
        <EntityTree />
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement minSize={70}>
        <EntityViewer />
      </ReflexElement>
    </ReflexContainer>
  )
}
