
export const screenplaySequenceTypes = {
  "INTERIOR": "Indoor",
  "EXTERIOR": "Outdoor",
  "INT./EXT.": "Indoor/Outdoor",
  "UNKNOWN": "Unknown place",
}

export type ScreenplaySequenceType = keyof typeof screenplaySequenceTypes

// IMPORTANT: PUT SHORTER PATTERN AT THE END!!
export const screenplaySequenceTimes = {
  "CONTINUOUS": "", // we found this in some screenplay but.. what does it mean?
  "THAT MOMENT": "", // same here
  "THE SAME DAY": "Day",
  "THE NEXT DAY": "Day",
  "THE NEXT AFTERNOON": "Afternoon",
  "NEXT AFTERNOON": "Afternoon",
  "LATER AFTERNOON": "Afternoon",
  "SAME DAY": "Day",
  "NEXT DAY": "Day",
  "SAME TIME": "Day",
  "DAY FOR NIGHT": "Day for night",
  "PRE-DAWN": "At pre-dawn",
  "AT DAWN": "At dawn",
  "EARLY MORNING": "Early morning",
  "LATE MORNING": "Late morning",
  "EARLY EVENING": "Early evening",
  "LATE EVENING": "Late evening",
  "LATE NIGHT": "Night",
  "IN THE EVENING": "In the evening",
  "A FEW MOMENTS LATER": "Moments later",
  "FEW MOMENTS LATER": "Moments later",
  "MOMENTS LATER": "Moments later",
  "MOMENT LATER": "Moment later",
  "EVENING": "During the evening",
  "MIDNIGHT": "At midnight",
  "MORNING": "Morning",
  "AFTERNOON": "In the afternoon",
  "LATER": "Later",
  "NOON": "At noon",
  "DAWN": "Dawn",
  "SUNRISE": "Sunrise",
  "SUNSHINE": "Sunshine",
  "DUSK": "Dusk",
  "TWILIGHT": "Twilight",
  "DAY": "During day",
  "LATE": "Late",
  "NIGHT": "At night",
  "UNKNOWN": "Day",
}

export type ScreenplaySequenceTime = keyof typeof screenplaySequenceTimes