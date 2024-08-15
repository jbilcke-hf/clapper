import {
  AssistantAction,
  AssistantInput,
  AssistantMessage,
} from '@aitube/clapper-services'

// Note: the LLM doesn't need to knwo about those types of things:
/*
    {
      "segmentId": 1,
      "prompt": "",
      "startTimeInMs": 767000,
      "endTimeInMs": 769000,
      "category": "STORYBOARD"
    },
    {
      "segmentId": 2,
      "prompt": "dimly lit, suspenseful, cinematic photo, movie screencap, contemporary.",
      "startTimeInMs": 767000,
      "endTimeInMs": 769000,
      "category": "STYLE"
    },
    {
      "segmentId": 3,
      "prompt": "",
      "startTimeInMs": 769000,
      "endTimeInMs": 771000,
      "category": "STORYBOARD"
    },
    {
      "segmentId": 4,
      "prompt": "dimly lit, suspenseful, cinematic photo, movie screencap, contemporary.",
      "startTimeInMs": 769000,
      "endTimeInMs": 771000,
      "category": "STYLE"
    },
    */

export const storyCompletionInputExample: AssistantInput = {
  directorRequest: 'complete this scene',
  storyBlocks: [
    {
      blockId: 0,
      block: `The scene is set at night.
The character wears a jacket.
He struggles to keep up with the van he is tailing, and tries to contact someone over the radio.
`,
    },
  ],
  sceneSegments: [
    {
      segmentId: 0,
      prompt: 'Medium-shot',
      startTimeInMs: 767000,
      endTimeInMs: 769000,
      category: 'CAMERA',
    },
    {
      segmentId: 1,
      prompt: 'Medium-shot',
      startTimeInMs: 769000,
      endTimeInMs: 771000,
      category: 'CAMERA',
    },
  ],
}

export const storyCompletionOutputExample: AssistantMessage = {
  comment:
    "Here's my interpretation of the car chase, limiting myself to the given timecode range. Let me know if you need me to change anything in the scene!",
  action: AssistantAction.UPDATE_STORY_AND_SCENE,
  updatedStoryBlocks: [
    {
      blockId: 0,
      block: `The scene is set at night, and features ARCHER, a 38yo male.
ARCHER has chestnut hair in slicked-undercut style, short-boxed beard, green eyes, diamond-shaped head with round metal glasses.
ARCHER wears a weathered brown leather jacket over a white shirt, with faded blue jeans.
ARCHER struggles to keep up with the van he is tailing, and tries to contact someone over the radio.
`,
    },
  ],
  updatedSceneSegments: [
    {
      segmentId: 0,
      prompt: 'Long shot',
      startTimeInMs: 767000,
      endTimeInMs: 769000,
      category: 'CAMERA',
    },
    {
      segmentId: 2,
      prompt: "ARCHER'S SEDAN, a black 2019 Ford Fusion.",
      startTimeInMs: 767000,
      endTimeInMs: 771000,
      category: 'LOCATION',
    },
    {
      segmentId: 3,
      prompt: 'Outdoor, suburb streets.',
      startTimeInMs: 767000,
      endTimeInMs: 771000,
      category: 'LOCATION',
    },
    {
      segmentId: 4,
      prompt: 'At night, street lights.',
      startTimeInMs: 767000,
      endTimeInMs: 771000,
      category: 'LIGHTING',
    },
    {
      segmentId: 5,
      prompt:
        'Archer is a 38yo male, chestnut hair in slicked-undercut style, short-boxed beard, green eyes, diamond-shaped head with round metal glasses, he wears a weathered brown leather jacket over a white shirt, with faded blue jeans.',
      startTimeInMs: 767000,
      endTimeInMs: 771000,
      category: 'CHARACTER',
    },
    {
      segmentId: 6,
      prompt:
        'Archer slams his hands on the steering wheel, frustration etched into every line of his face.',
      startTimeInMs: 767000,
      endTimeInMs: 769000,
      category: 'ACTION',
    },
    {
      segmentId: 7,
      prompt: 'Shit--',
      startTimeInMs: 767000,
      endTimeInMs: 769000,
      category: 'DIALOGUE',
    },
    {
      segmentId: 8,
      prompt: 'At night, street lights.',
      startTimeInMs: 767000,
      endTimeInMs: 771000,
      category: 'LIGHTING',
    },
    {
      segmentId: 9,
      prompt: 'Muffled sound of the interior of a car.',
      startTimeInMs: 767000,
      endTimeInMs: 769000,
      category: 'SOUND',
    },
    {
      segmentId: 10,
      prompt: 'Tense instrumental electronic music, fast paced.',
      startTimeInMs: 767000,
      endTimeInMs: 771000,
      category: 'MUSIC',
    },
    {
      segmentId: 1,
      prompt: 'Panning shot',
      startTimeInMs: 769000,
      endTimeInMs: 771000,
      category: 'CAMERA',
    },

    {
      segmentId: 11,
      prompt:
        'Archer frantically reaches for his radio again while eyeing the vanishing tail lights of the van.',
      startTimeInMs: 769000,
      endTimeInMs: 771000,
      category: 'ACTION',
    },
    {
      segmentId: 12,
      prompt: 'Come on.. where is it..',
      startTimeInMs: 769000,
      endTimeInMs: 771000,
      category: 'DIALOGUE',
    },
    {
      segmentId: 13,
      prompt: 'At night, street lights.',
      startTimeInMs: 769000,
      endTimeInMs: 771000,
      category: 'SOUND',
    },
    {
      segmentId: 14,
      prompt: 'Muffled sound of an engine revving in the interior of a car.',
      startTimeInMs: 769000,
      endTimeInMs: 771000,
      category: 'SOUND',
    },
  ],
}

export const analysisInputExample: AssistantInput = {
  directorRequest: 'what can you tell me about the current scene',
  storyBlocks: [
    {
      blockId: 0,
      block: '',
    },
    {
      blockId: 1,
      block: "LEON'S INTERNALS (V.O)",
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
  updatedStoryBlocks: [],
  updatedSceneSegments: [],
}

export const redTruckInputExample: AssistantInput = {
  directorRequest: 'can u make the truck red thank',
  storyBlocks: [
    {
      blockId: 42,
      block: 'He says he has a pickup truck, and can drive to the city.',
    },
    {
      blockId: 50,
      block:
        'The camera is panning over a pick truck driving over the highway.',
    },
  ],
  sceneSegments: [
    {
      segmentId: 0,
      prompt: 'Long shot',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'CAMERA',
    },
    {
      segmentId: 1,
      prompt: 'A dull highway',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'LOCATION',
    },
    {
      segmentId: 2,
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
  updatedStoryBlocks: [
    {
      blockId: 42,
      block: 'He says he has a red pickup truck, and can drive to the city.',
    },
    {
      blockId: 50,
      block:
        'The camera is panning over a red pickup truck driving over the highway.',
    },
  ],
  updatedSceneSegments: [
    {
      segmentId: 0,
      prompt: 'Long shot',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'CAMERA',
    },
    {
      segmentId: 1,
      prompt: 'A dull highway',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'LOCATION',
    },
    {
      segmentId: 2,
      prompt: 'wind, birds',
      startTimeInMs: 0,
      endTimeInMs: 5000,
      category: 'SOUND',
    },
    {
      segmentId: 3,
      prompt: 'a red pick-up truck is passing by',
      startTimeInMs: 1000,
      endTimeInMs: 4000,
      category: 'ACTION',
    },
    {
      segmentId: 4,
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
  storyBlocks: [
    {
      blockId: 72,
      block: 'The scene is set during the day.',
    },
    {
      blockId: 73,
      block: 'Bright sun with clear sky.',
    },
    {
      blockId: 74,
      block: 'We can see a highway.',
    },
  ],
  sceneSegments: [
    {
      segmentId: 0,
      prompt: 'Long shot',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'CAMERA',
    },
    {
      segmentId: 1,
      prompt: 'Highway',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'LOCATION',
    },
    {
      segmentId: 2,
      prompt: 'Clear sky',
      startTimeInMs: 25000,
      endTimeInMs: 30000,
      category: 'WEATHER',
    },
  ],
}

export const lightRainOutputExample: AssistantMessage = {
  comment:
    'I have added some light raining to set a darker tone, and produce nice reflections on the ground? also make it twice as long please.',
  action: AssistantAction.UPDATE_STORY_AND_SCENE,
  updatedStoryBlocks: [
    {
      blockId: 72,
      block: 'The scene is set during the evening.',
    },
    {
      blockId: 73,
      block: 'Cloudy sky, with light rain.',
    },
    {
      blockId: 74,
      block: 'We can see a highway.',
    },
    {
      blockId: 75,
      block: 'The road is wet.',
    },
  ],
  updatedSceneSegments: [
    {
      segmentId: 0,
      prompt: 'Long shot',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'CAMERA',
    },
    {
      segmentId: 1,
      prompt: 'Highway',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'LOCATION',
    },
    {
      segmentId: 2,
      prompt: 'Light rain',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'WEATHER',
    },
  ],
}

export const lightRainInputExample: AssistantInput = {
  directorRequest: 'nope, should be stronger, with a panning camera please.',
  storyBlocks: [
    {
      blockId: 72,
      block: 'The scene is set during the evening.',
    },
    {
      blockId: 73,
      block: 'Cloudy sky, with light rain.',
    },
    {
      blockId: 74,
      block: 'We can see a highway.',
    },
    {
      blockId: 75,
      block: 'The road is wet.',
    },
  ],
  sceneSegments: [
    {
      segmentId: 0,
      prompt: 'Long shot',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'CAMERA',
    },
    {
      segmentId: 1,
      prompt: 'Highway',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'LOCATION',
    },
    {
      segmentId: 2,
      prompt: 'Light rain',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'WEATHER',
    },
  ],
}

export const heavyRainOutputExample: AssistantMessage = {
  comment: "I understand, I've switched to a heavy rain.",
  action: AssistantAction.UPDATE_STORY_AND_SCENE,
  updatedStoryBlocks: [
    {
      blockId: 72,
      block: 'The scene is set during the evening.',
    },
    {
      blockId: 73,
      block: 'Stormy sky, with heavy rain.',
    },
    {
      blockId: 74,
      block: 'We can see a highway.',
    },
    {
      blockId: 75,
      block: 'Downpours of water fall on the road.',
    },
  ],
  updatedSceneSegments: [
    {
      segmentId: 0,
      prompt: 'Panning shot',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'CAMERA',
    },
    {
      segmentId: 1,
      prompt: 'Highway',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'LOCATION',
    },
    {
      segmentId: 2,
      prompt: 'Heavy rain',
      startTimeInMs: 25000,
      endTimeInMs: 35000,
      category: 'WEATHER',
    },
  ],
}
