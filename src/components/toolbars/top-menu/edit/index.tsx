'use client'

import { EditorView, SettingsCategory } from '@aitube/clapper-services'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  useEditors,
  useEntityEditor,
  useProjectEditor,
  useScriptEditor,
  useSegmentEditor,
  useUI,
} from '@/services'

export function TopMenuEdit() {
  const setShowSettings = useUI((s) => s.setShowSettings)
  const view = useEditors((s) => s.view)

  const undoScriptEditorChange = useScriptEditor((s) => s.undo)
  const redoScriptEditorChange = useScriptEditor((s) => s.redo)
  const undoEntityEditorChange = useEntityEditor((s) => s.undo)
  const redoEntityEditorChange = useEntityEditor((s) => s.redo)
  const undoSegmentEditorChange = useSegmentEditor((s) => s.undo)
  const redoSegmentEditorChange = useSegmentEditor((s) => s.redo)
  const undoProjectEditorChange = useProjectEditor((s) => s.undo)
  const redoProjectEditorChange = useProjectEditor((s) => s.redo)

  const { undo, redo } =
    view === EditorView.ENTITY
      ? { undo: undoEntityEditorChange, redo: redoEntityEditorChange }
      : view === EditorView.PROJECT
        ? { undo: undoProjectEditorChange, redo: redoProjectEditorChange }
        : view === EditorView.SEGMENT
          ? { undo: undoSegmentEditorChange, redo: redoSegmentEditorChange }
          : view === EditorView.SCRIPT
            ? { undo: undoScriptEditorChange, redo: redoScriptEditorChange }
            : { undo: () => {}, redo: () => {} }

  // TODO @jbilcke-hf: finish the undo/redo feature
  // this will work
  useHotkeys('ctrl+z', undo, { preventDefault: true }, [])
  useHotkeys('meta+z', undo, { preventDefault: true }, [])
  useHotkeys('shift+ctrl+z', redo, { preventDefault: true }, [])
  useHotkeys('shift+meta+z', redo, { preventDefault: true }, [])

  /*
   * Some feature ideas:
   *
   * Format text, convert to a different text format,
   * generate..
   */
  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem
          onClick={() => {
            setShowSettings(SettingsCategory.EDITORS)
          }}
        >
          Show advanced settings
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={undo}>
          Undo (TODO @Julian) <MenubarShortcut>⌘Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={redo}>
          Redo (TODO @Julian) <MenubarShortcut>⇧⌘Z</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
