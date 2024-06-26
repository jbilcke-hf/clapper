import React, { useEffect, useState } from "react"
import MonacoEditor from "monaco-editor"
import Editor, { Monaco } from "@monaco-editor/react"
import { DEFAULT_DURATION_IN_MS_PER_STEP, leftBarTrackScaleWidth, TimelineStore, useTimeline } from "@aitube/timeline"

import { useEditor } from "@/services/editor/useEditor"
import { useRenderer } from "@/services/renderer"
import { useUI } from "@/services/ui"
import { useTheme } from "@/services/ui/useTheme"
import { themes } from "@/services/ui/theme"

import "./styles.css"
import { ClapSegmentCategory } from "@aitube/clap"

export function ScriptEditor() {

  const standaloneCodeEditor = useEditor(s => s.standaloneCodeEditor)
  const setStandaloneCodeEditor = useEditor(s => s.setStandaloneCodeEditor)
  const draft = useEditor(s => s.draft)
  const setDraft = useEditor(s => s.setDraft)
  const loadDraftFromClap = useEditor(s => s.loadDraftFromClap)
  const onDidScrollChange = useEditor(s => s.onDidScrollChange)
  const jumpCursorOnLineClick = useEditor(s => s.jumpCursorOnLineClick)
  
  // this is an expensive function, we should only call it on blur or on click on a "save button maybe"
  const publishDraftToTimeline = useEditor(s => s.publishDraftToTimeline)

  const clap = useTimeline((s: TimelineStore) => s.clap)

  useEffect(() => { loadDraftFromClap(clap) }, [clap])

  const scrollHeight = useEditor(s => s.scrollHeight)

  const scrollX = useTimeline(s => s.scrollX)
  const contentWidth = useTimeline(s => s.contentWidth)
  const horizontalTimelineRatio = Math.round(
    (((scrollX - leftBarTrackScaleWidth) / contentWidth) * scrollHeight)
    - 31
  )

  useEffect(() => {
    if (!standaloneCodeEditor) { return }
    // let's do something basic for now: we disable the
    // timeline-to-editor scroll sync when the user is
    // hovering the editor
    if (useEditor.getState().mouseIsInside) { return }

     if (horizontalTimelineRatio !== standaloneCodeEditor.getScrollTop()) {
      standaloneCodeEditor.setScrollPosition({ scrollTop: horizontalTimelineRatio })
    }
    // various things we can do here!
    // move the scroll:
    // editor.setScrollPosition({ scrollTop: horizontalTimelineRatio })
    
    // Scroll to a specific line:
    // editor.revealLine(15);

    // Scroll to a specific line so it ends in the center of the editor:
    // editor.revealLineInCenter(15);

    // Move current active line:
    // editor.setPosition({column: 1, lineNumber: 3});

    // => I think we should restore the "follow cursor during playback"
    // feature, because this is doable.

  }, [standaloneCodeEditor, horizontalTimelineRatio])

  const onMount = (codeEditor: MonacoEditor.editor.IStandaloneCodeEditor) => {
    const { textModel } = useEditor.getState()
    if (!textModel) { return }

    codeEditor.setModel(textModel)
    
    setStandaloneCodeEditor(codeEditor)

    codeEditor.onMouseDown((e) => {
      jumpCursorOnLineClick(codeEditor.getPosition()?.lineNumber)
    })

    codeEditor.onDidScrollChange(({ scrollTop, scrollLeft, scrollWidth, scrollHeight }: MonacoEditor.IScrollEvent) => {
      onDidScrollChange({ scrollTop, scrollLeft, scrollWidth, scrollHeight })
    })

    // as an optimization we can use this later, for surgical edits,
    // to perform real time updates of the timeline

    textModel.onDidChangeContent((modelContentChangedEvent: MonacoEditor.editor.IModelContentChangedEvent) => {
      console.log("onDidChangeContent:")
      for (const change of modelContentChangedEvent.changes) {
        // console.log(" - change:", change)
      }
    })
  }

  const onChange = (plainText?: string) => {
   // setDraft(plainText || "")
  }

  const setMonaco = useEditor(s => s.setMonaco)
  const setTextModel = useEditor(s => s.setTextModel)
  const setMouseIsInside = useEditor(s => s.setMouseIsInside)
  const themeName = useUI(s => s.themeName)
  const editorFontSize = useUI(s => s.editorFontSize)

  const beforeMount = (monaco: Monaco) => {
    setMonaco(monaco)

    // create our themes
    for (const theme of Object.values(themes)) {
      // console.log("loading editor theme:", theme)
      // Define a custom theme with the provided color palette
      monaco.editor.defineTheme(theme.id, {
       base: 'vs-dark', // Base theme (you can change to vs for a lighter theme if preferred)
       inherit: true, // Inherit the default rules
       rules: [
         // You can define token-specific styles here if needed
       ],
       colors: {
         'editor.background': theme.editorBgColor || theme.defaultBgColor || '#000000', // Editor background color (given)
         'editorCursor.foreground': theme.editorCursorColor || theme.defaultPrimaryColor || "", // Cursor color
         'editor.lineHighlightBackground': '#44403c', // Highlighted line color
         'editorLineNumber.foreground': '#78716c', // Line Numbers color
         'editor.selectionBackground': '#44403c', // Selection color
         'editor.foreground': theme.editorTextColor || theme.defaultTextColor || "", // Main text color
         'editorIndentGuide.background': '#78716c', // Indent guides color
         'editorIndentGuide.activeBackground': '#a8a29e', // Active indent guides color
         'editorWhitespace.foreground': '#a8a29e', // Whitespace symbols color
         // Add more color overrides if needed here
       },
     })
    }
  
    // Apply the custom theme immediately after defining it
    monaco.editor.setTheme(themes.backstage.id)  

    const textModel: MonacoEditor.editor.ITextModel = monaco.editor.createModel(
      draft,
      "plaintext"
    )
    setTextModel(textModel)
  }

  return (
    <div
      className="h-full"
      onMouseEnter={() => setMouseIsInside(true)}
      onMouseLeave={() => setMouseIsInside(false)}
    >
      <Editor
        height="100%"
        beforeMount={beforeMount}
        theme={themeName}
        onMount={onMount}
        onChange={onChange}
        options={{
          fontSize: editorFontSize
        }}
      />
    </div>
  )
}
