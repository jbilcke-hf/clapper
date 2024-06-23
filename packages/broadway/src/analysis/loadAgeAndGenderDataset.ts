import { ClapEntityGender } from "@aitube/clap"

import { normalizeName } from "./normalizeName"

export type AgeNameGenderStats = [ClapEntityGender, number, number]

export type NameToStats = Record<string, AgeNameGenderStats[]>

export const state: {
  isReady: boolean

  nameToStats: NameToStats
} = {
  isReady: false,
  nameToStats: {},
}

const dirName = 'detection-of-age-and-gender'
const fileName = 'baby-names-us-year-of-birth-full.csv'
const storageFilePath = `${dirName}/${fileName}`

const DEFAULT_DOWNLOAD_URL = `https://clapper.app/datasets/${fileName}`

// note: this takes about 140 Mb of memory
// we store the dataset inside a big JSON in the IndexedDB
export async function loadAgeGenderNameStats(url = DEFAULT_DOWNLOAD_URL) : Promise<Record<string, AgeNameGenderStats[]>> {


  if (typeof window !== "undefined") {
    try {
      const { default: fs } = await import("indexeddb-fs")
      const rawCacheContent = await fs.readFile(storageFilePath) as string
      const cacheObject = JSON.parse(rawCacheContent) as NameToStats
      if (Object.keys(cacheObject).length === 0) {
        throw new Error(`cache is empty`)
      }
      return cacheObject
    } catch (err) {
      console.log(`couldn't load the cache, we will try to re-generate it`)
    }
  }

  let nameToStats = {} as NameToStats


  console.log(`downloading age and gender detection dataset from Hugging Face (jbilcke-hf/detection-of-age-and-gender)`)
  try {

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
  } catch (err) {
    console.error(`failed to fetch the dataset (${err})`)

    return nameToStats
  }

  if (typeof window !== "undefined") {

    console.log(`trying to save the dataset to the browser's IndexedDB for faster reload`)

    try {
      const { default: fs } = await import("indexeddb-fs")
      if (!await fs.isDirectory(dirName)) {
        await fs.createDirectory(dirName)
      }

      await fs.writeFile(storageFilePath, JSON.stringify(nameToStats))
    } catch (err) {
      console.error(`failed to store the cache (${err})`)
    }
  }

  return nameToStats
}
