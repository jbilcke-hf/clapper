# @aitube/clap

*Types and helpers to manipulate .clap files*

## Introduction

This library is the reference implementation of [OpenClap](https://github.com/jbilcke-hf/OpenClap-Format) for NodeJS and browser environments.

**OpenClap** is a prompt container file format that was initially created for my AiTube.at project. I am also using it in my other AI demos, and I think you should use it, too!

## Installation

To install the package, run the following command (`yaml` is a peer dependency):

```bash
npm install @aitube/clap yaml
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

  ClapInputFieldNumber,
  ClapInputFieldString,
  ClapInputFieldBoolean,
  ClapInputFieldAny,
  ClapInputFields,
  ClapInputValue,
  ClapInputValues,
  ClapWorkflowEngine,
  ClapWorkflow,

// defaults
  defaultMediaOrientation,

  // factories
  newClap,
  newEntity,
  newSegment,
  newWorkflow,

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
  parseWorkflowEngine,
  parseSegmentCategory,
  parseSegmentStatus,
  UUID,

  // converters
  blobToDataUri,
  dataUriToBlob,
  clapToDataUri,

  // helpers
  buildEntityIndex,
  filterAssets,
  filterSegmentsByCategory,
  generateClapFromSimpleStory,
  getEmptyClap,
  removeGeneratedAssetUrls,

  // sanitizers
  sanitizeEntities,
  sanitizeEntity,
  sanitizeMeta,
  sanitizeSegment,
  sanitizeSegments,
  sanitizeWorkflow,
  sanitizeWorkflows,
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
