import { beforeEach, describe, expect, it } from 'bun:test'
import { ClapSegmentCategory, ClapOutputType } from '@aitube/clap'

import { useTimeline } from '../src/hooks/useTimeline'

describe('timeline track and clip creation', () => {
  beforeEach(() => {
    useTimeline.getState().clear()
  })

  it('creates typed tracks and clips without overlapping on the same track', async () => {
    const store = useTimeline.getState()
    const track = store.createTrack(ClapSegmentCategory.VIDEO)

    expect(track).toBe(0)
    expect(useTimeline.getState().tracks[track].name).toBe(ClapSegmentCategory.VIDEO)

    const firstClip = await useTimeline.getState().createClip({
      track,
      startTimeInMs: 0,
      category: ClapSegmentCategory.VIDEO,
    })
    const secondClip = await useTimeline.getState().createClip({
      track,
      startTimeInMs: 0,
      category: ClapSegmentCategory.VIDEO,
    })

    expect(firstClip?.track).toBe(track)
    expect(firstClip?.category).toBe(ClapSegmentCategory.VIDEO)
    expect(firstClip?.outputType).toBe(ClapOutputType.VIDEO)
    expect(secondClip?.startTimeInMs).toBe(firstClip?.endTimeInMs)
  })

  it('keeps cross-track moves type safe', async () => {
    const videoTrack = useTimeline.getState().createTrack(ClapSegmentCategory.VIDEO)
    const soundTrack = useTimeline.getState().createTrack(ClapSegmentCategory.SOUND)
    const secondVideoTrack = useTimeline.getState().createTrack(ClapSegmentCategory.VIDEO)

    const clip = await useTimeline.getState().createClip({
      track: videoTrack,
      startTimeInMs: 0,
      category: ClapSegmentCategory.VIDEO,
    })

    expect(clip).toBeDefined()
    expect(
      useTimeline.getState().moveSegmentToTrack({
        segmentId: clip!.id,
        track: soundTrack,
      })
    ).toBe(false)
    expect(clip?.track).toBe(videoTrack)

    expect(
      useTimeline.getState().moveSegmentToTrack({
        segmentId: clip!.id,
        track: secondVideoTrack,
      })
    ).toBe(true)
    expect(clip?.track).toBe(secondVideoTrack)
  })

  it('snaps dragged clips to the timeline grid', async () => {
    const track = useTimeline.getState().createTrack(ClapSegmentCategory.ACTION)
    const clip = await useTimeline.getState().createClip({
      track,
      startTimeInMs: 0,
      category: ClapSegmentCategory.ACTION,
    })

    expect(clip).toBeDefined()

    const { cellWidth, durationInMsPerStep } = useTimeline.getState()
    useTimeline.getState().startSegmentDrag({
      segment: clip!,
      pointerTimelineX: 0,
    })
    useTimeline.getState().updateSegmentDrag({
      pointerTimelineX: cellWidth * 2.4,
      targetTrack: track,
    })
    useTimeline.getState().finishSegmentDrag()

    expect(clip?.startTimeInMs).toBe(durationInMsPerStep * 2)
  })
})
