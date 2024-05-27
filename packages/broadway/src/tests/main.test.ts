import { test, expect, describe } from "bun:test"
import { ClapProject, serializeClap } from "@aitube/clap"
import { readPlainText } from "@aitube/io"

import { parseScriptToClap } from ".."

// hack for Bun
require("./bun-shims.js")

describe("main demo", async () => {
  test("parseScriptToClap", async () => {
    const scriptName = "Afterglow v10 X Rewrite Bryan E. Harris 2023"
    const inputScriptFilePath = `./samples/scripts/${scriptName}.txt`
    const outputScriptFilePath = `./samples/claps/${scriptName}.clap`

    const script = await readPlainText(inputScriptFilePath)

    const clap: ClapProject = await parseScriptToClap(script)

    expect(clap.segments.length).toBe(3010)

    const blob = await serializeClap(clap)

    await Bun.write(outputScriptFilePath, blob)
  },

  // parsing a script will be slow the first time, as we need to download a dataset
  // example:
  // first time (need to download the dataset): [7.40s]
  // second time (with the dataset cached): [839.00ms]
  //
  // UPDATE:
  // we currently don't cache the result,
  // because this was too much platform-specific (file system caching, so for Node only)
  30000)
})