import { tmpdir } from "node:os"
import { join } from "node:path"
import { mkdtemp } from "node:fs/promises"

import { UUID } from "./uuid"

export async function getRandomDirectory(): Promise<string> {
  return mkdtemp(join(tmpdir(), UUID()))
}