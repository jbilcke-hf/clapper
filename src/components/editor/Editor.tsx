import { EditorView } from "@aitube/clapper-services"

import { useEditor } from "@/services"

import EditorSideMenu from "../toolbars/editor-menu/EditorSideMenu"

import { ScriptEditor } from "./ScriptEditor"

export function Editor() {
const view = useEditor(s => s.view)

return <ScriptEditor />
/*
this doesn't work yet:
return (
  <div className="flex flex-row flex-grow w-full overflow-hidden">
    <EditorSideMenu />
    <div className="flex flex-row flex-grow w-full overflow-hidden">
      {view === EditorView.SCRIPT 
        ? <ScriptEditor />
        : view === EditorView.PROJECT
        ? <div>TODO</div>
        : <div>TODO</div>}
    </div>
  </div>
  )
  */
}