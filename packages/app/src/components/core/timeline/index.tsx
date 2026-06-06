import { useEffect, useMemo, useState } from 'react'
import { ClapSegmentCategory } from '@aitube/clap'
import { ClapTimeline, useTimeline, SegmentResolver } from '@aitube/timeline'

import { useMonitor } from '@/services/monitor/useMonitor'
import { useResolver } from '@/services/resolver/useResolver'
import { useUI } from '@/services/ui'

const creativeTrackCategories = [
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.ACTION,
  ClapSegmentCategory.CAMERA,
  ClapSegmentCategory.GENERIC,
]

export function Timeline(
  {
    className = '',
  }: {
    className?: string
  } = {
    className: '',
  }
) {
  const isReady = useTimeline((s) => s.isReady)
  const tracks = useTimeline((s) => s.tracks)
  const createTrack = useTimeline((s) => s.createTrack)
  const createClip = useTimeline((s) => s.createClip)
  const [category, setCategory] = useState<ClapSegmentCategory>(
    ClapSegmentCategory.VIDEO
  )
  const [trackId, setTrackId] = useState<number | 'new'>('new')

  const selectableTracks = useMemo(
    () => tracks.filter((track) => track.visible),
    [tracks]
  )

  const resolveSegment: SegmentResolver = useResolver((s) => s.resolveSegment)
  const setSegmentResolver = useTimeline((s) => s.setSegmentResolver)

  const jumpAt = useMonitor((s) => s.jumpAt)
  const checkIfPlaying = useMonitor((s) => s.checkIfPlaying)
  const togglePlayback = useMonitor((s) => s.togglePlayback)

  const setJumpAt = useTimeline((s) => s.setJumpAt)
  const setIsPlaying = useTimeline((s) => s.setIsPlaying)
  const setTogglePlayback = useTimeline((s) => s.setTogglePlayback)

  const startLoop = useResolver((s) => s.startLoop)

  // this is important: we connect the monitor to the timeline
  useEffect(() => {
    if (!isReady) {
      return
    }
    setSegmentResolver(resolveSegment)
    setJumpAt(jumpAt)
    setIsPlaying(checkIfPlaying)
    setTogglePlayback(togglePlayback)

    // not sure if that's the best place, but once the timeline is loaded
    // we need to apply theme to it
    useUI.getState().applyThemeToComponents()
    startLoop()
  }, [
    isReady,
    setSegmentResolver,
    setJumpAt,
    setIsPlaying,
    setTogglePlayback,
    startLoop,
    checkIfPlaying,
    jumpAt,
    resolveSegment,
    togglePlayback,
  ])

  const handleCreateTrack = () => {
    const newTrackId = createTrack({ category })
    setTrackId(newTrackId)
  }

  const handleCreateClip = async () => {
    await createClip({
      category,
      track: trackId === 'new' ? undefined : trackId,
    })
  }

  const timeline = <ClapTimeline showFPS={false} />

  const timelineCreationControls = (
    <div className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-md border border-white/15 bg-black/75 p-2 text-xs text-white shadow-lg backdrop-blur">
      <select
        aria-label="Track type"
        className="h-8 rounded border border-white/20 bg-neutral-900 px-2 text-white"
        value={category}
        onChange={(event) =>
          setCategory(event.target.value as ClapSegmentCategory)
        }
      >
        {creativeTrackCategories.map((trackCategory) => (
          <option key={trackCategory} value={trackCategory}>
            {trackCategory}
          </option>
        ))}
      </select>
      <select
        aria-label="Target track"
        className="h-8 rounded border border-white/20 bg-neutral-900 px-2 text-white"
        value={trackId}
        onChange={(event) => {
          setTrackId(
            event.target.value === 'new' ? 'new' : Number(event.target.value)
          )
        }}
      >
        <option value="new">New track</option>
        {selectableTracks.map((track) => (
          <option key={track.id} value={track.id}>
            Track {track.id}: {track.name}
          </option>
        ))}
      </select>
      <button
        className="h-8 rounded bg-white px-3 font-medium text-black hover:bg-white/90"
        type="button"
        onClick={handleCreateTrack}
      >
        Add track
      </button>
      <button
        className="h-8 rounded bg-cyan-400 px-3 font-medium text-black hover:bg-cyan-300"
        type="button"
        onClick={handleCreateClip}
      >
        Add clip
      </button>
    </div>
  )

  if (className) {
    return (
      <div className={`relative ${className}`}>
        {timelineCreationControls}
        {timeline}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {timelineCreationControls}
      {timeline}
    </div>
  )
}
