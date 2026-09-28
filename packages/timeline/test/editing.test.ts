import { beforeEach, describe, expect, test } from "bun:test"
import { ClapOutputType, ClapSegmentCategory as Category, newClap, newSegment, sanitizeMeta, serializeClap, parseClap } from "@aitube/clap"
import { useTimeline } from "../src/hooks/useTimeline"
import { clapSegmentToTimelineSegment } from "../src/utils/clapSegmentToTimelineSegment"
import { trackAtPosition } from "../src/utils/trackEditing"
import { SegmentEditionStatus, SegmentPointerEvent } from "../src/types/timeline"
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "../src/constants/themes"

beforeEach(() => {
  useTimeline.getState().clear()
  useTimeline.setState({ frameRate: 25 })
})

describe("timeline editing", () => {
  test("creates typed tracks, including beyond the initial grid", async () => {
    await useTimeline.getState().setClap(newClap())
    for (let i = 0; i < 26; i++) expect(useTimeline.getState().createTrack(Category.VIDEO)).toBe(i)
    expect(useTimeline.getState().tracks).toHaveLength(26)
    expect(useTimeline.getState().nbMaxTracks).toBe(26)
    expect(useTimeline.getState().tracks[25].category).toBe(Category.VIDEO)
  })

  test("empty track type can change; clip category and output follow it", async () => {
    const id = useTimeline.getState().createTrack(Category.VIDEO)
    expect(useTimeline.getState().setTrackCategory(id, Category.MUSIC)).toBe(true)
    const clip = await useTimeline.getState().createClip(id, 800)
    expect(clip?.category).toBe(Category.MUSIC)
    expect(clip?.outputType).toBe(ClapOutputType.AUDIO)
    expect(clip?.startTimeInMs).toBe(800)
    expect(clip?.endTimeInMs).toBe(2800)
    expect(useTimeline.getState().setTrackCategory(id, Category.VIDEO)).toBe(false)
  })

  test("new clips have distinct IDs and extend project duration", async () => {
    const id = useTimeline.getState().createTrack(Category.IMAGE)
    const first = await useTimeline.getState().createClip(id, 4000)
    const second = await useTimeline.getState().createClip(id, 8000)
    expect(first?.id).not.toBe(second?.id)
    expect(useTimeline.getState().durationInMs).toBe(10000)
    expect(useTimeline.getState().selectedSegments[0].id).toBe(second!.id)
  })

  test("moves horizontally and across same-type tracks, preserving duration", async () => {
    const from = useTimeline.getState().createTrack(Category.VIDEO)
    const to = useTimeline.getState().createTrack(Category.VIDEO)
    const wrong = useTimeline.getState().createTrack(Category.SOUND)
    const clip = (await useTimeline.getState().createClip(from, 0))!
    expect(useTimeline.getState().moveSegment(clip.id, 1000, to)).toBe(true)
    const moved = useTimeline.getState().segments[0]
    expect([moved.track, moved.startTimeInMs, moved.endTimeInMs]).toEqual([to, 1000, 3000])
    expect(useTimeline.getState().moveSegment(clip.id, 2000, wrong)).toBe(false)
    expect(useTimeline.getState().segments[0]).toBe(moved)
    expect(useTimeline.getState().tracks[from].occupied).toBe(false)
    expect(useTimeline.getState().tracks[to].occupied).toBe(true)
  })

  test("clamps negative time, snaps to frames, and rejects invalid and locked moves", async () => {
    const id = useTimeline.getState().createTrack(Category.VIDEO)
    const clip = (await useTimeline.getState().createClip(id, 0))!
    expect(useTimeline.getState().moveSegment(clip.id, 1050, id)).toBe(true)
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(1040)
    expect(useTimeline.getState().moveSegment(clip.id, -100, id)).toBe(true)
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(0)
    expect(useTimeline.getState().moveSegment(clip.id, NaN, id)).toBe(false)
    expect(useTimeline.getState().moveSegment(clip.id, 500, 999)).toBe(false)
    useTimeline.getState().segments[0].editionStatus = SegmentEditionStatus.LOCKED
    expect(useTimeline.getState().moveSegment(clip.id, 500, id)).toBe(false)
  })

  test("pointer movement uses original position and cancels without accumulated drift", async () => {
    const id = useTimeline.getState().createTrack(Category.DIALOGUE)
    const clip = (await useTimeline.getState().createClip(id, 0))!
    const state = useTimeline.getState()
    state.beginSegmentDrag(clip.id, 7, 100, 100)
    state.updateSegmentDrag(8, 300, 100)
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(0)
    state.updateSegmentDrag(7, 148, 100)
    state.updateSegmentDrag(7, 196, 100)
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(1000)
    state.endSegmentDrag(true)
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(0)
    expect(useTimeline.getState().segmentDrag).toBeUndefined()
  })

  test("pointer vertical movement selects variable-height compatible tracks", async () => {
    const first = useTimeline.getState().createTrack(Category.VIDEO)
    const second = useTimeline.getState().createTrack(Category.VIDEO)
    const clip = (await useTimeline.getState().createClip(first, 0))!
    const height = useTimeline.getState().tracks[first].height
    useTimeline.getState().beginSegmentDrag(clip.id, 1, 10, 20)
    useTimeline.getState().updateSegmentDrag(1, 10, 20 + height)
    expect(useTimeline.getState().segments[0].track).toBe(second)
    useTimeline.getState().endSegmentDrag()
  })

  test("camera zoom scales both drag axes without depending on canvas pan", async () => {
    const first = useTimeline.getState().createTrack(Category.VIDEO)
    const second = useTimeline.getState().createTrack(Category.VIDEO)
    const clip = (await useTimeline.getState().createClip(first, 0))!
    useTimeline.setState({ timelineCamera: { zoom: 2 } as any, scrollX: 370, scrollY: -50 })
    const height = useTimeline.getState().tracks[first].height
    useTimeline.getState().beginSegmentDrag(clip.id, 7, 100, 100)
    useTimeline.getState().updateSegmentDrag(7, 292, 100 + height * 2)
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(1000)
    expect(useTimeline.getState().segments[0].track).toBe(second)
    useTimeline.getState().endSegmentDrag()
    useTimeline.setState({ timelineCamera: undefined })
  })

  test("a second pointer cannot replace or finish the active clip drag", async () => {
    const id = useTimeline.getState().createTrack(Category.VIDEO)
    const clip = (await useTimeline.getState().createClip(id, 0))!
    useTimeline.getState().beginSegmentDrag(clip.id, 7, 100, 100)
    const pointer = { button: 0, nativeEvent: { pointerId: 8, clientX: 500, clientY: 500, preventDefault() {} }, stopPropagation() {} } as any
    useTimeline.getState().handleSegmentEvent({ eventType: SegmentPointerEvent.DOWN, segment: clip })(pointer)
    expect(useTimeline.getState().segmentDrag?.pointerId).toBe(7)
    useTimeline.getState().handleSegmentEvent({ eventType: SegmentPointerEvent.UP, segment: clip })(pointer)
    expect(useTimeline.getState().segmentDrag?.pointerId).toBe(7)
    pointer.nativeEvent.pointerId = 7
    useTimeline.getState().handleSegmentEvent({ eventType: SegmentPointerEvent.UP, segment: clip })(pointer)
    expect(useTimeline.getState().segmentDrag).toBeUndefined()
  })

  test("ruler hits cannot begin a clip drag, but releases there finish one", async () => {
    const id = useTimeline.getState().createTrack(Category.VIDEO)
    const clip = (await useTimeline.getState().createClip(id, 0))!
    const pointer = { button: 0, offsetX: leftBarTrackScaleWidth - 1, offsetY: topBarTimeScaleHeight + 20,
      nativeEvent: { pointerId: 7, clientX: 100, clientY: 100, preventDefault() {} }, stopPropagation() {} } as any
    const down = useTimeline.getState().handleSegmentEvent({ eventType: SegmentPointerEvent.DOWN, segment: clip })
    down(pointer)
    expect(useTimeline.getState().segmentDrag).toBeUndefined()
    pointer.offsetX = leftBarTrackScaleWidth + 20
    pointer.offsetY = topBarTimeScaleHeight - 1
    down(pointer)
    expect(useTimeline.getState().segmentDrag).toBeUndefined()
    pointer.offsetY = topBarTimeScaleHeight + 20
    down(pointer)
    expect(useTimeline.getState().segmentDrag?.pointerId).toBe(7)
    useTimeline.getState().updateSegmentDrag(7, 196, 100)
    pointer.offsetX = 0
    pointer.offsetY = 0
    useTimeline.getState().handleSegmentEvent({ eventType: SegmentPointerEvent.UP, segment: clip })(pointer)
    expect(useTimeline.getState().segmentDrag).toBeUndefined()
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(1000)
  })

  test("empty typed tracks and moved clips survive project round trip", async () => {
    const id = useTimeline.getState().createTrack(Category.IMAGE)
    const empty = useTimeline.getState().createTrack(Category.MUSIC)
    const clip = (await useTimeline.getState().createClip(id, 2000))!
    useTimeline.getState().moveSegment(clip.id, 4000, id)
    const clap = await useTimeline.getState().getClap()
    await useTimeline.getState().setClap(await parseClap(await serializeClap(clap)))
    expect(useTimeline.getState().tracks[empty].category).toBe(Category.MUSIC)
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(4000)
  })

  test("imported old projects infer track type without new metadata", async () => {
    await useTimeline.getState().setClap(newClap({ segments: [newSegment({ category: Category.DIALOGUE, track: 3 })] }))
    expect(useTimeline.getState().tracks[3].category).toBe(Category.DIALOGUE)
    expect((await useTimeline.getState().createClip(3))?.category).toBe(Category.DIALOGUE)
  })

  test("imported mixed tracks cannot receive unrelated new clips", async () => {
    await useTimeline.getState().setClap(newClap({ segments: [newSegment({ category: Category.DIALOGUE, track: 3 }), newSegment({ category: Category.VIDEO, track: 3 })] }))
    expect(await useTimeline.getState().createClip(3)).toBeUndefined()
  })

  test("existing addSegment honors explicit start override", async () => {
    const segment = await clapSegmentToTimelineSegment(newSegment({ category: Category.ACTION, startTimeInMs: 100, endTimeInMs: 1100 }))
    await useTimeline.getState().addSegment({ segment, startTimeInMs: 2000, track: 0 })
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(2000)
    expect(useTimeline.getState().segments[0].endTimeInMs).toBe(3000)
  })


  test("cancel restores exact non-frame-aligned timing", async () => {
    const id = useTimeline.getState().createTrack(Category.DIALOGUE)
    const clip = (await useTimeline.getState().createClip(id, 101))!
    useTimeline.getState().beginSegmentDrag(clip.id, 1, 100, 100)
    useTimeline.getState().updateSegmentDrag(1, 148, 100)
    useTimeline.getState().endSegmentDrag(true)
    expect(useTimeline.getState().segments[0].startTimeInMs).toBe(101)
    expect(useTimeline.getState().segments[0].endTimeInMs).toBe(2101)
  })

  test("in-flight clip creation cannot leak into a different project", async () => {
    const id = useTimeline.getState().createTrack(Category.VIDEO)
    const pending = useTimeline.getState().createClip(id)
    useTimeline.getState().clear()
    useTimeline.getState().createTrack(Category.VIDEO)
    expect(await pending).toBeUndefined()
    expect(useTimeline.getState().segments).toHaveLength(0)
  })


  test("drag cancellation restores the project length and camera controls", async () => {
    const id = useTimeline.getState().createTrack(Category.ACTION)
    const clip = (await useTimeline.getState().createClip(id, 0))!
    const duration = useTimeline.getState().durationInMs
    const controls = { enabled: true } as any
    useTimeline.setState({ timelineControls: controls })
    useTimeline.getState().beginSegmentDrag(clip.id, 1, 0, 0)
    expect(controls.enabled).toBe(false)
    useTimeline.getState().updateSegmentDrag(1, 2000, 0)
    expect(useTimeline.getState().durationInMs).toBeGreaterThan(duration)
    useTimeline.getState().endSegmentDrag(true)
    expect(useTimeline.getState().durationInMs).toBe(duration)
    expect(controls.enabled).toBe(true)
    useTimeline.setState({ timelineControls: undefined })
  })

  test("preview track hitboxes follow horizontal zoom changes", async () => {
    const first = useTimeline.getState().createTrack(Category.VIDEO)
    const second = useTimeline.getState().createTrack(Category.VIDEO)
    const clip = (await useTimeline.getState().createClip(first))!
    useTimeline.getState().setHorizontalZoomLevel(100)
    const height = useTimeline.getState().defaultPreviewHeight
    expect(useTimeline.getState().tracks[first].height).toBe(height)
    useTimeline.getState().beginSegmentDrag(clip.id, 1, 0, 0)
    useTimeline.getState().updateSegmentDrag(1, 0, height)
    expect(useTimeline.getState().segments[0].track).toBe(second)
    useTimeline.getState().endSegmentDrag()
  })

  test("track selection boundaries and malformed imported metadata", () => {
    const id = useTimeline.getState().createTrack(Category.ACTION)
    const tracks = useTimeline.getState().tracks
    expect(trackAtPosition(tracks, -1)).toBeUndefined()
    expect(trackAtPosition(tracks, 0)).toBe(id)
    expect(trackAtPosition(tracks, tracks[0].height)).toBeUndefined()
    expect(sanitizeMeta({ timelineTracks: [null, { id: -1 }, { id: Infinity }] as any }).timelineTracks).toEqual([])
  })
})
