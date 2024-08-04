import { newSegment } from '@aitube/clap'
import {
  AssistantMessage,
  AssistantSceneSegment,
} from '@aitube/clapper-services'
import {
  clapSegmentToTimelineSegment,
  DEFAULT_DURATION_IN_MS_PER_STEP,
  TimelineSegment,
  TimelineStore,
  useTimeline,
} from '@aitube/timeline'

import { useAssistant } from './useAssistant'

export async function updateStoryAndScene({
  assistantMessage,
  existingSegments,
}: {
  assistantMessage: AssistantMessage
  existingSegments: TimelineSegment[]
}) {
  console.log(`processActionOrMessage`)
  const { addEventToHistory } = useAssistant.getState()
  const timeline: TimelineStore = useTimeline.getState()
  const {
    addSegment,
    deleteSegments,
    findFreeTrack,
    trackSilentChangeInSegment,
    fitSegmentToAssetDuration,
  } = timeline

  let cursorInSteps = 0

  let segmentsToKeep: TimelineSegment[] = []
  let segmentsToAdd: TimelineSegment[] = []
  let segmentsToDelete: TimelineSegment[] = []
  let segmentsToUpdate: TimelineSegment[] = []

  existingSegments.forEach((existing, existingSegmentId) => {
    const newSegment: AssistantSceneSegment | undefined =
      assistantMessage.updatedSceneSegments.find(
        (newSegment) => newSegment.segmentId === existingSegmentId
      )
    if (!newSegment) {
      segmentsToDelete.push(existing)
    }
  })

  deleteSegments(segmentsToDelete.map((s) => s.id))

  for (const assistantSegment of assistantMessage.updatedSceneSegments) {
    // an end time (and duration) cannot be zero
    const timingLooksValid = assistantSegment.endTimeInMs > 0

    const startTimeInMs = timingLooksValid
      ? assistantSegment.startTimeInMs
      : cursorInSteps * DEFAULT_DURATION_IN_MS_PER_STEP

    const durationInSteps = 4
    const durationInMs = durationInSteps * DEFAULT_DURATION_IN_MS_PER_STEP
    const fallbackEndTimeInMs = startTimeInMs + durationInMs
    const endTimeInMs = timingLooksValid
      ? assistantSegment.endTimeInMs
      : fallbackEndTimeInMs

    const track = findFreeTrack({
      startTimeInMs,
      endTimeInMs,
    })

    const segment: TimelineSegment = await clapSegmentToTimelineSegment(
      newSegment({
        startTimeInMs,
        endTimeInMs,
        durationInMs: endTimeInMs - startTimeInMs,
        prompt: [assistantSegment.prompt],
        categoryName: assistantSegment.category,
        // outputType: ClapOutputType.TEXT,
      })
    )

    segment.track = track

    const existingSegment: TimelineSegment | undefined = existingSegments.find(
      (s, segmentId) => segmentId === assistantSegment.segmentId
    )

    if (existingSegment) {
      console.log('note: we do not support other types of changes for now')

      const segmentPromptHasChanged = segment.prompt !== existingSegment.prompt

      const segmentStartTimeHasChanged =
        segment.startTimeInMs !== existingSegment.startTimeInMs

      // note: we do not support changing the start time of a segment yet
      if (segmentStartTimeHasChanged) {
        console.error(
          `the assistant attempted to change a segment start time, but this operation isn't supported yet`,
          {
            segment,
          }
        )
      }

      const segmentLengthHasChanged =
        // segment.startTimeInMs !== existingSegment.startTimeInMs
        segment.endTimeInMs !== existingSegment.endTimeInMs

      // we do not support changing the category, as it wouldn't make much sense
      // segment.category !== existingSegment.category

      if (segmentPromptHasChanged || segmentLengthHasChanged) {
        segmentsToUpdate.push(segment)

        Object.assign(existingSegment, {
          prompt: segment.prompt,
          label: segment.prompt,
        })

        if (segmentLengthHasChanged) {
          await timeline.fitSegmentToAssetDuration(
            existingSegment,
            segment.endTimeInMs - existingSegment.startTimeInMs
          )
        }

        // tell the timeline that this individual segment should be redrawn
        trackSilentChangeInSegment(existingSegment.id)
      } else {
        segmentsToKeep.push(segment)
      }
    } else {
      segmentsToAdd.push(segment)
      await addSegment({
        segment,
        startTimeInMs: segment.startTimeInMs,
        track: segment.track,
      })
    }
  }

  console.log('Operations to perform:', {
    segmentsToAdd,
    segmentsToDelete,
    segmentsToKeep,
    segmentsToUpdate,
  })

  addEventToHistory({
    senderId: 'assistant',
    senderName: 'Assistant',
    message: assistantMessage.comment || 'The scene has been updated.',
  })
}
