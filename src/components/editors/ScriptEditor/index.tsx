"use client"
import { TimelineStore, useTimeline } from "@aitube/timeline"
import Editor, { Monaco, OnMount } from "@monaco-editor/react"
import * as MonacoEditor from "monaco-editor"
import { useEffect, useRef } from "react"

import { useScriptEditor } from "@/services/editors/script-editor/useScriptEditor"
import { useUI } from "@/services/ui"
import { themes } from "@/services/ui/theme"

import "./styles.css"

export const fountainLanguageId = 'fountain';

export function ScriptEditor() {
  const standaloneCodeEditor = useScriptEditor(s => s.standaloneCodeEditor)
  const setStandaloneCodeEditor = useScriptEditor(s => s.setStandaloneCodeEditor)
  const draft = useScriptEditor(s => s.draft)
  const setDraft = useScriptEditor(s => s.setDraft)
  const loadDraftFromClap = useScriptEditor(s => s.loadDraftFromClap)
  const onDidScrollChange = useScriptEditor(s => s.onDidScrollChange)
  const jumpCursorOnLineClick = useScriptEditor(s => s.jumpCursorOnLineClick)

  const clap = useTimeline((s: TimelineStore) => s.clap)

  const editorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  useEffect(() => {
    if (clap && clap.meta.screenplay) {
      loadDraftFromClap(clap)
    }
  }, [clap, loadDraftFromClap])

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setStandaloneCodeEditor(editor)

    editor.onMouseDown((e) => {
      const position = editor.getPosition();
      if (position) {
        jumpCursorOnLineClick(position.lineNumber)
      }
    })

    editor.onDidScrollChange(({ scrollTop, scrollLeft, scrollWidth, scrollHeight }) => {
      onDidScrollChange({ scrollTop, scrollLeft, scrollWidth, scrollHeight })
    })

    editor.onDidChangeModelContent(() => {
      const updatedDraft = editor.getValue()
      setDraft(updatedDraft)
    })

    // Apply the theme and update the editor
    monaco.editor.setTheme(themeName);
    editor.updateOptions({
      fontSize: editorFontSize,
      folding: true,
      foldingStrategy: 'auto',
      foldingHighlight: true,
      showFoldingControls: 'always',
    });

    applyCollapsibleRanges(editor, monaco);
    editor.onDidChangeModelContent(() => {
      applyCollapsibleRanges(editor, monaco);
    })

    // Force a re-render of the editor and trigger syntax highlighting
    setTimeout(() => {
      editor.layout();
      editor.render(true);

      // Force re-tokenization to apply syntax highlighting
      const model = editor.getModel();
      if (model) {
        const fullRange = model.getFullModelRange();
        model.tokenization.forceTokenization(fullRange.endLineNumber);
      }
    }, 50);
  }

  const applyCollapsibleRanges = (editor: MonacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    const model = editor.getModel();
    if (!model) return;

    const text = model.getValue();
    const lines = text.split('\n');
    const foldingRanges: MonacoEditor.languages.FoldingRange[] = [];

    let sceneStart = -1;
    let characterStart = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Scene heading
      if (line.match(/^(INT|EXT|EST|INT\.\/EXT\.)/i)) {
        if (sceneStart !== -1) {
          foldingRanges.push({
            start: sceneStart + 1,
            end: i,
            kind: monaco.languages.FoldingRangeKind.Region
          });
        }
        sceneStart = i;
      }
      // Character name
      else if (line.match(/^[A-Z][A-Z0-9\s]*(\(.*\))?$/)) {
        if (characterStart !== -1) {
          foldingRanges.push({
            start: characterStart + 1,
            end: i,
            kind: monaco.languages.FoldingRangeKind.Region
          });
        }
        characterStart = i;
      }
      // End of dialogue block or scene description
      else if (line === '') {
        if (characterStart !== -1) {
          foldingRanges.push({
            start: characterStart + 1,
            end: i,
            kind: monaco.languages.FoldingRangeKind.Region
          });
          characterStart = -1;
        }
      }
    }

    // Handle case where script ends with an unclosed scene or dialogue block
    if (sceneStart !== -1) {
      foldingRanges.push({
        start: sceneStart + 1,
        end: lines.length,
        kind: monaco.languages.FoldingRangeKind.Region
      });
    }
    if (characterStart !== -1) {
      foldingRanges.push({
        start: characterStart + 1,
        end: lines.length,
        kind: monaco.languages.FoldingRangeKind.Region
      });
    }

    monaco.languages.registerFoldingRangeProvider(fountainLanguageId, {
      provideFoldingRanges: () => foldingRanges
    });
  }

  const setMonaco = useScriptEditor(s => s.setMonaco)
  const setTextModel = useScriptEditor(s => s.setTextModel)
  const setMouseIsInside = useScriptEditor(s => s.setMouseIsInside)
  const themeName = useUI(s => s.themeName)
  const editorFontSize = useUI(s => s.editorFontSize)

  const beforeMount = async (monaco: Monaco) => {
    setMonaco(monaco)

    function registerFountainLanguage(monaco: Monaco) {
      const fountainTokenProvider: MonacoEditor.languages.IMonarchLanguage = {
        defaultToken: '',
        tokenPostfix: '.fountain',

        tokenizer: {
          root: [
            [/^#.*$/, 'comment'],
            [/^(INT|EXT|EST|INT\.\/EXT\.)\s*.*$/, 'sceneHeading'],
            [/^[A-Z][A-Z0-9\s]*(\(.*\))?$/, 'character'],
            [/^\(.*\)$/, 'parenthetical'],
            [/^>.*$/, 'transition'],
            [/^\[\[.*\]\]$/, 'note'],
            [/^===.*$/, 'pageBreak'],
            [/^=.*$/, 'synopsisSeparator'],
            [/^\..*$/, 'sceneNumber'],
            [/^\*.*$/, 'emphasis'],
            [/^_.*_$/, 'underline'],
            [/^\s*$/, 'emptyLine'],
            [/^[^A-Z\n]+$/, 'dialogue'],
            [/^.*$/, 'action']
          ]
        }
      };
      monaco.languages.register({ id: fountainLanguageId });
      monaco.languages.setMonarchTokensProvider(fountainLanguageId, fountainTokenProvider);
    }

    registerFountainLanguage(monaco)

    for (const theme of Object.values(themes)) {
      monaco.editor.defineTheme(theme.id, {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: theme.editorTextColor || theme.defaultTextColor || "" },
          { token: 'comment', foreground: '#6A9955' },
          { token: 'sceneHeading', foreground: '#4EC9B0', fontWeight: 'bold' },
          { token: 'character', foreground: '#DCDCAA', fontWeight: 'bold' },
          { token: 'parenthetical', foreground: '#9CDCFE' },
          { token: 'dialogue', foreground: '#D4D4D4' },
          { token: 'transition', foreground: '#CE9178', fontStyle: 'italic' },
          { token: 'note', foreground: '#6796E6' },
          { token: 'pageBreak', foreground: '#D16969' },
          { token: 'synopsisSeparator', foreground: '#608B4E' },
          { token: 'sceneNumber', foreground: '#B5CEA8' },
          { token: 'emphasis', foreground: '#D4D4D4', fontStyle: 'italic' },
          { token: 'underline', foreground: '#D4D4D4', fontStyle: 'underline' },
          { token: 'action', foreground: '#D4D4D4' },
        ],
        colors: {
          'editor.background': theme.editorBgColor || theme.defaultBgColor || '#000000',
          'editorCursor.foreground': theme.editorCursorColor || theme.defaultPrimaryColor || "",
          'editor.lineHighlightBackground': '#44403c',
          'editorLineNumber.foreground': '#78716c',
          'editor.selectionBackground': '#44403c',
          'editorIndentGuide.background': '#78716c',
          'editorIndentGuide.activeBackground': '#a8a29e',
          'editorWhitespace.foreground': '#a8a29e',
        },
      })
    }

    monaco.editor.setTheme(themes.backstage.id)

    const textModel: MonacoEditor.editor.ITextModel = monaco.editor.createModel(
      draft,
      fountainLanguageId
    )
    setTextModel(textModel)
  }

  const handleCollapseAll = () => {
    if (!editorRef.current) return;
    editorRef.current.trigger('fold', 'editor.foldAll', null);
  }

  const handleExpandAll = () => {
    if (!editorRef.current) return;
    editorRef.current.trigger('unfold', 'editor.unfoldAll', null);
  }

  return (
    <div
      className="h-full w-full"
      onMouseEnter={() => setMouseIsInside(true)}
      onMouseLeave={() => setMouseIsInside(false)}
    >
      <div className="flex justify-end mb-2">
        <button onClick={handleCollapseAll} className="m-1 text-xs">Collapse All</button>
        <button onClick={handleExpandAll} className="m-1 text-xs">Expand All</button>
      </div>
      <Editor
        height="100%"
        beforeMount={beforeMount}
        onMount={onMount}
        value={draft}
        theme={themeName}
        options={{
          fontSize: editorFontSize,
          folding: true,
          foldingStrategy: 'auto',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          lineNumbers: 'off',
          glyphMargin: true,
          fixedOverflowWidgets: true,
        }}
        language={fountainLanguageId}
      />
    </div>
  )
}
