import { NamedEntity } from "@/types"
import { createSimpleParser, getParserItemFromLabel } from "@/parsers/utils"

import { data } from "./database"

export const parseLights = createSimpleParser<NamedEntity>(data, ["aliases"])

export const getLight = getParserItemFromLabel(data)