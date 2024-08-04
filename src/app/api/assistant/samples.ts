import {
  AssistantAction,
  AssistantInput,
  AssistantMessage,
} from '@aitube/clapper-services'

export const analysisInputExample: AssistantInput = {
  directorRequest: 'what can you tell me about the current scene',
  storySentences: [
    {
      sentenceId: 0,
      sentence: '',
    },
    {
      sentenceId: 1,
      sentence: "LEON'S INTERNALS (V.O)",
    },
  ],
  sceneSegments: [
    {
      segmentId: 0,
      prompt:
        'dimly lit, suspenseful, cinematic photo, movie screencap, contemporary',
      startTimeInMs: 0,
      endTimeInMs: 2000,
      category: 'STYLE',
    },
    {
      segmentId: 1,
      prompt: 'LAVINGTON GALLERY',
      startTimeInMs: 0,
      endTimeInMs: 2000,
      category: 'LOCATION',
    },
    {
      segmentId: 2,
      prompt: 'Inside',
      startTimeInMs: 0,
      endTimeInMs: 2000,
      category: 'LOCATION',
    },
    {
      segmentId: 3,
      prompt: 'day',
      startTimeInMs: 0,
      endTimeInMs: 2000,
      category: 'LIGHTING',
    },
    {
      segmentId: 4,
      prompt: 'medium-long shot',
      startTimeInMs: 0,
      endTimeInMs: 2000,
      category: 'CAMERA',
    },
    {
      segmentId: 5,
      prompt:
        'Ethereal HEIST MUSIC builds the atmosphere as we are ushered through the neoclassical facade of the esteemed Lavington Gallery.',
      startTimeInMs: 0,
      endTimeInMs: 2000,
      category: 'ACTION',
    },
    {
      segmentId: 6,
      prompt: 'contemporary',
      startTimeInMs: 0,
      endTimeInMs: 2000,
      category: 'ERA',
    },
    {
      segmentId: 7,
      prompt:
        'cinematic instrumental orchestra, suspenseful, movie soundtrack, contemporary music',
      startTimeInMs: 0,
      endTimeInMs: 2000,
      category: 'MUSIC',
    },
  ],
}

export const analysisOutputExample: AssistantMessage = {
  comment: `Leon appears to be in a dimly lit setting within the prestigious Lavington Gallery. The scene is designed to evoke suspense, with ethereal heist music enhancing the tension. The mood is both cinematic and contemporary, featuring medium-long shots that capture the elegant neoclassical architecture of the gallery. 

Key elements include:
- **Internal Voice-over**: It suggests introspection or internal conflict for Leon, potentially hinting at a heist or critical decision.
- **Lighting & Style**: A visually suspenseful atmosphere is created through dim lighting and cinematic styling, aligning with the theme of a thrilling narrative.
- **Location Details**: The setting is significant; being in an established gallery hints at high stakes, possibly involving art theft or a dramatic encounter.

The combination of the music, visuals, and Leon's internal thoughts sets up a gripping atmosphere, promising intrigue and depth in his character's journey. Let me know if you want to make adjustments or need more specific insights!`,
  action: AssistantAction.NONE,
  updatedStorySentences: [],
  updatedSceneSegments: [],
}

export const redTruckInputExample: AssistantInput = {
  directorRequest: 'can u make the truck red thank',
  storySentences: [
    {
      sentenceId: 42,
      sentence: 'He says he has a pickup truck, and can drive to the city.',
    },
    {
      sentenceId: 50,
      sentence:
        'The camera is panning over a pick truck driving over the highway.',
    },
  ],
  sceneSegments: [
    {
      segmentId: 0,
      prompt: 'A dull highway',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'LOCATION',
    },
    {
      segmentId: 1,
      prompt: 'wind, birds',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'SOUND',
    },
  ],
}

export const redTruckOutputExample: AssistantMessage = {
  comment: 'I have added a red pickup truck.',
  action: AssistantAction.UPDATE_STORY_AND_SCENE,
  updatedStorySentences: [
    {
      sentenceId: 42,
      sentence: 'He says he has a red pickup truck, and can drive to the city.',
    },
    {
      sentenceId: 50,
      sentence:
        'The camera is panning over a red pickup truck driving over the highway.',
    },
  ],
  updatedSceneSegments: [
    {
      segmentId: 0,
      prompt: 'A dull highway',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'LOCATION',
    },
    {
      segmentId: 1,
      prompt: 'wind, birds',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'SOUND',
    },
    {
      segmentId: 2,
      prompt: 'a red pick-up truck is passing by',
      startTimeInMs: 1000,
      endTimeInMs: 4000,
      category: 'ACTION',
    },
    {
      segmentId: 3,
      prompt: 'engine noise of a truck passing by on a highway',
      startTimeInMs: 500,
      endTimeInMs: 4500,
      category: 'SOUND',
    },
  ],
}

export const clearSkyInputExample: AssistantInput = {
  directorRequest:
    "it looks a bit bland, any idea to set a darker mood and/or make the scene 'pop' more?",
  storySentences: [
    {
      sentenceId: 72,
      sentence: 'The scene is set during the day.',
    },
    {
      sentenceId: 73,
      sentence: 'Bright sun with clear sky.',
    },
    {
      sentenceId: 74,
      sentence: 'We can see a highway.',
    },
  ],
  sceneSegments: [
    {
      segmentId: 0,
      prompt: 'Highway',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'LOCATION',
    },
    {
      segmentId: 1,
      prompt: 'Clear sky',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'WEATHER',
    },
  ],
}

export const lightRainOutputExample: AssistantMessage = {
  comment:
    'I have added some light raining to set a darker tone, and produce nice reflections on the ground.',
  action: AssistantAction.UPDATE_STORY_AND_SCENE,
  updatedStorySentences: [
    {
      sentenceId: 72,
      sentence: 'The scene is set during the evening.',
    },
    {
      sentenceId: 73,
      sentence: 'Cloudy sky, with light rain.',
    },
    {
      sentenceId: 74,
      sentence: 'We can see a highway.',
    },
    {
      sentenceId: 75,
      sentence: 'The road is wet.',
    },
  ],
  updatedSceneSegments: [
    {
      segmentId: 0,
      prompt: 'Highway',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'LOCATION',
    },
    {
      segmentId: 1,
      prompt: 'Light rain',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'WEATHER',
    },
  ],
}

export const lightRainInputExample: AssistantInput = {
  directorRequest: 'nope, should be stronger',
  storySentences: [
    {
      sentenceId: 72,
      sentence: 'The scene is set during the evening.',
    },
    {
      sentenceId: 73,
      sentence: 'Cloudy sky, with light rain.',
    },
    {
      sentenceId: 74,
      sentence: 'We can see a highway.',
    },
    {
      sentenceId: 75,
      sentence: 'The road is wet.',
    },
  ],
  sceneSegments: [
    {
      segmentId: 0,
      prompt: 'Highway',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'LOCATION',
    },
    {
      segmentId: 1,
      prompt: 'Light rain',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'WEATHER',
    },
  ],
}

export const heavyRainOutputExample: AssistantMessage = {
  comment: "I understand, I've switched to a heavy rain.",
  action: AssistantAction.UPDATE_STORY_AND_SCENE,
  updatedStorySentences: [
    {
      sentenceId: 72,
      sentence: 'The scene is set during the evening.',
    },
    {
      sentenceId: 73,
      sentence: 'Stormy sky, with heavy rain.',
    },
    {
      sentenceId: 74,
      sentence: 'We can see a highway.',
    },
    {
      sentenceId: 75,
      sentence: 'Downpours of water fall on the road.',
    },
  ],
  updatedSceneSegments: [
    {
      segmentId: 0,
      prompt: 'Highway',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'LOCATION',
    },
    {
      segmentId: 1,
      prompt: 'Heavy rain',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'WEATHER',
    },
  ],
}
