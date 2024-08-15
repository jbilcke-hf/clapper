import ParseEntities from "@datagica/parse-entities"

import { NamedEntity, NamedEntityParser, NamedEntityResult } from "@/types"

export function createParser(
  data: NamedEntity[] = [],
  fields = ['label','aliases']
  ): NamedEntityParser {
  class Parser extends ParseEntities {
    constructor() { super({ fields, data }) }
  }
  const parser = new Parser()

  return (input: string): Promise<NamedEntityResult[]> => (
    (parser.parse(input) as Promise<NamedEntityResult[]>)
  )
}