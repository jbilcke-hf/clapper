import { NamedEntity } from "@/types"
import { createOccurrenceCounter, createSimpleParser, getParserItemFromLabel } from "@/parsers/utils"

import { data } from "./database"

export const parseEras = createSimpleParser<NamedEntity>(data, ["aliases"])

export const getMostProbableEras = createOccurrenceCounter(parseEras)

export const getEra = getParserItemFromLabel(data)