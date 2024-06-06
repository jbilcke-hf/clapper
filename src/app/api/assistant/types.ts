import z from "zod"
import { ClapSegmentCategory } from "@aitube/clap"

export type LLMGeneratedFacet = {
  // I've put comments about typical details to provides
  category:
    | "weather" // "rainy", "cloudy sky", "soft mist", etc..
    | "clothes" // "roman toga", "brown gucci vest", etc..
    | "era" // "early 1800", "in 1995", "during WWII", etc..
    | "location" // "in the alps", "in a sand desert", etc..
    | "lighting" // "candle lit", "direct sunlight", "neon lights" etc
    | "camera" // "medium shot", "close-up shot", etc..
    | "character" // "male viking, in his 20s, brown hair, scar across the face, looking resolute" and so on

  // use a synthetic description depending on the category "roman toga", "candle lights", "in early 1800", "cloudy sky" etc (can be 2 sentences long at most)
  // but DO NOT add context such as "common in this time period", "accentuating the tension in the scene":
  // we want only information that can be used by the team to reconstruct the scene in details
  details: string
}

export type LLMGeneratedTake = {
  summary: string // the summary of the take
  composition: LLMGeneratedFacet[] // list of about 8-12 facets (some facets can be repeated eg. the character, sound etc but it wouldn't make sense to repeat some other type of facets such as the era, weather or camera. Use your best judgement!)
}

export const llmGeneratedFacetZ = z.object({
  // index: z.number().describe("array index"),
  category: z.enum([
    "weather", // "rainy", "cloudy sky", "soft mist", etc..
    "clothes", // "roman toga", "brown gucci vest", etc..
    "era", // "early 1800", "in 1995", "during WWII", etc..
    "location", // "in the alps", "in a sand desert", etc..
    "lighting", // "candle lit", "direct sunlight", "neon lights" etc
    "camera", // "medium shot", "close-up shot", etc..
    "character", // "male viking, in his 20s, brown hair, scar across the face, looking resolute" and so on
  ]).describe(`Category of the facet (can be one of: ${
    [
      "weather", // "rainy", "cloudy sky", "soft mist", etc..
      "clothes", // "roman toga", "brown gucci vest", etc..
      "era", // "early 1800", "in 1995", "during WWII", etc..
      "location", // "in the alps", "in a sand desert", etc..
      "lighting", // "candle lit", "direct sunlight", "neon lights" etc
      "camera", // "medium shot", "close-up shot", etc..
      "character", // "male viking, in his 20s, brown hair, scar across the face, looking resolute" and so on
    ].join(", ")
  })`),
  details: z.string().describe(`Facet category type (can be one of: ${
    Object.keys(ClapSegmentCategory).join(", ")
  })`),
})

export const llmGeneratedTakesZ = z.array(z.object({
  summary: z.string().describe("the summary of the take"),
  composition: z.array(
    llmGeneratedFacetZ
  ).describe(`list of about 8-12 facets (some facets can be repeated eg. the character, sound etc but it wouldn't make sense to repeat some other type of facets such as the era, weather or camera. Use your best judgement!)`)
}))


/**
 * We use a simplified representation of what is a segment
 */
export type SimplifiedSegmentData = {
  // index: number
  prompt: string
  category: string
}

export const simplifiedSegmentDataZ = z.object({
  // index: z.number().describe("array index"),
  prompt: z.string().describe("Caption describing this facet of the scene"),
  category: z.string().describe(`Facet category type (can be one of: ${
    Object.keys(ClapSegmentCategory).join(", ")
  })`)
})
