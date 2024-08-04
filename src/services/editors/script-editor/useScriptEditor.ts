'use client'

import { create } from 'zustand'
import { Monaco } from '@monaco-editor/react'
import MonacoEditor from 'monaco-editor'
import { ClapProject, ClapSegmentCategory } from '@aitube/clap'
import {
  TimelineStore,
  useTimeline,
  leftBarTrackScaleWidth,
} from '@aitube/timeline'
import {
  ScriptEditorStore,
  EditorView,
  ScrollData,
  undo,
  redo,
} from '@aitube/clapper-services'

import { getDefaultScriptEditorState } from './getDefaultScriptEditorState'
import { useAssistant } from '@/services/assistant/useAssistant'

export const useScriptEditor = create<ScriptEditorStore>((set, get) => ({
  ...getDefaultScriptEditorState(),
  setMonaco: (monaco?: Monaco) => {
    set({ monaco })
  },
  setTextModel: (textModel?: MonacoEditor.editor.ITextModel) => {
    set({ textModel })
  },
  setStandaloneCodeEditor: (
    standaloneCodeEditor?: MonacoEditor.editor.IStandaloneCodeEditor
  ) => {
    set({ standaloneCodeEditor })
  },
  setMouseIsInside: (mouseIsInside: boolean) => {
    set({ mouseIsInside })
  },
  loadDraftFromClap: (clap: ClapProject) => {
    const { highlightElements, textModel } = get()

    set({
      current: clap.meta.screenplay,
      lastPublished: clap.meta.screenplay,
    })

    try {
      // we need to update the model
      textModel?.setValue(clap.meta.screenplay)
    } catch (err) {
      // to catch the "Error: Model is disposed!"
      // this can happen if the timing isn't right,
      // the model might already (or still) be disposed of
      return
    }

    // and highlight the text again
    try {
      highlightElements()
    } catch (err) {}
  },
  publish: async (): Promise<void> => {
    console.log('publish')
    const { current, lastPublished } = get()
    set({
      lastPublished: current,
    })

    console.log('state:', { current, lastPublished })

    if (!lastPublished || !current) {
      return
    }

    const maxLength = Math.max(lastPublished.length, current.length)

    let i = 0
    for (; i < maxLength; i++) {
      if (lastPublished[i] !== current[i]) {
        break
      }
    }
    const existingText = lastPublished.slice(0, i)
    const newTextAddition = current.slice(i)
    console.log('existingText:', existingText)
    console.log('newTextAddition:', newTextAddition)

    const assistant = useAssistant.getState()

    // call the LLM, with a prompt like:
  },
  onDidScrollChange: ({
    scrollHeight,
    scrollLeft,
    scrollTop,
    scrollWidth,
  }: ScrollData) => {
    const {
      scrollHeight: previousScrollHeight,
      scrollLeft: previousScrollLeft,
      scrollTop: previousScrollTop,
      scrollWidth: previousScrollWidth,
      mouseIsInside,
    } = get()

    // skip if nothing changed
    if (
      scrollHeight === previousScrollHeight &&
      scrollLeft === previousScrollLeft &&
      scrollTop === previousScrollTop &&
      scrollWidth === previousScrollWidth
    ) {
      return
    }

    set({
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth,
    })

    // if the scroll event happened while we where inside the editor,
    // then we need to dispatch the it
    if (mouseIsInside) {
      const timeline: TimelineStore = useTimeline.getState()
      if (!timeline.timelineCamera || !timeline.timelineControls) {
        return
      }

      const { standaloneCodeEditor } = get()

      const scrollRatio = scrollTop / scrollHeight
      const scrollX = Math.round(
        leftBarTrackScaleWidth + scrollRatio * timeline.contentWidth
      )

      /*console.log({
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
        scrollRatio,
        scrollX
      })
       */

      if (useTimeline.getState().scrolX !== scrollX) {
        useTimeline.setState({ scrollX })
        timeline.timelineCamera.position.setX(scrollX)
        timeline.timelineControls.target.setX(scrollX)
      }
    }
  },
  jumpCursorOnLineClick: (line?: number) => {
    if (typeof line !== 'number') {
      return
    }
    const timeline: TimelineStore = useTimeline.getState()

    const { lineNumberToMentionedSegments } = timeline

    const mentionedSegments = lineNumberToMentionedSegments[line] || []

    const firstMentionedSegment = mentionedSegments.at(0)

    if (typeof firstMentionedSegment?.startTimeInMs !== 'number') {
      return
    }

    const { startTimeInMs } = firstMentionedSegment

    timeline.setCursorTimestampAtInMs(startTimeInMs)
  },

  highlightElements: () => {
    const timeline: TimelineStore = useTimeline.getState()
    const { clap } = timeline

    const { textModel, standaloneCodeEditor, applyClassNameToKeywords } = get()
    if (!textModel || !standaloneCodeEditor || !clap) {
      return
    }

    const characters = clap.entities
      .filter((entity) => entity.category === ClapSegmentCategory.CHARACTER)
      .map((entity) => entity.triggerName)

    // any character
    applyClassNameToKeywords('entity entity-character', characters)

    // UPPERCASE CHARACTER
    applyClassNameToKeywords(
      'entity entity-character entity-highlight',
      characters,
      true
    )

    const locations = clap.entities
      .filter((entity) => entity.category === ClapSegmentCategory.LOCATION)
      .map((entity) => entity.triggerName)
    // any location
    applyClassNameToKeywords('entity entity-location', locations)

    // UPPERCASE LOCATION
    applyClassNameToKeywords(
      'entity entity-location entity-highlight',
      locations,
      true
    )
  },
  applyClassNameToKeywords: (
    className: string = '',
    keywords: string[] = [],
    caseSensitive = false
  ) => {
    const timeline: TimelineStore = useTimeline.getState()
    const { clap } = timeline

    const { textModel, standaloneCodeEditor } = get()
    if (!textModel || !standaloneCodeEditor || !clap) {
      return
    }

    keywords.forEach((entityTriggerName: string): void => {
      const matches: MonacoEditor.editor.FindMatch[] = textModel.findMatches(
        // searchString — The string used to search. If it is a regular expression, set isRegex to true.
        // searchString: string,
        entityTriggerName,

        // @param searchOnlyEditableRange — Limit the searching to only search inside the editable range of the model.
        // searchOnlyEditableRange: boolean,
        false,

        // / @param isRegex — Used to indicate that searchString is a regular expression.
        // isRegex: boolean,
        false,

        // @param matchCase — Force the matching to match lower/upper case exactly.
        // matchCase: boolean,
        caseSensitive,

        // @param wordSeparators — Force the matching to match entire words only. Pass null otherwise.
        // wordSeparators: string | null,
        null,

        // @param captureMatches — The result will contain the captured groups.
        // captureMatches: boolean,
        false

        // limitResultCount — Limit the number of results
        // limitResultCount?: number
      )

      matches.forEach((match: MonacoEditor.editor.FindMatch): void => {
        standaloneCodeEditor.createDecorationsCollection([
          {
            range: match.range,
            options: {
              isWholeLine: false,
              inlineClassName: className,
            },
          },
        ])
      })
    })
  },
  setCurrent: (current?: string) => {
    set({ current })
  },
  undo: () => {
    set(undo(get()))
  },
  redo: () => {
    set(redo(get()))
  },
}))
