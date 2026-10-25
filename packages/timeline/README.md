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
npm install @aitube/timeline
```

Depending on your project configuration and package manager, you may need to install some additional packages manually, such as React, Radix, Tailwind, Three.js, Zustand etc:

```bash
npm install @aitube/clap @radix-ui/react-slider @react-spring/three @react-spring/types @react-three/drei @react-three/fiber @types/react @types/react-dom react react-dom tailwindcss three typescript zustand
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
 "@aitube/timeline": "file:/Users/jbilcke/Projects/Typescript_Libraries/aitube-timeline",
```
   

## Authoring tracks and clips

Use **New track**, select its **Track type**, then choose **New clip** to add a draft at the playhead. The track selector uses the same track numbers as the canvas. Empty tracks can change type; populated tracks keep the type of their clips. Mixed tracks from older projects remain readable, but cannot accept new clips until they have a single type.

Drag a clip's body to change its start time or move it to another track of the same type. Its ID and duration stay unchanged. Dropping on an incompatible track or outside the canvas, pressing Escape, or losing window focus cancels the drag. Hovering alone does not edit a clip.

Draft clips have an empty asset and do not request content generation. Existing explicit generation controls remain separate. Saving and opening a project preserves clip placement and typed empty tracks through optional `meta.timelineTracks` descriptors. Files without these descriptors still derive their track types from their clips. Authored/imported descriptors use track IDs 0–4095.

The app's `src/lib/timeline-authoring.test.ts` exercises the compiled clap/timeline packages. Build those packages before running the app's Vitest tests.

## Future extensions

This project is currently not designed to be used with other tools such as Svelte, Vue, or other state manager. In the future it may be split into sub-libraries to facilitate support for alternative frameworks.

## TODO

[ ] BUG: the scrollY position is a bit janky, one should solve the formula
[ ] OPTIM: we should avoid re-creating geometries (eg. grids, cells) and text since this is costly
[ ] FEATURE: Add edit callbacks
[ ] CLEAN: Write doc
[ ] BUG: Fix the Vite previewer
