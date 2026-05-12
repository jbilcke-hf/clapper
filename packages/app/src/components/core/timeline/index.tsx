import { useEffect, useMemo, useState } from 'react'
import { ClapTimeline, useTimeline, SegmentResolver } from '@aitube/timeline'
import { ClapSegmentCategory } from '@aitube/clap'

import { useMonitor } from '@/services/monitor/useMonitor'
import { useResolver } from '@/services/resolver/useResolver'
import { useUI } from '@/services/ui'

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

  const resolveSegment: SegmentResolver = useResolver((s) => s.resolveSegment)
  const setSegmentResolver = useTimeline((s) => s.setSegmentResolver)

  const jumpAt = useMonitor((s) => s.jumpAt)
  const checkIfPlaying = useMonitor((s) => s.checkIfPlaying)
  const togglePlayback = useMonitor((s) => s.togglePlayback)

  const setJumpAt = useTimeline((s) => s.setJumpAt)
  const setIsPlaying = useTimeline((s) => s.setIsPlaying)
  const setTogglePlayback = useTimeline((s) => s.setTogglePlayback)

  const startLoop = useResolver((s) => s.startLoop)
  const tracks = useTimeline((s) => s.tracks)
  const addTrack = useTimeline((s) => s.addTrack)
  const addClip = useTimeline((s) => s.addClip)
  const cursorTimestampAtInMs = useTimeline((s) => s.cursorTimestampAtInMs)
  const [trackType, setTrackType] = useState<ClapSegmentCategory>(
    ClapSegmentCategory.VIDEO
  )
  const [selectedTrackId, setSelectedTrackId] = useState<number>(0)
  const categories = useMemo(
    () => [
      ClapSegmentCategory.VIDEO,
      ClapSegmentCategory.IMAGE,
      ClapSegmentCategory.DIALOGUE,
      ClapSegmentCategory.SOUND,
      ClapSegmentCategory.MUSIC,
      ClapSegmentCategory.GENERIC,
    ],
    []
  )

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

  if (className) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 p-2">
          <select
            value={trackType}
            onChange={(e) =>
              setTrackType(e.target.value as ClapSegmentCategory)
            }
            className="rounded border border-white/20 bg-black/40 px-2 py-1 text-xs"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            className="rounded border border-white/20 px-2 py-1 text-xs"
            onClick={() => {
              const id = addTrack({ category: trackType })
              setSelectedTrackId(id)
            }}
          >
            Add Track
          </button>
          <select
            value={selectedTrackId}
            onChange={(e) => setSelectedTrackId(Number(e.target.value))}
            className="rounded border border-white/20 bg-black/40 px-2 py-1 text-xs"
          >
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                Track {t.id} ({t.name})
              </option>
            ))}
          </select>
          <button
            className="rounded border border-white/20 px-2 py-1 text-xs"
            onClick={() => {
              addClip({
                category: trackType,
                track: selectedTrackId,
                startTimeInMs: cursorTimestampAtInMs || 0,
              })
            }}
          >
            Add Clip
          </button>
        </div>
        <ClapTimeline showFPS={false} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 p-2">
        <select
          value={trackType}
          onChange={(e) => setTrackType(e.target.value as ClapSegmentCategory)}
          className="rounded border border-white/20 bg-black/40 px-2 py-1 text-xs"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className="rounded border border-white/20 px-2 py-1 text-xs"
          onClick={() => {
            const id = addTrack({ category: trackType })
            setSelectedTrackId(id)
          }}
        >
          Add Track
        </button>
        <select
          value={selectedTrackId}
          onChange={(e) => setSelectedTrackId(Number(e.target.value))}
          className="rounded border border-white/20 bg-black/40 px-2 py-1 text-xs"
        >
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              Track {t.id} ({t.name})
            </option>
          ))}
        </select>
        <button
          className="rounded border border-white/20 px-2 py-1 text-xs"
          onClick={() => {
            addClip({
              category: trackType,
              track: selectedTrackId,
              startTimeInMs: cursorTimestampAtInMs || 0,
            })
          }}
        >
          Add Clip
        </button>
      </div>
      <ClapTimeline showFPS={false} className={className} />
    </div>
  )
}
