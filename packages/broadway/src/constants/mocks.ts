import { ClapSegmentCategory } from "@aitube/clap"

// those are very random categories, so we don't use this as an example
// as this will looks unrealistic to potential customers
export const mockCategoryPrompts_misc: Record<ClapSegmentCategory, string[]> = {
  ACTION: [
    "eating a dinner",
    "looking at cellphones",
    "enjoying the view",
    "happy",
    "peaceful",
    "tense",
    "mysterious",
  ],
  CHARACTER: [
    "James",
    "Anna",
    "Alice",
    "Bob"
  ],
  LOCATION: [
    "train station in NYC",
    "inside a building",
    "below the Eiffel Tower",
    "in a fancy restaurant"
  ],
  TRANSITION: [
    "CUT TO"
  ],
  CAMERA: [
    "long wide establishing shot",
    "full shot",
    "medium-long shot",
    "medium shot",
    "medium close-up",
    "close-up",
    "extreme close-up",
    "extreme long shot",
    "American shot",
    "Italian shot",
    "trolley shot"
  ],
  LIGHTING: [
    "strong light",
    "soft light",
    "candlelit",
  ],
  TIME: [
    "in the morning, golden hour",
    "at noon",
    "during the day, sunlit",
    "in the evening, golden hour",
    "at night, moonlit"
  ],
  ERA: [
    "in the 60s",
    "in the 70s",
    "in the 80s",
    "modern era"
  ],
  WEATHER: [
    "cloudy, soft mist",
    "cloudy, in the fog",
    "sunny",
    "light cloud cover",
    "light rain",
    "heavy rain",
    "cloudy",
    "clouds with strong wind",
    // "storm"
  ],
  SOUND: [
    "street noise",
    "wind sound",
    "cafe noise",
    "chatty airport",
    "dog barking",
    "baby cooing",
    "cat meowing",
    "wind noise",
    "cafe ambiance",
    "steps sounds",
    "bag opening"
  ],
  MUSIC: [
    "soft electronic ambient",
    "energic electronic beat",
    "instrumental orchestra",
    "epic orchestral with strings",
    "soft pop-rock tune",
    "instrumental hip-hop",
    "atmospheric trip-hop",
    "lofi instrumental hiphop"
  ],
  
  DIALOGUE: [
    "saying hello",
    "asking for directions",
    "disagreeing",
    "threatening"
  ],

  STYLE: [
    "Mickael Bay",
    "Wes Anderson",
    "Studio Ghibli",
    "Moebius",
    "anime",
    "3D render",
    "documentary",
    "movie grain"
  ],

  /*
  colors: [
    "photorealist",
    "movie grain",
    ""
  ],
  */

  SPLAT: [],
  MESH: [],
  DEPTH: [],
  EVENT: [],
  EFFECT: [],
  INTERFACE: [],
  PHENOMENON: [],
  VIDEO: [],
  IMAGE: [],
  GROUP: [],
  GENERIC: [
    "Custom"
  ]
}


export const mockCategoryPrompts: Record<ClapSegmentCategory, string[]> = {
  ACTION: [
    "peaceful",
    "tense",
    "mysterious",
    "peaceful",
    "tense",
    "mysterious",
    "peaceful",
    "tense",
    "mysterious",
  ],
  CHARACTER: [
    "Henry",
    "Margaret",
    "Eleanor",
    "Elizabeth",
    "William",
    "Thomas",
    "Rackham",
    "Joseph",
    "Gideon",
    "Isaac"
  ],
  LOCATION: [
    "on the beach in the caribbean",
    "on the deck of a pirate ship",
    "in the captain's quarters of a pirate ship",
    "in a tropical forest",
  ],
  CAMERA: [
    "long wide establishing shot",
    "full shot",
    "medium-long shot",
    "medium shot",
    "medium close-up",
    "close-up",
    "extreme close-up",
    "extreme long shot",
    "American shot",
    "Italian shot",
    "trolley shot"
  ],
  LIGHTING: [
    "strong light",
    "soft light",
    "candlelit",
  ],
  TIME: [
    "in the morning, golden hour",
    "at noon",
    "during the day, sunlit",
    "in the evening, golden hour",
    "at night, moonlit"
  ],
  ERA: [
    // "in 1700",
    // "during piracy times"
  ],
  WEATHER: [
    "cloudy, soft mist",
    "cloudy, in the fog",
    "sunny",
    "light cloud cover",
    "light rain",
    "heavy rain",
    "cloudy",
    "clouds with strong wind",
    // "storm"
  ],
  SOUND: [
    "animal noise",
    "wind sound",
    "tropical sounds",
    "sea noises",
  ],
  MUSIC: [
    "cinematic music",
    "adventurous instrumental orchestra",
    "epic orchestral with strings",
    "cinematic instrumental orchestra",
    "suspensful instrumental orchestra",
    // "instrumental orchestra for sailing a ship, 1700",
    // "epic orchestral with strings, 1800",
    // "suspensful instrumental orchestra, 1700",
  ],
  TRANSITION: [
    "cut to"
  ],
  DIALOGUE: [
    "saying hello",
    "asking for directions",
    "disagreeing",
    "threatening"
  ],

  STYLE: [
    "movie screencap, film grain"
  ],

  /*
  colors: [
    "photorealist",
    "movie grain",
    ""
  ],
  */
  SPLAT: [],
  MESH: [],
  DEPTH: [],
  EVENT: [],
  EFFECT: [],
  INTERFACE: [],
  PHENOMENON: [],
  VIDEO: [],
  IMAGE: [],
  GROUP: [],
  GENERIC: [
    "Lorem ipsum"
  ]
}
