// should we really have default prompts in here?
// I think they should probably be defined at the applicative software layer (ie. in the client)

export function addWordsIfNotPartOfThePrompt(prompt: string = "", words: string[] = []): string {
  const promptWords = prompt.split(",").map(w => w.trim().toLocaleLowerCase())

  return [
    prompt,
    // we add our keywords, unless they are already part of the prompt
    ...words.filter(w => !promptWords.includes(w.toLocaleLowerCase()))
  ].join(", ")
}

 export function getPositivePrompt(prompt: string = "", triggerWord = "") {
  return addWordsIfNotPartOfThePrompt(prompt, [
    "cinematic photo",
    triggerWord,
    "sublime",
    "pro quality",
    "sharp",
    "crisp",
    "beautiful",
    "impressive",
    "amazing",
    "4K",
    "hd"
  ])
}

export function getNegativePrompt(prompt: string = "") {
  return addWordsIfNotPartOfThePrompt(prompt, [
    "cropped",
    // "underexposed", // <-- can be a desired style
    // "overexposed", // <-- can be a desired style
    "logo",
    "hud",
    "ui",
    "censored",
    "blurry",
    "watermark",
    "watermarked",
    "copyright",
    "extra digit",
    "fewer digits",
    "bad fingers",
    "bad quality",
    "worst quality",
    "low quality",
    "low resolution",
    "glitch", // <-- keep or not? could be a desired style?
    // "deformed",
    // "mutated",
    // "ugly",
    // "disfigured",
    // "3D render", // <-- keep or not? could be a desired style?
    "signature"
  ])
}