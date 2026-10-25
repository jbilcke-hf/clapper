import { useState } from 'react'
import { ClapSegmentCategory } from '@aitube/clap'
import { useTimeline } from '@/hooks/useTimeline'
import { getTrackCategory } from '@/utils/trackAuthoring'

export function TimelineAuthoring() {
  const tracks = useTimeline(state => state.tracks)
  const segments = useTimeline(state => state.segments)
  const activeTrackId = useTimeline(state => state.activeTrackId)
  const isLoading = useTimeline(state => state.isLoading)
  const dragging = useTimeline(state => !!state.segmentDrag)
  const [message, setMessage] = useState('')
  const track = tracks[activeTrackId]
  const category = getTrackCategory(track, segments)
  const occupied = segments.some(segment => segment.track === activeTrackId)
  const disabled = isLoading || dragging
  const controlStyle = {
    background: '#292524',
    color: 'inherit',
    border: '1px solid #78716c',
    borderRadius: 4,
    padding: '4px 8px',
  }

  return (
    <div
      aria-label="Timeline authoring"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        color: '#fafaf9',
        fontSize: 12,
      }}
    >
      <button
        type="button"
        disabled={disabled}
        style={controlStyle}
        onClick={() => {
          const id = useTimeline.getState().addTrack(category || ClapSegmentCategory.VIDEO)
          setMessage(id === undefined ? 'Unable to add a track.' : `Created track ${id}.`)
        }}
      >
        New track
      </button>
      <label>
        Track{' '}
        <select
          aria-label="Track"
          value={activeTrackId}
          disabled={disabled || !tracks.length}
          style={controlStyle}
          onChange={event => {
            useTimeline.getState().selectTrack(Number(event.target.value))
            setMessage('')
          }}
        >
          {tracks.map(track => (
            <option key={track.id} value={track.id}>
              {track.id}: {track.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Track type{' '}
        <select
          aria-label="Track type"
          value={category || ''}
          disabled={disabled || !track || occupied}
          style={controlStyle}
          onChange={event => {
            const changed = useTimeline.getState().setTrackCategory(activeTrackId, event.target.value as ClapSegmentCategory)
            setMessage(changed ? 'Track type updated.' : 'Only empty tracks can change type.')
          }}
        >
          <option value="" disabled>
            {track?.mixed ? 'Mixed legacy track' : 'Choose type'}
          </option>
          {Object.values(ClapSegmentCategory).map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        disabled={disabled || !category}
        style={controlStyle}
        onClick={async () => {
          try {
            const clip = await useTimeline.getState().createClip(activeTrackId)
            setMessage(clip ? 'Draft clip added at the playhead.' : 'Choose a typed track to add a clip.')
          } catch {
            setMessage('Unable to add a clip.')
          }
        }}
      >
        New clip
      </button>
      <span role="status" aria-live="polite">
        {message || (occupied ? 'Track type is fixed while it contains clips.' : 'New clips are drafts; generation is separate.')}
      </span>
    </div>
  )
}
