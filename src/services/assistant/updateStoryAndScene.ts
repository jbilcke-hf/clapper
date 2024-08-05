import { ClapSegment, ClapSegmentCategory, newSegment } from '@aitube/clap'
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

    const prompt = assistantSegment.prompt
    const category =
      assistantSegment.category.toUpperCase() as ClapSegmentCategory

    const segmentProperties: Partial<ClapSegment> = {
      startTimeInMs,
      endTimeInMs,
      assetDurationInMs: endTimeInMs - startTimeInMs,
      prompt: prompt,
      label: prompt,
      category,
    }

    const segment: TimelineSegment = await clapSegmentToTimelineSegment(
      newSegment(segmentProperties)
    )

    const existingSegment: TimelineSegment | undefined = existingSegments.find(
      (s, segmentId) => segmentId === assistantSegment.segmentId
    )

    if (existingSegment) {
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

      console.log('found a match!', {
        segmentId: segment.id,
        segmentPrompt: segment.prompt,
        existingSegmentPrompt: existingSegment.prompt,
        segmentPromptHasChanged,
        segmentStartTimeHasChanged,
        segmentLengthHasChanged,
      })

      // we do not support changing the category, as it wouldn't make much sense
      // segment.category !== existingSegment.category

      if (segmentPromptHasChanged || segmentLengthHasChanged) {
        segmentsToUpdate.push(segment)

        if (segmentPromptHasChanged && segment.prompt) {
          console.log(`overwriting prompt with: ` + segment.prompt)
          Object.assign(existingSegment, {
            prompt: segment.prompt,
            label: segment.prompt,
          })
        }

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
      // if the LLM tries to add a new camera, we must
      // also create corresponding video and storyboards segments as well
      if (segment.category === ClapSegmentCategory.CAMERA) {
        segmentsToAdd.push(
          await clapSegmentToTimelineSegment(
            newSegment({
              ...segmentProperties,
              category: ClapSegmentCategory.VIDEO,
            })
          )
        )
        segmentsToAdd.push(
          await clapSegmentToTimelineSegment(
            newSegment({
              ...segmentProperties,
              category: ClapSegmentCategory.STORYBOARD,
            })
          )
        )
      }

      segmentsToAdd.push(segment)
    }
  }

  console.log('Operations to perform:', {
    segmentsToAdd,
    segmentsToDelete,
    segmentsToKeep,
    segmentsToUpdate,
  })

  for (const segment of segmentsToAdd) {
    await addSegment({ segment })
  }

  addEventToHistory({
    senderId: 'assistant',
    senderName: 'Assistant',
    message: assistantMessage.comment || 'The scene has been updated.',
  })
}
