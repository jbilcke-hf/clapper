import React, { useEffect, useState } from "react"
import MonacoEditor from "monaco-editor"
import Editor from "@monaco-editor/react"
import { DEFAULT_DURATION_IN_MS_PER_STEP, TimelineStore, useTimeline } from "@aitube/timeline"

import { useEditor } from "@/controllers/editor/useEditor"
import { useRenderer } from "@/controllers/renderer"

const beforeMount = ({ editor }: { editor: typeof MonacoEditor.editor }) => {
  // Define a custom theme with the provided color palette
  editor.defineTheme('customTheme', {
   base: 'vs-dark', // Base theme (you can change to vs for a lighter theme if preferred)
   inherit: true, // Inherit the default rules
   rules: [
     // You can define token-specific styles here if needed
   ],
   colors: {
     'editor.background': '#292524', // Editor background color (given)
     'editorCursor.foreground': '#f5f5f4', // Cursor color
     'editor.lineHighlightBackground': '#44403c', // Highlighted line color
     'editorLineNumber.foreground': '#78716c', // Line Numbers color
     'editor.selectionBackground': '#44403c', // Selection color
     'editor.foreground': '#d6d3d1', // Main text color
     'editorIndentGuide.background': '#78716c', // Indent guides color
     'editorIndentGuide.activeBackground': '#a8a29e', // Active indent guides color
     'editorWhitespace.foreground': '#a8a29e', // Whitespace symbols color
     // Add more color overrides if needed here
   },
 })

 // Apply the custom theme immediately after defining it
 editor.setTheme('customTheme')
}

export function ScriptEditor() {
  const editor = useEditor(s => s.editor)
  const setEditor = useEditor(s => s.setEditor)
  const draft = useEditor(s => s.draft)
  const setDraft = useEditor(s => s.setDraft)
  const loadDraftFromClap = useEditor(s => s.loadDraftFromClap)
  const onDidScrollChange = useEditor(s => s.onDidScrollChange)
  const jumpCursorOnLineClick = useEditor(s => s.jumpCursorOnLineClick)
  
  // this is an expensive function, we should only call it on blur or on click on a "save button maybe"
  const publishDraftToTimeline = useEditor(s => s.publishDraftToTimeline)

  const clap = useTimeline((s: TimelineStore) => s.clap)
  const cursorTimestampAtInMs = useTimeline(s => s.cursorTimestampAtInMs)
  const totalDurationInMs = useTimeline(s => s.totalDurationInMs)
  const scrollX = useTimeline(s => s.scrollX)
  const contentWidth = useTimeline(s => s.contentWidth)
  
  useEffect(() => { loadDraftFromClap(clap) }, [clap])

  const scrollTop = useEditor(s => s.scrollTop)
  const scrollLeft = useEditor(s => s.scrollLeft)
  const scrollWidth = useEditor(s => s.scrollWidth)
  const scrollHeight = useEditor(s => s.scrollHeight)

  /*
  const script = useTimeline(state => state.script)

  const isPlaying = useApp(state => state.isPlaying)
  const setCursorAt = useApp((state) => state.setCursorAt)
  const [scriptContent, setScriptContent] = useState("")
  */

  const currentSegment = useRenderer(s => s.currentSegment)
  
  const activeStartTimeInLines = currentSegment?.startTimeInLines

  useEffect(() => {
    console.log("activeStartTimeInLines:", activeStartTimeInLines)

  }, [activeStartTimeInLines])

  useEffect(() => {
    console.log("scrollX:", scrollX)

  }, [scrollX])

  /*
  const activeSceneLineNumber = (activeScene?.startAtLine || 0)
  */

/*
  const stepsToPreviews = useApp(state => state.stepsToPreviews)

  const screenplayScroll = useInterface(state => state.screenplayScroll)
  const setScreenplayScroll = useInterface(state => state.setScreenplayScroll)

  const timelineScroll = useInterface(state => state.timelineScroll)

  const leftmostVisibleScene = stepsToPreviews[timelineScroll.scrollLeftInSteps]?.scene

  // console.log("linesToPreview:", linesToPreviews)

  */
 /*
  useEffect(() => {
    if (editor && leftmostVisibleScene) {
      // console.log("ScriptEditor: timelineScrollLeftInStep changed to scene " + leftmostVisibleScene.line)

      // in Monaco editor the line index doesn't start at 0 but 1
      // however, it appears that we are already good, and the 1 is just here as a backup
      const lineNumber = (leftmostVisibleScene.startAtLine) || 1
      editor.revealLineInCenter(lineNumber)
    }
  }, [editor, leftmostVisibleScene])
  */


  /*
  useEffect(() => {
    if (editor && activeSceneLineNumber) {
      // console.log("useEffect:", activeSceneLineNumber)

      // in Monaco editor the line index doesn't start at 0 but 1
      // however, it appears that we are already good, and the 1 is just here as a backup
      const lineNumber = activeSceneLineNumber || 1
      const column = 1

      // editor.revealRangeInCenter

      // IMPORTANT: we only alter the position if we are currently NOT focused
      // that way we don't annoy the user while they are clicking/typing
      if (!editor.hasTextFocus()) {

        // scroll to a specific line
        // this will be used whenever the horizontal timeline scrolls to somewhere
        // (to avoid infinite loops, we should do this only if the timeline scroll event
        // is originating from the timeline and not the screenplay reader)
        editor.revealLineInCenter(lineNumber)

        // console.log(`editor.setPosition({ lineNumber: ${lineNumber}, column: ${column} })`)
        editor.setPosition({ lineNumber, column })
      }
    }
  }, [editor, activeSceneLineNumber])
  */
  const onMount = (editor: MonacoEditor.editor.IStandaloneCodeEditor) => {
    const model = editor.getModel()
    if (!model) { return }

    setEditor(editor)

    editor.onMouseDown((e) => {
      jumpCursorOnLineClick(editor.getPosition()?.lineNumber)
    })

    editor.onDidScrollChange(({ scrollTop, scrollLeft, scrollWidth, scrollHeight }: MonacoEditor.IScrollEvent) => {
      onDidScrollChange(
        { scrollTop, scrollLeft, scrollWidth, scrollHeight },
        true // <- set to true to ignore the change and avoid an infinite loop
      )
    })

    // as an optimization we can use this later, for surgical edits,
    // to perform real time updates of the timeline

    model.onDidChangeContent((modelContentChangedEvent: MonacoEditor.editor.IModelContentChangedEvent) => {
      // console.log("onDidChangeContent:")
      for (const change of modelContentChangedEvent.changes) {
        // console.log(" - change:", change)
      }
    })
  }

  const onChange = (plainText?: string) => {
   // setDraft(plainText || "")
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        defaultValue={draft}
        beforeMount={beforeMount}
        onMount={onMount}
        onChange={onChange}
        theme="customTheme"
        options={{
          fontSize: 12
        }}
      />
    </div>
  )
}
