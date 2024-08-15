# @aitube/io

*Collection of useful I/O utilities for NodeJS. Used by AiTube.at*

## ATTENTION

AiTube is currently in heavy development, so this library is experimental,
and may be subject to unannounced breaking changes.

We are sorry for any inconvenience this might cause.

## Installation

To install the package, run the following command:

```bash
npm install @aitube/io
```

## Getting Started

```typescript
import {
  deleteFile,
  deleteFilesWithName,
  removeTemporaryFiles,
  downloadFileAsBase64,
  convertImageTo,
  convertImageToJpeg,
  convertImageToOriginal,
  convertImageToPng,
  convertImageToWebp,
  resizeImage,
  readJpegFileToBase64,
  readLocalOrRemotePlainText,
  readMp3FileToBase64,
  readMp4FileToBase64,
  readPlainText,
  readPngFileToBase64,
  readWavFileToBase64,
  getRandomDirectory,
  writeBase64ToFile,
} from '@aitube/io'

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
