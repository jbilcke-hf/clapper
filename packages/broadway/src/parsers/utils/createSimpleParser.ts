import ParseEntities from "@datagica/parse-entities"

import { SimpleNamedEntityParser } from "@/types"

export function createSimpleParser<T>(
  data: T[] = [],
  fields = ['label','aliases'],
  ): SimpleNamedEntityParser {
  class Parser extends ParseEntities {
    constructor() { super({ fields, data }) }
  }
  const parser = new Parser()

  async function parse(inputs: string[] = [], defaultValues: string[] = [], removeDuplicates = true): Promise<string[]> {
    const validInputs = inputs.map(input => `${input || ""}`).map(x => x)
    if (!validInputs.length) {
      return []
    }

    const singleText = validInputs.join(".\n")

    let results = (await parser.parse(singleText) || []) as T[]

    // as an extra security
    if (!Array.isArray(results) || !results.length) {
      results = []
    }

    // used for deduplication
    const dedup = new Set<string>()

    const finalResult = results.map(entity => {
      const value = (entity as any).value?.label || ""

      // to identify duplicated, we normalize the keys
      const key = value.trim().toLocaleLowerCase()

      // remove duplicates
      if (removeDuplicates) {
        if (dedup.has(key)) { return "" }
        dedup.add(key)
      }

      return value
    }).filter(value => value)

    if (!finalResult.length) {
      return defaultValues
    } else {
      return finalResult
    }
  }

  return parse
}