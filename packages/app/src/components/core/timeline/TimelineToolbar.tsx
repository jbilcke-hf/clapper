'use client'

import { useEffect, useMemo, useState } from 'react'
import { ListPlus, Plus, Tags } from 'lucide-react'
import { ClapSegmentCategory } from '@aitube/clap'
import { useTimeline } from '@aitube/timeline'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const TRACK_CATEGORIES: Array<{ value: ClapSegmentCategory; label: string }> = [
  { value: ClapSegmentCategory.VIDEO, label: 'Video' },
  { value: ClapSegmentCategory.IMAGE, label: 'Image' },
  { value: ClapSegmentCategory.DIALOGUE, label: 'Dialogue' },
  { value: ClapSegmentCategory.MUSIC, label: 'Music' },
  { value: ClapSegmentCategory.SOUND, label: 'Sound' },
  { value: ClapSegmentCategory.CAMERA, label: 'Camera' },
  { value: ClapSegmentCategory.ACTION, label: 'Action' },
  { value: ClapSegmentCategory.CHARACTER, label: 'Character' },
  { value: ClapSegmentCategory.LOCATION, label: 'Location' },
  { value: ClapSegmentCategory.LIGHTING, label: 'Lighting' },
  { value: ClapSegmentCategory.STYLE, label: 'Style' },
  { value: ClapSegmentCategory.TRANSITION, label: 'Transition' },
  { value: ClapSegmentCategory.EFFECT, label: 'Effect' },
  { value: ClapSegmentCategory.GENERIC, label: 'Generic' },
]

function isTrackCategory(value: string): value is ClapSegmentCategory {
  return Object.values(ClapSegmentCategory).includes(
    value as ClapSegmentCategory
  )
}

export function TimelineToolbar() {
  const [selectedCategory, setSelectedCategory] = useState<ClapSegmentCategory>(
    ClapSegmentCategory.VIDEO
  )
  const [selectedTrack, setSelectedTrack] = useState('')

  const tracks = useTimeline((s) => s.tracks)
  const cursorTimestampAtInMs = useTimeline((s) => s.cursorTimestampAtInMs)
  const createTrack = useTimeline((s) => s.createTrack)
  const setTrackCategory = useTimeline((s) => s.setTrackCategory)
  const createClip = useTimeline((s) => s.createClip)

  const selectedTrackId = selectedTrack ? Number(selectedTrack) : undefined
  const selectedTrackInfo =
    typeof selectedTrackId === 'number'
      ? tracks.find((track) => track.id === selectedTrackId)
      : undefined

  const trackItems = useMemo(
    () =>
      tracks.map((track) => ({
        id: track.id,
        label: `Track ${track.id} - ${track.name}`,
      })),
    [tracks]
  )

  useEffect(() => {
    if (selectedTrack || !tracks.length) {
      return
    }
    setSelectedTrack(String(tracks[0].id))
  }, [selectedTrack, tracks])

  useEffect(() => {
    if (!selectedTrackInfo || !isTrackCategory(selectedTrackInfo.name)) {
      return
    }
    setSelectedCategory(selectedTrackInfo.name)
  }, [selectedTrackInfo])

  const handleCreateTrack = () => {
    const trackId = createTrack(selectedCategory)
    setSelectedTrack(String(trackId))
  }

  const handleSetTrackType = () => {
    if (typeof selectedTrackId !== 'number') {
      return
    }
    setTrackCategory(selectedTrackId, selectedCategory)
  }

  const handleCreateClip = () => {
    if (typeof selectedTrackId !== 'number') {
      return
    }
    createClip({
      track: selectedTrackId,
      startTimeInMs: cursorTimestampAtInMs,
      category: selectedCategory,
    })
  }

  return (
    <div
      className={cn(
        'flex h-9 shrink-0 items-center gap-2 border-b border-white/10 bg-neutral-950 px-2 text-xs text-white/80'
      )}
    >
      <Select
        value={selectedCategory}
        onValueChange={(value) =>
          setSelectedCategory(value as ClapSegmentCategory)
        }
      >
        <SelectTrigger className="h-7 w-[132px] border-white/15 bg-white/5 text-xs text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TRACK_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="h-7 gap-1.5 px-2 text-xs"
        onClick={handleCreateTrack}
        title="Create track"
      >
        <ListPlus className="h-3.5 w-3.5" />
        Track
      </Button>

      <Select value={selectedTrack} onValueChange={setSelectedTrack}>
        <SelectTrigger className="h-7 w-[168px] border-white/15 bg-white/5 text-xs text-white">
          <SelectValue placeholder="Track" />
        </SelectTrigger>
        <SelectContent>
          {trackItems.map((track) => (
            <SelectItem key={track.id} value={String(track.id)}>
              {track.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="h-7 gap-1.5 px-2 text-xs"
        onClick={handleSetTrackType}
        disabled={!selectedTrackInfo}
        title="Set track type"
      >
        <Tags className="h-3.5 w-3.5" />
        Set Type
      </Button>

      <Button
        type="button"
        size="sm"
        className="h-7 gap-1.5 px-2 text-xs"
        onClick={handleCreateClip}
        disabled={!selectedTrackInfo}
        title="Create clip"
      >
        <Plus className="h-3.5 w-3.5" />
        Clip
      </Button>
    </div>
  )
}
