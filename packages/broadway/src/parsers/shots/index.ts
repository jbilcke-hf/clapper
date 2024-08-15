import { NamedEntity } from "@/types"
import { createSimpleParser, getParserItemFromLabel } from "@/parsers/utils"

import { data } from "./database"

export const parseShots = createSimpleParser<NamedEntity>(data, ["aliases"])

export const getShot = getParserItemFromLabel(data)