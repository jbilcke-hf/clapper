// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OrthographicCamera } from 'three'
import {
  ClapOutputType,
  ClapSegmentCategory as Category,
  ClapSegmentStatus as Status,
  newClap,
  newSegment,
  parseClap,
  serializeClap,
} from '@aitube/clap'
import { SegmentEditionStatus, useTimeline } from '@aitube/timeline'

const state = () => useTimeline.getState()

beforeEach(async () => {
  state().finishSegmentDrag(true)
  useTimeline.setState({
    canvas: undefined,
    timelineCamera: undefined,
    timelineControls: undefined,
  })
  await state().setClap(newClap())
})

describe('timeline authoring through the production store and file format', () => {
  it('adds a reachable typed track beyond the original rows and preserves it while empty', async () => {
    const count = state().tracks.length
    const id = state().addTrack(Category.VIDEO)!
    expect(id).toBe(count)
    expect(state().activeTrackId).toBe(id)
    expect(state().nbMaxTracks).toBe(count + 1)
    expect(state().setTrackCategory(id, Category.MUSIC)).toBe(true)
    const saved = await parseClap(await serializeClap(await state().getClap()))
    expect(saved.meta.timelineTracks).toContainEqual({
      id,
      category: Category.MUSIC,
      name: Category.MUSIC,
      visible: true,
    })
    await state().setClap(saved)
    expect(state().tracks[id].category).toBe(Category.MUSIC)
    expect(state().tracks[id].occupied).toBe(false)
    expect(state().segments).toHaveLength(0)
  })

  it.each([
    [Category.VIDEO, ClapOutputType.VIDEO],
    [Category.IMAGE, ClapOutputType.IMAGE],
    [Category.MUSIC, ClapOutputType.AUDIO],
    [Category.SOUND, ClapOutputType.AUDIO],
    [Category.DIALOGUE, ClapOutputType.AUDIO],
    [Category.ACTION, ClapOutputType.TEXT],
    [Category.CAMERA, ClapOutputType.TEXT],
    [Category.DEPTH, ClapOutputType.IMAGE_DEPTH],
    [Category.TRANSITION, ClapOutputType.TRANSITION],
    [Category.EVENT, ClapOutputType.EVENT],
    [Category.INTERFACE, ClapOutputType.INTERFACE],
    [Category.PHENOMENON, ClapOutputType.PHENOMENON],
  ])(
    'creates a %s draft with its corresponding output type',
    async (category, outputType) => {
      const id = state().addTrack(category as Category)!
      const clip = await state().createClip(id, 1500)
      expect(clip).toMatchObject({
        category,
        outputType,
        track: id,
        status: Status.DRAFT,
        startTimeInMs: 1500,
        endTimeInMs: 3500,
        assetDurationInMs: 2000,
        assetUrl: '',
      })
      expect(clip?.id).toBeTruthy()
      expect(state().setTrackCategory(id, Category.GENERIC)).toBe(false)
    }
  )

  it('retains rapid additions and does not decode blank audio or start a resolver', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const resolver = vi.fn()
    const originalResolver = state().segmentResolver
    useTimeline.setState({ segmentResolver: resolver })
    try {
      const id = state().addTrack(Category.SOUND)!
      const clips = await Promise.all([
        state().createClip(id, 0),
        state().createClip(id, 2000),
        state().createClip(id, 4000),
      ])
      expect(state().segments).toHaveLength(3)
      expect(new Set(clips.map((clip) => clip?.id)).size).toBe(3)
      expect(
        clips.every(
          (clip) => clip?.status === Status.DRAFT && !clip.audioBuffer
        )
      ).toBe(true)
      expect(fetchSpy).not.toHaveBeenCalled()
      expect(resolver).not.toHaveBeenCalled()
    } finally {
      fetchSpy.mockRestore()
      useTimeline.setState({ segmentResolver: originalResolver })
    }
  })

  it('moves only onto a matching track, preserving identity and duration and clamping time', async () => {
    const first = state().addTrack(Category.IMAGE)!
    const same = state().addTrack(Category.IMAGE)!
    const different = state().addTrack(Category.VIDEO)!
    const clip = (await state().createClip(first, 2000))!
    expect(state().moveSegment(clip.id, 3000, different)).toBe(false)
    expect(state().segments[0]).toMatchObject({
      track: first,
      startTimeInMs: 2000,
      endTimeInMs: 4000,
    })
    expect(state().moveSegment(clip.id, -400, same)).toBe(true)
    expect(state().segments[0]).toMatchObject({
      id: clip.id,
      category: Category.IMAGE,
      status: Status.DRAFT,
      track: same,
      startTimeInMs: 0,
      endTimeInMs: 2000,
    })
    const reopened = await parseClap(
      await serializeClap(await state().getClap())
    )
    await state().setClap(reopened)
    expect(state().segments[0]).toMatchObject({
      id: clip.id,
      track: same,
      startTimeInMs: 0,
      endTimeInMs: 2000,
    })
  })

  it('preserves homogeneous and mixed legacy tracks without retyping their clips', async () => {
    const project = newClap({
      segments: [
        newSegment({
          id: 'a',
          track: 1,
          category: Category.ACTION,
          startTimeInMs: 1000,
          endTimeInMs: 3000,
          assetDurationInMs: 2000,
        }),
        newSegment({ id: 'b', track: 2, category: Category.ACTION }),
        newSegment({ id: 'c', track: 2, category: Category.CAMERA }),
      ],
    })
    expect(project.meta.timelineTracks).toBeUndefined()
    expect(project.segments[0].status).toBe(Status.TO_GENERATE)
    await state().setClap(project)
    expect(state().tracks[1].category).toBe(Category.ACTION)
    expect(state().tracks[2].mixed).toBe(true)
    expect(await state().createClip(2)).toBeUndefined()
    expect(state().moveSegment('a', 2000, 2)).toBe(false)
    expect(state().moveSegment('b', 500, 2)).toBe(true)
    expect(
      state().segments.find((segment) => segment.id === 'c')?.category
    ).toBe(Category.CAMERA)
  })

  it('ignores malformed and duplicate descriptors while preserving valid empty tracks', async () => {
    const project = newClap({
      meta: {
        timelineTracks: [
          { id: 4, category: Category.ACTION, name: 'Notes', visible: false },
          { id: 4, category: Category.VIDEO, name: 'Duplicate', visible: true },
          { id: -1, category: Category.IMAGE },
          { id: 0.5, category: Category.IMAGE },
          { id: Infinity, category: Category.IMAGE },
          { id: 4096, category: Category.IMAGE },
          { id: 8, category: 'not-a-category' },
          null,
        ] as never,
      },
    })
    expect(project.meta.timelineTracks).toEqual([
      { id: 4, category: Category.ACTION, name: 'Notes', visible: false },
    ])
    await state().setClap(project)
    expect(state().tracks[4]).toMatchObject({
      name: 'Notes',
      visible: false,
      category: Category.ACTION,
    })
  })

  it('uses actual row heights after hiding preview tracks', () => {
    const id = state().addTrack(Category.IMAGE)!
    const expanded = state().getCellHeight(id)
    expect(expanded).toBeGreaterThan(state().defaultCellHeight)
    const previous = state().contentHeight
    state().toggleTrackVisibility(id)
    expect(state().getCellHeight(id)).toBe(state().defaultCellHeight)
    expect(state().contentHeight).toBe(
      previous - expanded + state().defaultCellHeight
    )
    state().toggleTrackVisibility(id)
    expect(state().getCellHeight(id)).toBe(expanded)
  })

  it('rejects invalid authoring inputs without changing the project', async () => {
    const id = state().addTrack(Category.ACTION)!
    expect(state().addTrack('bogus' as Category)).toBeUndefined()
    expect(state().setTrackCategory(-1, Category.ACTION)).toBe(false)
    expect(await state().createClip(id, NaN)).toBeUndefined()
    expect(await state().createClip(id, -1)).toBeUndefined()
    expect(await state().createClip(-1, 0)).toBeUndefined()
    const clip = (await state().createClip(id, 0))!
    expect(state().moveSegment(clip.id, Infinity, id)).toBe(false)
    expect(state().moveSegment(clip.id, 1000, 10000)).toBe(false)
    expect(state().segments).toHaveLength(1)
    expect(state().segments[0].startTimeInMs).toBe(0)
  })
})

describe('pointer lifecycle units using the real store and camera', () => {
  const pointer = (x: number, y: number, extra = {}) =>
    ({
      pointerId: 1,
      button: 0,
      isPrimary: true,
      clientX: x,
      clientY: y,
      preventDefault: vi.fn(),
      ...extra,
    }) as unknown as PointerEvent
  beforeEach(async () => {
    await state().setClap(
      newClap({
        segments: [
          newSegment({
            id: 'drag',
            track: 1,
            category: Category.ACTION,
            startTimeInMs: 2000,
            endTimeInMs: 4000,
            assetDurationInMs: 2000,
          }),
        ],
      })
    )
    state().setTrackCategory(2, Category.ACTION)
    state().setTrackCategory(3, Category.CAMERA)
    const camera = new OrthographicCamera(-400, 400, 250, -250, 0.1, 2000)
    camera.position.set(0, 504, 1)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    const canvas = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        x: 0,
        y: 0,
        width: 800,
        height: 500,
        right: 800,
        bottom: 500,
        toJSON: () => ({}),
      }),
      setPointerCapture: vi.fn(),
      hasPointerCapture: () => true,
      releasePointerCapture: vi.fn(),
    } as unknown as HTMLCanvasElement
    useTimeline.setState({
      canvas,
      timelineCamera: camera,
      containerWidth: 800,
      containerHeight: 500,
      timelineControls: { enabled: true } as never,
    })
  })

  it('hovers without starting an edit or changing placement', () => {
    const segment = state().segments[0]
    state().handleSegmentEvent({ eventType: 'MOVE' as never, segment })({
      point: { x: -112 },
      offsetX: 288,
      offsetY: 250,
      stopPropagation() {},
    } as never)
    expect(state().hoveredSegment?.id).toBe('drag')
    expect(state().editedSegment).toBeUndefined()
    expect(state().segmentDrag).toBeUndefined()
    expect(segment).toMatchObject({
      track: 1,
      startTimeInMs: 2000,
      endTimeInMs: 4000,
      editionStatus: SegmentEditionStatus.EDITABLE,
    })
  })

  it('updates on primary press/move, restores controls and clears capture on completion', () => {
    expect(state().beginSegmentDrag('drag', pointer(288, 250))).toBe(true)
    expect(state().timelineControls?.enabled).toBe(false)
    state().updateSegmentDrag(pointer(384, 298))
    expect(state().segments[0]).toMatchObject({
      track: 2,
      startTimeInMs: 3000,
      endTimeInMs: 5000,
    })
    state().finishSegmentDrag()
    expect(state().segmentDrag).toBeUndefined()
    expect(state().timelineControls?.enabled).toBe(true)
    expect(state().canvas?.releasePointerCapture).toHaveBeenCalledWith(1)
    expect(state().segments[0].editionStatus).toBe(
      SegmentEditionStatus.EDITABLE
    )
  })

  it.each(['cancel', 'wrong type', 'outside'])(
    'reverts the complete original placement on %s',
    (reason) => {
      state().beginSegmentDrag('drag', pointer(288, 250))
      state().updateSegmentDrag(pointer(384, 298))
      if (reason === 'wrong type') state().updateSegmentDrag(pointer(400, 346))
      if (reason === 'outside') state().updateSegmentDrag(pointer(400, -10))
      state().finishSegmentDrag(reason === 'cancel')
      expect(state().segments[0]).toMatchObject({
        id: 'drag',
        track: 1,
        startTimeInMs: 2000,
        endTimeInMs: 4000,
      })
      expect(state().durationInMs).toBe(4000)
      expect(state().segmentDrag).toBeUndefined()
      expect(state().timelineControls?.enabled).toBe(true)
    }
  )

  it('ignores other pointers, secondary buttons and locked segments', () => {
    expect(
      state().beginSegmentDrag('drag', pointer(288, 250, { button: 2 }))
    ).toBe(false)
    expect(
      state().beginSegmentDrag('drag', pointer(288, 250, { isPrimary: false }))
    ).toBe(false)
    state().beginSegmentDrag('drag', pointer(288, 250))
    state().updateSegmentDrag(pointer(400, 298, { pointerId: 2 }))
    expect(state().segments[0].startTimeInMs).toBe(2000)
    state().finishSegmentDrag(true)
    state().segments[0].editionStatus = SegmentEditionStatus.LOCKED
    expect(state().beginSegmentDrag('drag', pointer(288, 250))).toBe(false)
  })
})
