import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex'
import { FilterTree } from './FilterTree'
import { FilterViewer } from './FilterViewer'

export function FilterEditor() {
  return (
    <ReflexContainer orientation="vertical">
      <ReflexElement minSize={70} size={200}>
        <FilterTree />
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement minSize={70}>
        <FilterViewer />
      </ReflexElement>
    </ReflexContainer>
  )
}
