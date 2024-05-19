import { UUID } from "@aitube/clap"

import { tmpdir } from "node:os"
import { join } from "node:path"
import { mkdtemp } from "node:fs/promises"

export async function getRandomDirectory(): Promise<string> {
  return mkdtemp(join(tmpdir(), UUID()))
}