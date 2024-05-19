import parse from "@datagica/parse-names"

export type ExtractedCharacterName = {
  "ngram": string
  "value": {
    "id": string
    "name": string
    "culture": string[] // ["french"],
    "gender": string[] // ["m"]
  },
  "score": number,
  "position": {
    "sentence": number
    "word": number
    "begin": number
    "end": number
  }
}

export async function parseNames(text: string): Promise<ExtractedCharacterName[]> {

  const results = (await parse(text.trim().toLowerCase())) as ExtractedCharacterName[]

  if (!Array.isArray(results) || !results.length) {
    return []
  }

  // there might be duplicates, eg. "bárbara" and "barbara"
  return results.filter(item => item.value.name.trim().toLowerCase() === item.ngram.trim().toLowerCase())
}