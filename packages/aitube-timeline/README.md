# @aitube/timeline

*React component to display an OpenClap timeline*

## Introduction

This library is not ready for public use yet.

This is a "build in public" project so code is open and provided for convenience and discussion,
but there is no official release yet (documentation will be written once the library is useable).

Thanks for your patience!

## Installation

Note: as warned before, this library is not ready for public use yet.

I cannot provide support until the basic features have been implemented and some critical bugs fixed.

```bash
npm i @aitube/timeline
```

Depending on your project configuration and package manager, you may need to install some additional packages manually, such as React, Radix, Tailwind, Three.js, Zustand etc:

```bash
npm i @aitube/clap @radix-ui/react-slider @react-spring/three @react-spring/types @react-three/drei @react-three/fiber @types/react @types/react-dom react react-dom tailwindcss three typescript zustand
```

If you forget some dependencies you might get weird errors

## Building

You can see in the package.json that I set `NODE_ENV=production` while building, that's because of a weirdness with Bun: https://github.com/oven-sh/bun/issues/3768

If you are developping the timeline, I recommend to use:

```bash
bun run build:dev
```

to build with the jsxDEV enabled.

You will also want to use a path like this to test the module directly dependency:

```json
 "@aitube/timeline": "file:/path/to/aitube-timeline",
```
   

## Future extensions

This project is currently not designed to be used with other tools such as Svelte, Vue, or other state manager. In the future it may be split into sub-libraries to facilitate support for alternative frameworks.

## TODO

[ ] BUG: When zooming in an area, large segments (such as music) become invisible due to the way we compute ranges
[ ] FEATURE: Add edit callbacks
[ ] CLEAN: Write doc
[ ] BUG: Fix the Vite previewer
