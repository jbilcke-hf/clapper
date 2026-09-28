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
   

## Future extensions

This project is currently not designed to be used with other tools such as Svelte, Vue, or other state manager. In the future it may be split into sub-libraries to facilitate support for alternative frameworks.

## TODO

[ ] BUG: the scrollY position is a bit janky, one should solve the formula
[ ] OPTIM: we should avoid re-creating geometries (eg. grids, cells) and text since this is costly
[ ] FEATURE: Add edit callbacks
[ ] CLEAN: Write doc
[ ] BUG: Fix the Vite previewer
## Creating and moving clips

The editing bar above the timeline provides a track selector, a type selector,
**+ Track**, and **+ Clip at playhead**. New tracks reuse unused grid rows before
extending the timeline. Set an empty track's type, then create a clip; its category
and output format follow the track. Occupied tracks retain their type to avoid
silently changing the meaning of existing media.

Drag a clip body to change its time or move it to another track of the same type.
Time is snapped to the project frame rate and cannot become negative. Escape,
pointer cancellation, or losing window focus restores the original position.
Track types, including empty tracks, are saved in optional `meta.timelineTracks`
metadata; old projects infer types from their clips. Mixed legacy tracks can be
shown but cannot accept newly created clips until they have one consistent type.

Run `bun test` in this package for the editing regressions. Run the demo with
`bun run dev`, then open `/test/editor.html` for the acceptance fixture. The
fixture displays clip positions and track types below the canvas. If WebGL is
unavailable, its test-only error boundary preserves the production toolbar for
control checks; full pointer dragging requires a WebGL-capable browser.
