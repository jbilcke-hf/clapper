# @aitube/clap

*Types and helpers to manipulate .clap files*

## Introduction

This library is used to manipulate Clap files, the file format
used by AiTube, a modern platform for AI cinema and AI gaming.

It is designed to support short-to-long 2D, 3D and 4D experiences,
such as conventional films or more modern forms of art such as gaussian splatting movies with a soundtrack.

## Installation

To install the package, run the following command:

```bash
npm install @aitube/clap
```

## Getting Started

```typescript
import { parseClap, serializeClap } from '@aitube/clap';

// fetch a Clap file
const res = await fetch("< some .clap file hosted from somewhere >")
const file = await res.blob()

// open the Clap file
const clap: ClapProject = await parseClap(file)

// perform arbitrary changes in the project
clap.segments.at(42).prompt = "a camel in the desert, medium-shot, award-winning, 4k, Canon EOS"

clap.segments.at(64).assetUrl = await generateVideoWithAI(....)

// save the Clap file
const newFile = await serializeClap(clap)
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
