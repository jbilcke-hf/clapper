import { ClapEntityGender } from "@aitube/clap"

import { loadAgeGenderNameStats, state } from "./loadAgeAndGenderDataset"
import { normalizeName } from "./normalizeName"

export async function guessAgeAndGender(name: string, referenceYear?: number): Promise<{
  age: number
  gender: ClapEntityGender
  yearOfBirth: number
} | undefined> {
  if (!state.isReady) {
    state.nameToStats = await loadAgeGenderNameStats()
    state.isReady = true
  }

  const key = normalizeName(name)
  
  let allYears = state.nameToStats[key]
  allYears = Array.isArray(allYears) ? allYears : []

  const refYear: number = typeof referenceYear === "number" && !isNaN(referenceYear) && isFinite(referenceYear)
    ? referenceYear
    : new Date().getFullYear()
  
  
  // make sure we only keep valid years, in a reasonable range:
  const validYears = allYears.filter(y => 
     ((refYear - 40) < y[2]) && (y[2] < refYear - 2)
  )

  // we could try to see the top nth matches, and use the average gender
  // console.log("validYears:", validYears)

  let countGender: Record<ClapEntityGender, number> = {
    male: 0,
    female: 0,
    person: 0,
    object: 0,
  }

  const match = Array.isArray(validYears) && validYears[0] || undefined
  
  if (match) {

    validYears.forEach(y => {
      countGender[y[0]] += 1
    })

    const topGender: ClapEntityGender =
      countGender.male > countGender.female
      ? "male"
      : "female"

    return {
      yearOfBirth: match[2],
      age: refYear - match[2],
      gender: topGender,
    }
  }

  return undefined
}