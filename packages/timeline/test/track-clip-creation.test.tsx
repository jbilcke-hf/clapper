import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimeline } from '../src/hooks/useTimeline'
import { ClapSegmentCategory } from '@aitube/clap'

describe('Track and Clip Creation', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useTimeline())
    act(() => {
      result.current.clear()
    })
  })

  describe('createTrack', () => {
    it('should create a new track with VIDEO category', () => {
      const { result } = renderHook(() => useTimeline())

      let newTrackId: number
      act(() => {
        newTrackId = result.current.createTrack(ClapSegmentCategory.VIDEO)
      })

      const tracks = result.current.tracks
      const newTrack = tracks[newTrackId!]

      expect(newTrack).toBeDefined()
      expect(newTrack.name).toBe(ClapSegmentCategory.VIDEO)
      expect(newTrack.isPreview).toBe(true)
      expect(newTrack.visible).toBe(true)
    })

    it('should create a new track with DIALOGUE category', () => {
      const { result } = renderHook(() => useTimeline())

      let newTrackId: number
      act(() => {
        newTrackId = result.current.createTrack(ClapSegmentCategory.DIALOGUE)
      })

      const tracks = result.current.tracks
      const newTrack = tracks[newTrackId!]

      expect(newTrack).toBeDefined()
      expect(newTrack.name).toBe(ClapSegmentCategory.DIALOGUE)
      expect(newTrack.isPreview).toBe(false)
    })

    it('should assign sequential track IDs', () => {
      const { result } = renderHook(() => useTimeline())

      let trackId1: number, trackId2: number
      act(() => {
        trackId1 = result.current.createTrack(ClapSegmentCategory.VIDEO)
        trackId2 = result.current.createTrack(ClapSegmentCategory.MUSIC)
      })

      expect(trackId2!).toBeGreaterThan(trackId1!)
    })
  })

  describe('createClip', () => {
    it('should create a new clip on a track', async () => {
      const { result } = renderHook(() => useTimeline())

      let trackId: number
      act(() => {
        trackId = result.current.createTrack(ClapSegmentCategory.VIDEO)
      })

      let segment: any
      await act(async () => {
        segment = await result.current.createClip({
          track: trackId!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 0,
          durationInMs: 5000,
          prompt: 'Test video clip'
        })
      })

      expect(segment).toBeDefined()
      expect(segment.track).toBe(trackId!)
      expect(segment.category).toBe(ClapSegmentCategory.VIDEO)
      expect(segment.startTimeInMs).toBe(0)
      expect(segment.endTimeInMs).toBe(5000)
      expect(segment.prompt).toBe('Test video clip')
    })

    it('should create clip with correct output type for VIDEO', async () => {
      const { result } = renderHook(() => useTimeline())

      let trackId: number
      act(() => {
        trackId = result.current.createTrack(ClapSegmentCategory.VIDEO)
      })

      let segment: any
      await act(async () => {
        segment = await result.current.createClip({
          track: trackId!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 0,
        })
      })

      expect(segment.outputType).toBe('video')
    })

    it('should create clip with correct output type for DIALOGUE', async () => {
      const { result } = renderHook(() => useTimeline())

      let trackId: number
      act(() => {
        trackId = result.current.createTrack(ClapSegmentCategory.DIALOGUE)
      })

      let segment: any
      await act(async () => {
        segment = await result.current.createClip({
          track: trackId!,
          category: ClapSegmentCategory.DIALOGUE,
          startTimeInMs: 0,
        })
      })

      expect(segment.outputType).toBe('audio')
    })

    it('should use default duration when not specified', async () => {
      const { result } = renderHook(() => useTimeline())

      const defaultDuration = result.current.defaultSegmentDurationInSteps * result.current.durationInMsPerStep

      let trackId: number
      act(() => {
        trackId = result.current.createTrack(ClapSegmentCategory.VIDEO)
      })

      let segment: any
      await act(async () => {
        segment = await result.current.createClip({
          track: trackId!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 0,
        })
      })

      expect(segment.endTimeInMs - segment.startTimeInMs).toBe(defaultDuration)
    })
  })

  describe('moveSegmentToTrack', () => {
    it('should move segment to compatible track', async () => {
      const { result } = renderHook(() => useTimeline())

      let trackId1: number, trackId2: number
      act(() => {
        trackId1 = result.current.createTrack(ClapSegmentCategory.VIDEO)
        trackId2 = result.current.createTrack(ClapSegmentCategory.VIDEO)
      })

      let segment: any
      await act(async () => {
        segment = await result.current.createClip({
          track: trackId1!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 0,
        })
      })

      let moveResult: boolean
      act(() => {
        moveResult = result.current.moveSegmentToTrack(segment, trackId2!)
      })

      expect(moveResult!).toBe(true)
      expect(segment.track).toBe(trackId2!)
    })

    it('should reject move to incompatible track type', async () => {
      const { result } = renderHook(() => useTimeline())

      let videoTrackId: number, dialogueTrackId: number
      act(() => {
        videoTrackId = result.current.createTrack(ClapSegmentCategory.VIDEO)
        dialogueTrackId = result.current.createTrack(ClapSegmentCategory.DIALOGUE)
      })

      // Add a dialogue clip to make the track occupied
      await act(async () => {
        await result.current.createClip({
          track: dialogueTrackId!,
          category: ClapSegmentCategory.DIALOGUE,
          startTimeInMs: 10000,
        })
      })

      let videoSegment: any
      await act(async () => {
        videoSegment = await result.current.createClip({
          track: videoTrackId!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 0,
        })
      })

      let moveResult: boolean
      act(() => {
        moveResult = result.current.moveSegmentToTrack(videoSegment, dialogueTrackId!)
      })

      expect(moveResult!).toBe(false)
      expect(videoSegment.track).toBe(videoTrackId!)
    })

    it('should reject move when collision detected', async () => {
      const { result } = renderHook(() => useTimeline())

      let trackId1: number, trackId2: number
      act(() => {
        trackId1 = result.current.createTrack(ClapSegmentCategory.VIDEO)
        trackId2 = result.current.createTrack(ClapSegmentCategory.VIDEO)
      })

      // Create two segments on different tracks with overlapping times
      let segment1: any, segment2: any
      await act(async () => {
        segment1 = await result.current.createClip({
          track: trackId1!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 0,
          durationInMs: 5000,
        })
        segment2 = await result.current.createClip({
          track: trackId2!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 2000,
          durationInMs: 5000,
        })
      })

      // Try to move segment1 to trackId2 (should collide with segment2)
      let moveResult: boolean
      act(() => {
        moveResult = result.current.moveSegmentToTrack(segment1, trackId2!)
      })

      expect(moveResult!).toBe(false)
      expect(segment1.track).toBe(trackId1!)
    })

    it('should allow move to empty track', async () => {
      const { result } = renderHook(() => useTimeline())

      let videoTrackId: number, emptyTrackId: number
      act(() => {
        videoTrackId = result.current.createTrack(ClapSegmentCategory.VIDEO)
        emptyTrackId = result.current.createTrack(ClapSegmentCategory.MUSIC)
      })

      let videoSegment: any
      await act(async () => {
        videoSegment = await result.current.createClip({
          track: videoTrackId!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 0,
        })
      })

      let moveResult: boolean
      act(() => {
        moveResult = result.current.moveSegmentToTrack(videoSegment, emptyTrackId!)
      })

      expect(moveResult!).toBe(true)
      expect(videoSegment.track).toBe(emptyTrackId!)
    })
  })

  describe('Integration', () => {
    it('should create multiple tracks and clips', async () => {
      const { result } = renderHook(() => useTimeline())

      let videoTrackId: number, audioTrackId: number
      act(() => {
        videoTrackId = result.current.createTrack(ClapSegmentCategory.VIDEO)
        audioTrackId = result.current.createTrack(ClapSegmentCategory.DIALOGUE)
      })

      await act(async () => {
        await result.current.createClip({
          track: videoTrackId!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 0,
          durationInMs: 5000,
        })
        await result.current.createClip({
          track: videoTrackId!,
          category: ClapSegmentCategory.VIDEO,
          startTimeInMs: 5000,
          durationInMs: 5000,
        })
        await result.current.createClip({
          track: audioTrackId!,
          category: ClapSegmentCategory.DIALOGUE,
          startTimeInMs: 0,
          durationInMs: 10000,
        })
      })

      const segments = result.current.segments
      expect(segments.length).toBe(3)
      expect(segments.filter(s => s.track === videoTrackId!).length).toBe(2)
      expect(segments.filter(s => s.track === audioTrackId!).length).toBe(1)
    })
  })
})
