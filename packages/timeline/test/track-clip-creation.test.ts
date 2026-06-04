import { beforeEach, describe, expect, it } from 'bun:test'
import { ClapSegmentCategory, ClapOutputType } from '@aitube/clap'

import { useTimeline } from '../src/hooks/useTimeline'

function makeTrack(id: number, name: string, occupied = true) {
  const { defaultCellHeight, defaultPreviewHeight } = useTimeline.getState()
  const isPreview =
    name === ClapSegmentCategory.IMAGE || name === ClapSegmentCategory.VIDEO

  return {
    id,
    name,
    isPreview,
    height: isPreview ? defaultPreviewHeight : defaultCellHeight,
    hue: 0,
    occupied,
    visible: true,
  }
}

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

  it('creates new track ids after the current maximum id', () => {
    useTimeline.setState({
      tracks: [
        makeTrack(2, ClapSegmentCategory.VIDEO),
        makeTrack(7, ClapSegmentCategory.SOUND),
      ],
    })

    const track = useTimeline.getState().createTrack(ClapSegmentCategory.IMAGE)

    expect(track).toBe(8)
    expect(useTimeline.getState().tracks.find((item) => item.id === 8)?.name).toBe(
      ClapSegmentCategory.IMAGE
    )
  })

  it('uses track ids instead of array positions for non-contiguous tracks', async () => {
    useTimeline.setState({
      tracks: [
        makeTrack(5, '(empty)', false),
        makeTrack(2, ClapSegmentCategory.VIDEO),
      ],
    })

    expect(
      useTimeline.getState().setTrackCategory(5, ClapSegmentCategory.SOUND)
    ).toBe(true)
    expect(useTimeline.getState().tracks.find((item) => item.id === 5)?.name).toBe(
      ClapSegmentCategory.SOUND
    )
    expect(useTimeline.getState().tracks.find((item) => item.id === 2)?.name).toBe(
      ClapSegmentCategory.VIDEO
    )

    const clip = await useTimeline.getState().createClip({
      track: 5,
      startTimeInMs: 0,
      category: ClapSegmentCategory.SOUND,
    })

    expect(clip?.track).toBe(5)
  })

  it('does not retag an empty track when clip placement fails', async () => {
    const { defaultSegmentDurationInSteps, durationInMsPerStep } =
      useTimeline.getState()
    const segmentDurationInMs =
      defaultSegmentDurationInSteps * durationInMsPerStep

    useTimeline.setState({
      tracks: [makeTrack(11, '(empty)', false)],
      segments: Array.from({ length: 1000 }, (_, index) => ({
        id: `occupied-${index}`,
        track: 11,
        startTimeInMs: index * durationInMsPerStep,
        endTimeInMs: index * durationInMsPerStep + segmentDurationInMs,
        category: ClapSegmentCategory.MUSIC,
      })) as any,
    })

    const clip = await useTimeline.getState().createClip({
      track: 11,
      startTimeInMs: 0,
      category: ClapSegmentCategory.MUSIC,
    })

    expect(clip).toBeUndefined()
    expect(useTimeline.getState().tracks.find((item) => item.id === 11)?.name).toBe(
      '(empty)'
    )
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
