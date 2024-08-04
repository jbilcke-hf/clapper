import z from 'zod'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { ClapSegmentCategory } from '@aitube/clap'
import { AssistantAction } from '@aitube/clapper-services'

export const zAssistantAction = z
  .nativeEnum(AssistantAction)
  .describe('The type of action to perform within the video editor.')

export const zClapSegmentCategory = z.nativeEnum(ClapSegmentCategory).describe(
  `Type of the facet, is it about sound, music, visuals etc (the most commonly used types are ${[
    ClapSegmentCategory.ACTION,
    ClapSegmentCategory.DIALOGUE,
    ClapSegmentCategory.WEATHER,
    // ERA should be deprecated, TIME is a better and more generic approach
    ClapSegmentCategory.ERA, // "early 1800", "in 1995", "during WWII", etc..
    ClapSegmentCategory.TIME, // "early 1800", "in 1995", "during WWII", etc..
    ClapSegmentCategory.LOCATION, // "in the alps", "in a sand desert", etc..
    ClapSegmentCategory.LIGHTING, // "candle lit", "direct sunlight", "neon lights" etc
    ClapSegmentCategory.CAMERA, // "medium shot", "close-up shot", etc..
    ClapSegmentCategory.CHARACTER, // "male viking, in his 20s, brown hair, scar across the face, looking resolute" and so on
    ClapSegmentCategory.SOUND,
    ClapSegmentCategory.MUSIC,
  ].join(', ')})`
)

export const zAssistantSceneSegment = z.object({
  segmentId: z.number().describe('unique identifier'),
  prompt: z
    .string()
    .describe(
      'Textual description of one of the facets of the current scene, such as how it looks or sounds like. Each facet is temporally indexed (as segments in the movie timeline).'
    ),
  startTimeInMs: z
    .number()
    .describe(
      'Start position of the facet within a temporal story timeline (in millisec)'
    ),
  endTimeInMs: z
    .number()
    .describe(
      'Ending position of the facet within the story timeline (also in millisec)'
    ),
  category: zClapSegmentCategory,
})

export const zAssistantStorySentence = z.object({
  sentenceId: z.number().describe('unique identifier'),
  sentence: z
    .string()
    .describe('A sentence extracted from the story plain-text.'),
})

export const zAssistantMessage = z.object({
  comment: z
    .string()
    .describe(
      'A free-form comment and chat message, allowing you to answer to the user directly.'
    ),
  action: zAssistantAction,
  updatedStorySentences: z.array(zAssistantStorySentence),
  updatedSceneSegments: z.array(zAssistantSceneSegment),
})

export const assistantMessageParser =
  StructuredOutputParser.fromZodSchema(zAssistantMessage)

export const formatInstructions = assistantMessageParser.getFormatInstructions()
