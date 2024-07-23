import {
  ClapProject,
  ClapSegment,
  ClapSegmentCategory,
  newClap,
  newSegment,
} from '@aitube/clap'

export async function getDemoGame() {
  const demo: ClapProject = newClap({
    meta: {
      title: 'Demo Game',
      isInteractive: true,
      // isLoop: true,
    },
  })

  const startTimeInMs = 0

  // 1 hour session
  const endTimeInMs = 60 * 60 * 1000

  const defaultMessage: ClapSegment = newSegment({
    track: 1,
    category: ClapSegmentCategory.INTERFACE,
    prompt: 'Hello world',
    label: 'Hello world',
    startTimeInMs,
    endTimeInMs,
  })
  demo.segments.push(defaultMessage)

  const aiShouldRespondToMessage: ClapSegment = newSegment({
    track: 2,
    category: ClapSegmentCategory.PHENOMENON,
    prompt: 'When the user asks a question, an assistant will answer',
    label: 'Assistant',
    startTimeInMs,
    endTimeInMs,
  })
  demo.segments.push(aiShouldRespondToMessage)

  // TODO: experiment with a pong game too

  return demo
}
