'use client'

import { create } from 'zustand'
import { TimelineStore, useTimeline, TimelineSegment } from '@aitube/timeline'
import {
  AudioStore,
  CurrentlyPlayingAudioSource,
} from '@aitube/clapper-services'

import { getDefaultAudioState } from './getDefaultAudioState'
import { startAudioSourceNode } from './startAudioSourceNode'
import { useRenderer } from '../renderer'

export const useAudio = create<AudioStore>((set, get) => ({
  ...getDefaultAudioState(),

  play: () => {
    // console.log("useAudio: play()")
    const { isPlaying, currentlyPlaying } = get()
    if (isPlaying) {
      return
    }
    currentlyPlaying.forEach((p) => {
      try {
        p.sourceNode.start()
        } catch (err) {
          // that will throw for the "cannot start more than once" thing
        }
      })
  },
  stop: () => {
    // console.log("useAudio: stop()")
    const { isPlaying, currentlyPlaying } = get()
    if (isPlaying) {
      return
    }
    currentlyPlaying.forEach((p) => {
      try {
        p.sourceNode.stop()
      } catch (err) {
        // yeah
      }
    })
    // no need to update currentlyPlaying, it will be automatic
    // see function playAudioSegment(), below the "source.sourceNode.onended = () => {"
  },

  setUserDefinedGain: (userDefinedGain: number) => {
    // console.log(`useAudio: setUserDefinedGain(${userDefinedGain})`)
    const { setCurrentGain } = get()
    set({ userDefinedGain })
    setCurrentGain(userDefinedGain)
  },

  setCurrentGain: (currentGain: number) => {
    // console.log(`useAudio: setCurrentGain(${currentGain})`)
    const { currentlyPlaying } = get()
    set({ currentGain, isMuted: currentGain === 0 })
    currentlyPlaying.forEach((p) => {
      p.gainNode.gain.value = p.originalGain * currentGain
    })
  },

  mute: () => {
    // console.log("useAudio: mute()")
    const { setCurrentGain } = get()
    setCurrentGain(0)
  },

  unmute: () => {
    // console.log("useAudio: unmute()")
    const { setCurrentGain, userDefinedGain } = get()
    setCurrentGain(userDefinedGain)
  },

  /**
   * This makes sure we are playing what should be played
   *
   * @returns
   */
  syncAudioToCurrentCursorPosition: (
    activeAudioSegments: TimelineSegment[]
  ) => {
    const { audioContext, currentlyPlaying } = get()

    const timelineStore: TimelineStore = useTimeline.getState()
    const { cursorTimestampAtInMs } = timelineStore

    const segments: TimelineSegment[] = activeAudioSegments.filter(
      (s) => !currentlyPlaying.some((p) => p.segmentId === s.id)
    )

    if (!segments.length) {
      return
    }
    // console.log("useAudio: found audio segments that should be playing")

    const newlyStartedAudioSourceNodes = segments
      .map((segment: TimelineSegment) =>
        startAudioSourceNode({
          audioContext,
          segment,
          cursorTimestampAtInMs,
          onEnded: (sourceId) => {
            // console.log("useAudio: removing the old source node from the list of playing")
            // since this callback might be called 30 sec, 3 min, 60 min later,
            //it is vital to import a fresh store state using useAudio.getState()
            set({
              // then we can finally we remove the source from the list, synchronously
              currentlyPlaying: get().currentlyPlaying.filter(
                (p) => p.sourceId !== sourceId
              ),
            })
          },
        })
      )
      .filter((s) => s) as CurrentlyPlayingAudioSource[]

    set({
      currentlyPlaying: [
        // let's not forget to keep the current samples!
        ...currentlyPlaying,
        ...newlyStartedAudioSourceNodes,
      ],
    })
  },
}))
