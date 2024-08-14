import React, { useEffect } from 'react'
import MonacoEditor from 'monaco-editor'
import Editor, { Monaco } from '@monaco-editor/react'
import {
  leftBarTrackScaleWidth,
  TimelineStore,
  useTimeline,
} from '@aitube/timeline'

import { useScriptEditor } from '@/services/editors/script-editor/useScriptEditor'
import { useUI } from '@/services/ui'
import { themes } from '@/services/ui/theme'

import './styles.css'

export function ScriptEditor() {
  const standaloneCodeEditor = useScriptEditor((s) => s.standaloneCodeEditor)
  const setStandaloneCodeEditor = useScriptEditor(
    (s) => s.setStandaloneCodeEditor
  )
  const current = useScriptEditor((s) => s.current)
  const setCurrent = useScriptEditor((s) => s.setCurrent)
  const publish = useScriptEditor((s) => s.publish)
  const onDidScrollChange = useScriptEditor((s) => s.onDidScrollChange)
  const jumpCursorOnLineClick = useScriptEditor((s) => s.jumpCursorOnLineClick)
  const highlightElements = useScriptEditor((s) => s.highlightElements)

  const scrollHeight = useScriptEditor((s) => s.scrollHeight)

  const scrollX = useTimeline((s) => s.scrollX)
  const contentWidth = useTimeline((s) => s.contentWidth)
  const horizontalTimelineRatio = Math.round(
    ((scrollX - leftBarTrackScaleWidth) / contentWidth) * scrollHeight - 31
  )

  useEffect(() => {
    if (!standaloneCodeEditor) {
      return
    }
    // let's do something basic for now: we disable the
    // timeline-to-editor scroll sync when the user is
    // hovering the editor
    if (useScriptEditor.getState().mouseIsInside) {
      return
    }

    if (horizontalTimelineRatio !== standaloneCodeEditor.getScrollTop()) {
      standaloneCodeEditor.setScrollPosition({
        scrollTop: horizontalTimelineRatio,
      })
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
    const { textModel } = useScriptEditor.getState()
    if (!textModel) {
      return
    }

    codeEditor.setModel(textModel)

    setStandaloneCodeEditor(codeEditor)

    codeEditor.onMouseDown((e) => {
      jumpCursorOnLineClick(codeEditor.getPosition()?.lineNumber)
    })

    codeEditor.onDidScrollChange(
      ({
        scrollTop,
        scrollLeft,
        scrollWidth,
        scrollHeight,
      }: MonacoEditor.IScrollEvent) => {
        onDidScrollChange({ scrollTop, scrollLeft, scrollWidth, scrollHeight })
      }
    )

    // as an optimization we can use this later, for surgical edits,
    // to perform real time updates of the timeline

    /*
    textModel.onDidChangeContent(
      (
        modelContentChangedEvent: MonacoEditor.editor.IModelContentChangedEvent
      ) => {
        console.log('onDidChangeContent:')
        for (const change of modelContentChangedEvent.changes) {
          console.log(" - change:", change)
        }
      }
    )
      */
    highlightElements()
  }

  const setMonaco = useScriptEditor((s) => s.setMonaco)
  const setTextModel = useScriptEditor((s) => s.setTextModel)
  const setMouseIsInside = useScriptEditor((s) => s.setMouseIsInside)
  const themeName = useUI((s) => s.themeName)
  const editorFontSize = useUI((s) => s.editorFontSize)

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
          { token: 'scene.int', foreground: '#4EC9B0' },
          { token: 'scene.ext', foreground: '#9CDCFE' },
          { token: 'character', foreground: '#DCDCAA' },
          { token: 'dialog', foreground: '#D4D4D4' },
          { token: 'parenthetical', foreground: '#B5CEA8' },
          { token: 'transition', foreground: '#C586C0' },
          { token: 'shot', foreground: '#CE9178' },
          { token: 'action', foreground: '#D4D4D4' },
        ],
        colors: {
          'editor.background':
            theme.editorBgColor || theme.defaultBgColor || '#000000', // Editor background color (given)
          'editorCursor.foreground':
            theme.editorCursorColor || theme.defaultPrimaryColor || '', // Cursor color
          'editor.lineHighlightBackground': '#44403c', // Highlighted line color
          'editorLineNumber.foreground': '#78716c', // Line Numbers color
          'editor.selectionBackground': '#44403c', // Selection color
          'editor.foreground':
            theme.editorTextColor || theme.defaultTextColor || '', // Main text color
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
      current || '',
      'fountain'
    )
    setTextModel(textModel)

    // Register fountain language
    monaco.languages.register({ id: 'fountain' })
    monaco.languages.setMonarchTokensProvider('fountain', {
      tokenizer: {
        root: [
          [/^(INT|I\/E)(.+)/, 'scene.int'],
          [/^(EXT)(.+)/, 'scene.ext'],
          [/^[A-Z][A-Z\s]+$/, 'character'],
          [/^\(.+\)$/, 'parenthetical'],
          [/^>.+<$/, 'transition'],
          [/^(?:FADE (?:IN|OUT|TO)|CUT TO:)$/, 'transition'],
          [/^(?:ANGLE ON|CLOSE ON|PAN|TRACKING|MOVING):.+$/, 'shot'],
          [/^(?![A-Z]+$|\(|\>).+/, 'action'],
        ],
      },
    })

    // Setup code folding
    monaco.languages.registerFoldingRangeProvider('fountain', {
      provideFoldingRanges: function (model, context, token) {
        const lines = model.getLinesContent()
        const ranges = []
        let sceneStart = -1

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (/^(INT|EXT|I\/E)/.test(line)) {
            if (sceneStart !== -1) {
              ranges.push({
                start: sceneStart + 1,
                end: i,
                kind: monaco.languages.FoldingRangeKind.Region,
              })
            }
            sceneStart = i
          }
        }

        // Add the last scene if there is one
        if (sceneStart !== -1 && sceneStart < lines.length - 1) {
          ranges.push({
            start: sceneStart + 1,
            end: lines.length,
            kind: monaco.languages.FoldingRangeKind.Region,
          })
        }

        return ranges
      },
    })
  }

  return (
    <div
      className="h-full w-full"
      onMouseEnter={() => setMouseIsInside(true)}
      onMouseLeave={() => setMouseIsInside(false)}
      onBlur={publish}
    >
      <Editor
        height="100%"
        beforeMount={beforeMount}
        theme={themeName}
        onMount={onMount}
        onChange={setCurrent}
        options={{
          fontSize: editorFontSize,
          language: 'fountain',
          folding: true,
          foldingStrategy: 'auto',
        }}
      />
    </div>
  )
}
