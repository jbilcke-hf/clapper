import { EditorView } from '@aitube/clapper-services'

import { useEditors } from '@/services'

import { EditorsSideMenu } from '../toolbars/editors-menu/EditorsSideMenu'

import { ScriptEditor } from './ScriptEditor'
import { useTheme } from '@/services/ui/useTheme'
import { EntityEditor } from './EntityEditor'
import { ProjectEditor } from './ProjectEditor'
import { SegmentEditor } from './SegmentEditor'

export function Editors() {
  const theme = useTheme()
  const view = useEditors((s) => s.view)

  return (
    <div className="flex h-full w-full flex-row overflow-hidden">
      <EditorsSideMenu />
      <div
        className="flex h-full w-full flex-row overflow-hidden"
        style={{
          background: theme.editorBgColor || theme.defaultBgColor || '#000000',
        }}
      >
        {view === EditorView.SCRIPT ? (
          <ScriptEditor />
        ) : view === EditorView.PROJECT ? (
          <ProjectEditor />
        ) : view === EditorView.ENTITY ? (
          <EntityEditor />
        ) : view === EditorView.SEGMENT ? (
          <SegmentEditor />
        ) : (
          <div>TODO</div>
        )}
      </div>
    </div>
  )
}
