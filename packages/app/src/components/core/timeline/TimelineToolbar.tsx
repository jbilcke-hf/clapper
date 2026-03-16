'use client'

import { useState } from 'react'
import { useTimeline } from '@aitube/timeline'
import { ClapSegmentCategory } from '@aitube/clap'
import { Plus, ListPlus } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TRACK_CATEGORIES: { value: ClapSegmentCategory; label: string }[] = [
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
]

export function TimelineToolbar() {
  const [selectedCategory, setSelectedCategory] = useState<ClapSegmentCategory>(
    ClapSegmentCategory.VIDEO
  )
  const [selectedTrack, setSelectedTrack] = useState<string>('')

  const tracks = useTimeline((s) => s.tracks)
  const createTrack = useTimeline((s) => s.createTrack)
  const createClip = useTimeline((s) => s.createClip)
  const cursorTimestampAtInMs = useTimeline((s) => s.cursorTimestampAtInMs)

  const handleCreateTrack = () => {
    const newTrackId = createTrack(selectedCategory)
    setSelectedTrack(String(newTrackId))
  }

  const handleCreateClip = async () => {
    const trackNumber = selectedTrack ? parseInt(selectedTrack, 10) : -1
    if (trackNumber < 0 || !tracks[trackNumber]) return

    await createClip({
      track: trackNumber,
      startTimeInMs: cursorTimestampAtInMs || 0,
      category: selectedCategory,
    })
  }

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-2',
        'h-7 px-2',
        'text-xs text-white/70'
      )}
    >
      <Select
        value={selectedCategory}
        onValueChange={(val) => setSelectedCategory(val as ClapSegmentCategory)}
      >
        <SelectTrigger className="h-5 w-[110px] border-white/20 bg-transparent text-xs">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {TRACK_CATEGORIES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={handleCreateTrack}
        className={cn(
          'flex items-center gap-1 rounded px-1.5 py-0.5',
          'bg-white/10 hover:bg-white/20',
          'transition-colors'
        )}
        title="Create a new track with the selected category"
      >
        <ListPlus className="h-3.5 w-3.5" />
        <span>Track</span>
      </button>

      <Select value={selectedTrack} onValueChange={setSelectedTrack}>
        <SelectTrigger className="h-5 w-[130px] border-white/20 bg-transparent text-xs">
          <SelectValue placeholder="Select track" />
        </SelectTrigger>
        <SelectContent>
          {tracks.map((track) => (
            <SelectItem key={track.id} value={String(track.id)}>
              Track {track.id} ({track.name})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={handleCreateClip}
        disabled={!selectedTrack}
        className={cn(
          'flex items-center gap-1 rounded px-1.5 py-0.5',
          'bg-white/10 hover:bg-white/20',
          'transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-40'
        )}
        title="Create a new clip on the selected track at the cursor position"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Clip</span>
      </button>
    </div>
  )
}
