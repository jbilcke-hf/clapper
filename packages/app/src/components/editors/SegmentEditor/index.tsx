import { useEffect } from 'react'
import { TimelineSegment, useTimeline } from '@aitube/timeline'

import { FormInput } from '@/components/forms/FormInput'
import { FormSection } from '@/components/forms/FormSection'
import { useSegmentEditor } from '@/services'
import { ClapSegmentStatus } from '@aitube/clap'

export function SegmentEditor() {
  const segmentsChanged: number = useTimeline((s) => s.segmentsChanged)
  const selectedSegments: TimelineSegment[] = useTimeline(
    (s) => s.selectedSegments
  )
  const current = useSegmentEditor((s) => s.current)
  const setCurrent = useSegmentEditor((s) => s.setCurrent)
  const undo = useSegmentEditor((s) => s.undo)
  const redo = useSegmentEditor((s) => s.redo)

  useEffect(() => {
    setCurrent(selectedSegments.at(-1))
    // eslint-disable-next-line
  }, [setCurrent, selectedSegments.map((s) => s.id).join(',')])

  if (!current) {
    return (
      <FormSection label={'Segment Editor'} className="p-4">
        No segment selected.
      </FormSection>
    )
  }

  return (
    <FormSection label={'Segment Editor'} className="p-4">
      <FormInput<string>
        type="textarea"
        label={'Label'}
        value={current.label}
      />
      {/*
        <FormInput<string>
          label={"Prompt"}
          value={current.prompt}
          onChange={(newValue: string) => {
            setCurrent({
              ...current,
              prompt: newValue
            })
          }}
        />
        */}
      <div>
        <div>Created at:</div>
        <div>{current.createdAt || 'N.A.'}</div>
      </div>
    </FormSection>
  )
}
