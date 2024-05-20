# @aitube/clap

*Types and helpers to manipulate .clap files*

## Introduction

This library is used to manipulate Clap files, the file format used to describe AI scenes for AiTube.

It in an open interchange format that other people can use freely for their own projects.

## Design and capabilities

A Clap file (.clap) is a compressed YAML stream of documents that describe all aspects of a scene.

(to be continued)

## Roadmap

- [ ] Create a DRAFT for the specification
- [x] Use it in production
- [x] First working implementation for NodeJS 

## Implementations:

- [ ] C++ library (for native binding): TODO
- [x] Python (in progress): [py-aitube-clap](https://github.com/jbilcke-hf/py-aitube-clap)
- [x] NodeJS (released): [aitube-clap](https://github.com/jbilcke-hf/aitube-clap)
- [ ] Swift: TODO
- [ ] G TODO
- [ ] Java TODO
- [ ] Haskell TODO

## Installation

To install the package, run the following command:

```bash
npm install @aitube/clap
```

## Getting Started

```typescript
import {
  // types
  ClapSegmentCategory,
  ClapOutputType,
  ClapSegmentStatus,
  ClapAuthor,
  ClapAssetSource,
  ClapEntityGender,
  ClapEntityAppearance,
  ClapEntityRegion,
  ClapEntityTimbre,
  ClapEntityAudioEngine,
  ClapSegmentFilteringMode,
  ClapVoice,
  ClapHeader,
  ClapMeta,
  ClapSceneEvent,
  ClapScene,
  ClapSegment,
  ClapEntity,
  ClapProject, 
  ClapMediaOrientation,

// defaults
  defaultMediaOrientation,

  // factories
  newClap,
  newEntity,
  newSegment,

  // main input/output handlers
  parseClap,
  serializeClap,
  fetchClap,
  updateClap,

  // utilities
  filterSegments,
  filterSegmentsWithinRange,
  generateSeed,
  getClapAssetSourceType,
  getValidNumber,
  isValidNumber,
  parseMediaOrientation,
  parseOutputType,
  parseSegmentCategory,
  parseSegmentStatus,
  UUID,

  // converters
  blobToDataUri,
  dataUriToBlob,
  clapToDataUri,

  // helpers
  generateClapFromSimpleStory,
  getEmptyClap,
  buildEntityIndex
} from "@aitube/clap"


// fetch a Clap file
const res = await fetch("https://..../file.clap")
const file = await res.blob()

// open the Clap file
const clap: ClapProject = await parseClap(file)

// perform arbitrary changes in the project

clap.segments.at(64).assetUrl = await generateVideoWithAI(....)

const segment: ClapSegment = clap.segments.at(42)
segment.prompt = "a camel in the desert, medium-shot, award-winning, 4k, Canon EOS"

const storyboards = clap.segment.filter(s => s.category === ClapSegmentCategory.STORYBOARD)

// save the Clap file
const newFile: ClapProject = await serializeClap(clap)
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
