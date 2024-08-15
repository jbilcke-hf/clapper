import { NamedEntity } from "@/types"
import { createSimpleParser, getParserItemFromLabel } from "@/parsers/utils"

import { data } from "./database"

export const parseSounds = createSimpleParser<NamedEntity>(data)

export const getSound = getParserItemFromLabel(data)