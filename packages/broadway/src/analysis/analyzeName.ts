import { ClapEntityGender } from "@aitube/clap"

import { ExtractedCharacterName, parseNames } from "@/parsers/names"

import { guessAgeAndGender } from "./guessAgeAndGender"

export async function analyzeName(entity: string): Promise<{
  name: string
  age: number
  gender: ClapEntityGender
  yearOfBirth: number
}> {
  let names: ExtractedCharacterName[] = []
  try {
    names = await parseNames(entity)

  } catch (err) {
    console.error(`Failed to parse the names in ${entity}: ${err}`)
  }

  const value = {
    name: entity,
    gender: "female" as ClapEntityGender,
    age: 30,
    yearOfBirth: (new Date().getFullYear()) - 30,
  }

  const matchedFirstName = names[0]?.value

  if (matchedFirstName?.name) {

    value.name = matchedFirstName.name.charAt(0).toUpperCase() + matchedFirstName.name.slice(1)
    
    const genderFallback = matchedFirstName.gender[0] || "f"

    value.gender =
      genderFallback === "m" ? "male" :
      genderFallback === "f" ? "female" :
      value.gender
  }

  // TODO: we can pass a second parameter, the reference year,
  // which could be the year in which the movie is set
  const stats = await guessAgeAndGender(value.name) // <- pass the reference year!

  if (stats) {
    value.age = stats.age
    value.gender = stats.gender
    value.yearOfBirth = stats.yearOfBirth
  }

  return value
}