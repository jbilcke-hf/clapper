import { SimpleNamedEntityParser, SimpleOccurrencesCounter } from "@/types"

export const createOccurrenceCounter = (parser: SimpleNamedEntityParser): SimpleOccurrencesCounter => {
  
  return async (input: string, minimumOccurrences: number): Promise<Record<string, number>>  => {
    
    const detected = await parser(
      [ input ],
      [],
      false // <- important: we keep duplicates, so we can count!
    )

    const stats: Record<string, number> = {}

    detected.forEach(value => {
      stats[value] = (stats[value] || 0) + 1
    })

    const finalStats: Record<string, number> = {}

    Object.entries(stats)
      .map(([key, value]) => {
        return { key: key, value: Number(value) }
      })
      .filter(a => a.value >= minimumOccurrences)
      .sort((a, b) => b.value - a.value)
      .forEach(s => {
        finalStats[s.key] = s.value
      })

    return finalStats
  }
}