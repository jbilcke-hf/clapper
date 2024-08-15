import { LocationEntity } from "@/types"
import { ScreenplaySequenceType } from "@/constants"
import { createSimpleParser, getParserItemFromLabel } from "@/parsers/utils"

import { indoor, outdoor, data } from "./database"

export const parseIndoorLocations = createSimpleParser<LocationEntity>(indoor, ["aliases"])
export const parseOutdoorLocations = createSimpleParser<LocationEntity>(outdoor, ["aliases"])
export const parseLocations = createSimpleParser<LocationEntity>(data, ["aliases"])

export const parseLocationType = async (input: string[]): Promise<ScreenplaySequenceType> => {
          
  const parsedLocationsIndoor = await parseIndoorLocations(input)
  const parsedLocationsOutdoor = await parseOutdoorLocations(input)

  let parsedLocationType: ScreenplaySequenceType = "UNKNOWN"
  if (parsedLocationsIndoor.length && !parsedLocationsOutdoor.length) {
    parsedLocationType = "INTERIOR"
  } else if (!parsedLocationsIndoor.length && parsedLocationsOutdoor.length) {
    parsedLocationType = "EXTERIOR"
  } else if (parsedLocationsIndoor.length && !parsedLocationsOutdoor.length) {
    parsedLocationType = "INT./EXT."
  } else {
    parsedLocationType = "UNKNOWN"
  }
  return parsedLocationType
}


export const getLocation = getParserItemFromLabel(data)