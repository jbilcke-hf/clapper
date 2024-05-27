import { ClapEntityGender } from "@aitube/clap"

import { normalizeName } from "./normalizeName"

export type AgeNameGenderStats = [ClapEntityGender, number, number]

const CACHE_KEY = "AGE_AND_GENDER_DATASET"

export const state: {
  isReady: boolean
  
  // unfortunately we cannot use this kind of caching for now,
  // as this is Node-only, and break when used in the browser
  // import Cache, { FileSystemCache } from "file-system-cache"
  //cache?: FileSystemCache

  nameToStats: Record<string, AgeNameGenderStats[]>
} = {
  isReady: false,
  // cache: undefined,
  nameToStats: {},
}

// note: this takes about 140 Mb of memory
export async function loadAgeGenderNameStats() {
  let nameToStats = {} as Record<string, AgeNameGenderStats[]>

  // unfortunately we cannot use this kind of caching for now,
  // as this is Node-only, and break when used in the browser
  // import Cache, { FileSystemCache } from "file-system-cache"
  // if (typeof window === "undefined") {
  //   if (!state.cache) {
  //     state.cache = Cache({
  //       basePath: ".age_and_gender_dataset_cache", // await getRandomDirectory()
  //       ttl: 30 * 24 * 60  // (optional) A time-to-live (in secs) on how long an item remains cached.
  //     });
  //   }
  // 
  // 
  //   try {
  //     const rawString = await state.cache.get(CACHE_KEY)
  //     nameToStats = JSON.parse(rawString) as Record<string, AgeNameGenderStats[]>
  //     if (Object.keys(nameToStats).length === 0) {
  //       throw new Error(`failed to load the dataset`)
  //     }
  //     return nameToStats
  //   } catch (err) {
  //     nameToStats = {}
  //   }
  // }

  const url = "https://huggingface.co/datasets/jbilcke-hf/detection-of-age-and-gender/resolve/main/baby-names-us-year-of-birth-full.csv?download=true"

  console.log(`downloading age and gender detection dataset from Hugging Face (jbilcke-hf/detection-of-age-and-gender)`)
  
  const res = await fetch(url)
  const rawData = await res.text()

  rawData.split("\n").forEach(line => {
    const [yearOfBirth, name, gender, numberOfBirths] = line.trim().split(",")
    
    const key = normalizeName(name)

    if (!key) { return }

    if (!nameToStats[key]) {
      nameToStats[key] = []
    }
    nameToStats[key].push([
      gender === "F" ? "female" : "male",
      Number(numberOfBirths),
      Number(yearOfBirth),
    ])

    nameToStats[key].sort((a, b) => b[1] - a[1])
  })

  // unfortunately we cannot use this kind of caching for now,
  // as this is Node-only, and break when used in the browser
  // import Cache, { FileSystemCache } from "file-system-cache"
  // if (typeof window === "undefined" && state.cache) {
  //   try {
  //     await state.cache.set(CACHE_KEY, JSON.stringify(nameToStats))
  //   } catch (err) {
  //     console.error(`failed to cache the dataset: ${err}`)
  //   }
  // }
  return nameToStats
}
