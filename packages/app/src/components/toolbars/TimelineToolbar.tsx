'use client'

import { useState } from 'react'
import { useTimeline } from '@aitube/timeline'
import { ClapSegmentCategory } from '@aitube/clap'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Film } from 'lucide-react'

const TRACK_CATEGORIES = [
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.CAMERA,
  ClapSegmentCategory.ACTION,
  ClapSegmentCategory.CHARACTER,
  ClapSegmentCategory.LOCATION,
  ClapSegmentCategory.LIGHTING,
  ClapSegmentCategory.STYLE,
]

export function TimelineToolbar() {
  const [selectedCategory, setSelectedCategory] = useState<ClapSegmentCategory>(
    ClapSegmentCategory.VIDEO
  )
  const [selectedTrack, setSelectedTrack] = useState<number>(0)

  const createTrack = useTimeline((s) => s.createTrack)
  const createClip = useTimeline((s) => s.createClip)
  const tracks = useTimeline((s) => s.tracks)
  const cursorTimestampAtInMs = useTimeline((s) => s.cursorTimestampAtInMs)

  const handleCreateTrack = () => {
    const newTrackId = createTrack(selectedCategory)
    setSelectedTrack(newTrackId)
  }

  const handleCreateClip = async () => {
    if (selectedTrack === undefined) {
      alert('Please select a track first')
      return
    }

    const track = tracks[selectedTrack]
    if (!track) {
      alert('Invalid track selected')
      return
    }

    // Create clip at cursor position or at the beginning
    const startTimeInMs = cursorTimestampAtInMs || 0

    await createClip({
      track: selectedTrack,
      category: selectedCategory,
      startTimeInMs,
      prompt: `New ${selectedCategory} clip`,
    })
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-stone-900 border-b border-stone-800">
      <div className="flex items-center gap-2">
        <label className="text-sm text-stone-400">Category:</label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as ClapSegmentCategory)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {TRACK_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-stone-400">Track:</label>
        <Select
          value={selectedTrack.toString()}
          onValueChange={(value) => setSelectedTrack(parseInt(value))}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select track" />
          </SelectTrigger>
          <SelectContent>
            {tracks.map((track) => (
              <SelectItem key={track.id} value={track.id.toString()}>
                Track {track.id} ({track.name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleCreateTrack}
        size="sm"
        variant="outline"
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        New Track
      </Button>

      <Button
        onClick={handleCreateClip}
        size="sm"
        variant="default"
        className="gap-2"
      >
        <Film className="w-4 h-4" />
        New Clip
      </Button>
    </div>
  )
}
