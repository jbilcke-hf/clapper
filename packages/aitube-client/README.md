# @aitube/client

*Official API client for AiTube.at*

## ATTENTION

AiTube is currently in heavy development, and for the moment
the API client is reserved for *private use* (it is used by AI Stories Factory).

We are sorry for any inconvenience this might cause.

## Caveats

The official domain for AiTube is `aitube.at`, however right now
the Hugging Face Space is not configured to use this as a domain,
so we need to perform all API calls to `jbilcke-hf-ai-tube.hf.space`.

## Installation

To install the package, run the following command:

```bash
npm install @aitube/client
```

## Getting Started

```typescript
import { parseClap, serializeClap } from '@aitube/client';

/*

  UNDOCUMENTED API

*/

const storyOnly = await createClap({
  prompt: "story about a dog",
  token: "ultra secret token unavailable to common mortals"
})

const storyWithStoryboards = await editClapStoryboards(clap)

const mp4VideoFile = await exportClapToVideos(storyWithStoryboards)
```

## Customizing the server

The hostname can be overriden by defining the `AITUBE_HOSTNAME` environment variable.

eg:

```bash
AITUBE_HOSTNAME=http://localhost:3000
```

## Build Instructions

Install [Bun](https://bun.sh/)

Run the following commands:

```bash
bun install

bun run build
```

To publish:

```bash
bun run build

bun run build:declaration

bun run publish
```

## Contributing

We welcome contributions! Please feel free to submit a pull request.

## License

This package is under the MIT License. See `LICENSE` file for more details.
