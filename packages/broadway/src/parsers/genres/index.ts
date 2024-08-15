import { NamedEntity } from "@/types"
import { createOccurrenceCounter, createSimpleParser, getParserItemFromLabel } from "@/parsers/utils"

import { data } from "./database"

export const parseGenres = createSimpleParser<NamedEntity>(data, ["aliases"])

export const getMostProbableGenres = createOccurrenceCounter(parseGenres)

export const getGenre = getParserItemFromLabel(data)