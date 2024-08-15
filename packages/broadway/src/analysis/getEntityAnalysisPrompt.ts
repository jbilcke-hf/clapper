import { TemporaryAssetData } from "@/types"


const characterSpecific =
  `age, gender, physical characteristics, appearance, skin color, origins, clothes, costume etc..`
  
const locationSpecific =
  `location, country, era, orientation, appearance, color, lighting, texture..`
  
/**
 * A prompt template to generate nice descriptions of entities found in the movie
 * 
 * Here are some examples:
 * "CARIBBEAN SEA" (from pirates of the caribbean) ->
 *  "The Caribbean Sea is a vast expanse of warm blue-green water,
 * surrounded by lush green islands draped in palm trees, dotted with white sand beaches
 * and clear turquoise shallows. Soft sunlight filters down through a gentle haze,
 * and ripples shimmer on the surface"
 * 
 * "BOY" (from the babadook) ->
 * 
 * "BOY: 6-year-old Caucasian male with curly brown hair and light green eyes.
 * Wears blue short-sleeved t-shirt, white shorts, and blue slippers.
 * Skin has a light tan tone with freckles on the nose and cheeks"
 * 
 * @param name 
 * @param item 
 * @returns 
 */
export function getEntityAnalysisPrompt({
  name,
  asset,
  movieGenreLabel = "generic",
  movieEraLabel = "contemporary",
}: {
  name: string
  asset: TemporaryAssetData
  movieGenreLabel?: string
  movieEraLabel?: string
}) {

  // can we just use one for now?
  // maybe it's enough?
  const nbMaxStoryFragments = 1

  const sequences = asset.sequences.map(s => s.fullText)
  const firstStoryFragment = sequences.slice(0, nbMaxStoryFragments)

  const storyFragments = firstStoryFragment.join("\n")

  const prompt = `# context
you are studying the script of a movie, but you only have a few fragments of the story.
We have the following information about the movie,
the genre might be "${movieGenreLabel || "generic"}" and the story time period might be "${movieEraLabel || "contemporary"}", although it is not confirmed (use your best judgment).
# story fragments
\`\`\`
${storyFragments}
\`\`\`
# mission
You are an expert at analyzing movie scripts, and you need to write a spec to explain how does the ${asset.category} "${name}" looks like (note: it's possible the name contains a typo, no need to tell us about it)
Please give your answer in a very dense manner, about 2 sentences.
You need to describe anything that can be useful for someone else to draw or paint this "${name}":
${asset.category === "character" ? characterSpecific : locationSpecific}
# examples
Here are a few examples, but don’t copy them verbatim! They are taken from a pirate movie, which may be different from the current project:
- "FORT CHARLES JAIL CELLS": "British colonial fortress, buccaneering period, indoor setting, adjacent to cells, rectangular shape with stone and brick walls, gray color, lighting from torches, wooden beds, iron bars with damage, chain padlock, rusty metal lockers, cobblestone diamond patterned stone floor"
- "PORT ROYAL TOWN ALLEY": "urban, golden age of piracy, coastal city (Port Royal, Jamaica), alleyway in a semi-deserted neighborhood, brick walls, metal strips for street signs, fog, low light levels, wooden doors, asphalt, striped path leading to a blacksmith shop with barn doors, sign located above the entrance."
-  "HARBORMASTER": "Middle-aged, male, clean-shaven, salt-and-pepper hair and brown eyes, wearing a navy smock over a white shirt and brown pants, brown boots and brown hat, all with clean and crisp lines, standing against the dock backdrop with a sunbathed pale skin tone"
- "CAVES MAIN CAVERN": "South America, Aztec Empire, in 1518. Subterraneous, spherical room with a dome-shaped rocky ceiling and precipitous walls carved with Aztec glyphs."
- "DEADEYE" : "male, early 40s, with a scar passing over his left eye. Wears a leather coat that covers his left arm until the elbow. His skin has Mediterranean tone. Wears a black, wide-brimmed hat, underneath it he appears to naturally grow a mustache"
and another example, from a heist movie:
- "LEON": "leon, caucasian, male, 25 years old, 180cm tall, athletic build, sharp facial features, chiseled jawline, high cheekbones, angular nose, thin lips, piercing blue eyes, short black hair, slightly spiked, fair complexion"
- "LAVINGTON GALLERY": "contemporary era, neoclassical architecture, indoor setting, located in a city, glass ceiling, marble floor, white walls, spotlight illumination, paintings with vibrant colors, Greek columns, polished concrete structure, security cameras with red lights, students with hoodies or sunglasses, tour guides, staff-only doors"
- "SASHA": "female, caucasian, mid-30s, tall, slender, angular features, high cheekbones, sharp jawline, piercing green eyes, platinum blonde hair styled in a sleek bob, fair complexion, wears a fitted black suit with a white blouse, black pumps, and a black clutch purse"
# final guidelines
Remember, be synthetic, and don't recopy examples identically! do not talk about the purpose, objectives, meaning.. of the ${asset.category}.
We do not need an encyclopedic description, we need a VISUAL description. 
I repeat: give a VISUAL description, to help someone PAINT it!
Don't repeat the movie genre, we already know it.
Instead, only write about its physical properties, without bias or subjective interpretation (be direct, don't use terms like "reminiscent of" or "similar to").
You should use comma-separated word enumerations, to be even more compact and concise.
If things are unspecified, don't say "unspecified physical characteristics", never say "located in an unknown country" or "during an indeterminate era" etc.
Instead you should invent them (you are a cinema producer, so you need to know how to interpret a script) 
Please also write a definition that is independent from the current scene (a definition that can be used later).
important: don't write about the current scene specifically, like current action or position. Instead, you MUST write a neutral, multi-purpose description, suitable for future scenes.
Be sure of yourself, or shut up! Don't interprent by saying things like "we assume, seems to be, not enough context, according to, possibly a typo..)". Never say those things, there are irrelevant!
Don't comment on your action, don't tell me when you are not sure etc.
And only write using two sentences!
If you follow all the guidelines you will be rewarded with a tip.
# answer
"`
  return prompt
}