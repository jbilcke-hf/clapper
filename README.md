---
title: Clap Viewer
emoji: 🎞️
sdk: docker
colorFrom: yellow
colorTo: yellow
pinned: true
app_port: 3000
disable_embedding: true
hf_oauth: false
header: mini
short_description: Visualize OpenClap files 🎞️
---


## Known bugs

For some strange reason it works locally but not when built? hmm.

This works:
```
http://localhost:3000/?clap=https://huggingface.co/spaces/jbilcke-hf/clap-viewer/resolve/main/public/samples/test.clap
```

This doesn't (the .clap loads but it doesn't render due to a JSX error):

```
https://jbilcke-hf-clap-viewer.hf.space/?clap=https://huggingface.co/spaces/jbilcke-hf/clap-viewer/resolve/main/public/samples/test.clap
```

## Instructions for developers

During development we can use a path like this to quickly test:

```
 "@aitube/timeline": "file:/Users/jbilcke/Projects/Typescript_Libraries/aitube-timeline",
```
   

