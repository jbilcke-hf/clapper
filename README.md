---
title: Clapper
emoji: 🎬
sdk: docker
colorFrom: gray
colorTo: gray
pinned: true
app_port: 3000
disable_embedding: false
hf_oauth: false
header: mini
short_description: 🎬 Clapper
---

![Clapper 20240617|600](documentation/screenshots/20240617.jpg)

# Introduction

🎬 Clapper is an open-source AI story visualization tool.

Clapper can interpret a screenplay and render it to storyboards, videos, voice, sound and music.

Please note however that the tool is at an early stage of development, for the moment it is not supposed to be really used by "normal" people (some features don't work, there are no tutorials etc).

# Public alpha access

A public instance of Clapper is currently hosted on [Hugging Face](https://huggingface.co/spaces/jbilcke-hf/clapper/tree/main), you can try it at [Clapper.app](https://clapper.app/)

# Badges

![Boss Bounty Badge](https://img.shields.io/endpoint.svg?url=https://api.boss.dev/badge/enabled/jbilcke-hf/clapper)


# Bounty Sponsors

Those generous sponsors are paying for code bounties:

- Moon ([github](https://github.com/lalalune), [twitter](https://x.com/spatialweeb), [website](https://www.moon.graphics))

# Want to contribute?

## For users or corporations

### Sponsor specific features

If you wish to sponsor the project, help attract new developers, or promote a specific feature faster, you can open a bounty for a specific ticket (eg `"fix music segment duration"`, `"add support for Adobe Premiere Pro export"`, `"finish .fbx integration"`) and open-source community members will be able to submit pull requests to solve them.

I propose to use Boss.dev to do this as it has lower fees than other platforms: [boss.dev](https://www.boss.dev/doc/#create-bounties)

If you submit (to pay) or take on (to earn) a bounty, please post a message in the GitHub thread and/or on [Discord](https://discord.com/invite/AEruz9B92B) to help everyone coordinate around it.

I am currently working to add documentation to help onboard new developers, this should help new people taking on bounties.

## For developers

### Licence

Clapper is under a GPL v3 licence, see the [LICENCE](LICENSE.txt) file for more information. This is a similar licensing as apps like ComfyUI or Blender: 


### Installation

```bash
npm i
npm run dev
```

### Code conventions

I haven't setup Prettier or a Linter yet.

### Testing

There are no automated tests yet, @jbilcke-hf will act as the "QA engineer".

### Architecture


![Arch|800](documentation/diagrams/architecture-draft.png)

