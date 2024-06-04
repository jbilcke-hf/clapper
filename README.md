---
title: Clap Viewer
emoji: 🎬
sdk: docker
colorFrom: gray
colorTo: gray
pinned: true
app_port: 3000
disable_embedding: true
hf_oauth: false
header: mini
short_description: Visualize screenplay and OpenClap files 🎬
---

## Introduction

Clap Viewer is a simple app to visualize a .clap timeline:

[demo](https://jbilcke-hf-clap-viewer.hf.space/?clap=https://huggingface.co/spaces/jbilcke-hf/clap-viewer/resolve/main/public/samples/test.clap)

## Instructions for developers

During development we can use a path like this to quickly test:

```
 "@aitube/timeline": "file:/Users/jbilcke/Projects/Typescript_Libraries/aitube-timeline",
```

Your local copy of the aitube-timelien will have to be built using:

```bash
bun run build:dev
```

to build with the jsxDEV enabled.

If you don't, you will see errors and warnings such as

```
app-index.js:33 Warning: Each child in a list should have a unique "key" prop.
```

