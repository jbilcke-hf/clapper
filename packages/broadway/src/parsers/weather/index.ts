import { NamedEntity } from "@/types"
import { createSimpleParser, getParserItemFromLabel } from "@/parsers/utils"

import { data } from "./database"

export const parseWeather = createSimpleParser<NamedEntity>(data, ["aliases"])

export const getWeather = getParserItemFromLabel(data)