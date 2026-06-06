import { useState } from "react"
import { ClapSegmentCategory } from "@aitube/clap"

import { useTimeline } from "@/hooks"

const quickActionCategories = [
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.CAMERA,
  ClapSegmentCategory.ACTION,
  ClapSegmentCategory.GENERIC,
]

export function TimelineQuickActions() {
  const [category, setCategory] = useState<ClapSegmentCategory>(ClapSegmentCategory.VIDEO)
  const addTrack = useTimeline((s) => s.addTrack)
  const createClip = useTimeline((s) => s.createClip)
  const cursorTimestampAtInMs = useTimeline((s) => s.cursorTimestampAtInMs)

  return (
    <div
      className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-md border border-neutral-700/70 bg-neutral-950/85 px-3 py-2 text-xs text-white shadow-lg"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <label className="flex items-center gap-2">
        <span className="font-semibold text-neutral-300">Type</span>
        <select
          className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-white"
          value={category}
          onChange={(event) => setCategory(event.target.value as ClapSegmentCategory)}
        >
          {quickActionCategories.map((candidate) => (
            <option key={candidate} value={candidate}>
              {candidate}
            </option>
          ))}
        </select>
      </label>
      <button
        className="rounded bg-neutral-800 px-2 py-1 font-semibold hover:bg-neutral-700"
        type="button"
        onClick={() => addTrack({ category })}
      >
        Add track
      </button>
      <button
        className="rounded bg-yellow-500 px-2 py-1 font-semibold text-neutral-950 hover:bg-yellow-400"
        type="button"
        onClick={() => createClip({ category, startTimeInMs: cursorTimestampAtInMs })}
      >
        Add clip
      </button>
    </div>
  )
}
