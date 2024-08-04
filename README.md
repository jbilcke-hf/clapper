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

Prototyped [a year ago](https://www.loom.com/share/25b60750a32c4183b7fadc622d7c0120?sid=f1173e95-1ec8-4be2-831d-54b18e835367), Clapper is not designed to replace traditional video editors or modern AI editors using 3D scenes as input.

Clapper's philosophy is for anyone to create videos using AI through an interactive, iterative and intuitive process, without the need for external tools, filmmaking or AI engineering skills.

In Clapper you don't edit a sequence of video and audio files directly, but iterate (with the help from your AI assistant) over your story using high-level abstractions such as characters, locations, weather, time period, style etc.

To this end I am also working on a Director's Mode, where you can just put the video in fullscreen, sit confortably in your director's chair (or couch), shouting orders at your AI set assistant to produce your movie.

# Public alpha access

A public instance of Clapper is currently hosted on [Hugging Face](https://huggingface.co/spaces/jbilcke-hf/clapper/tree/main), you can try it at [Clapper.app](https://clapper.app/)

# Badges

- Build and tests status: [![E2E & Unit Tests](https://github.com/jbilcke-hf/clapper/actions/workflows/tests.yml/badge.svg)](https://github.com/jbilcke-hf/clapper/actions/workflows/tests.yml)

- Sponsor a feature: ![Boss Bounty Badge](https://img.shields.io/endpoint.svg?url=https://api.boss.dev/badge/enabled/jbilcke-hf/clapper)


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

Clapper is under a GPL v3 licence, see the [LICENCE](LICENSE.txt) file for more information. This is a similar licensing to apps like ComfyUI or Blender.


### Installation

### Prerequisites

As a prerequisite you need to have [git lfs](https://git-lfs.com/) installed (see the `.gitattributes` file at the root of project):

```bash
git lfs install
```

Clapper has been tested with Node `20.15.1`.

To make sure you use this version, you can use [NVM](https://github.com/nvm-sh/nvm) to activate it:

```bash
nvm install
nvm use
```

If you find that Clapper is working with a more recent (stable) version of Node, or have a better version management to suggest, please open a ticket.

### Installing and running the app

```bash
npm i --include=optional
npm run dev
```

`--include=optional` is to make sure optional dependencies are installed (pre-build native modules compatible with your system)

### Building the app

You can run the following command to build the app, making sure all the types are consistant and properly set:

```bash
npm run build
```

### Running the app with Electron

An Electron build is in progress.

There are still some things to debug and figure out, but if you are a developer you can try it out by starting Clapper through Electron like this:

```bash
npm run electron:start
```

If that doesn't work for you (issue with node-gyp, setuptools, distutils etc) you might have to run:

```bash
python3 -m pip install --break-system-packages setuptools
```

You can also build Clapper for your operating system by typing:

```bash
npm run electron:make
```

You might see a DeprecationWarning message written in red at the end but that's only a warning, just open `./out/make` to check if the build worked.

### Code conventions

I have setup Prettier and ESLint, they use some basic rules (you can propose new rules if you want to)

### Testing

To run all the tests (unit and e2e) please run: 

`npm test`

This is not instantaneous: playwright may seems to do nothing for a while at first.

@jbilcke-hf is working to add more tests, and will also act as the "QA engineer".

#### Unit tests

Note: I've just added Vitest so we only have a few tests for now.


To run the test without watching, type:
`npm run test:unit:ci`

To run the tests with watching, type:
`npm run test:unit:watch`

#### End-to-end tests

Note: I've just added Playwright, but we don't really have tests yet.

Please note that due to the app needing to build during 30~60s (depending on the speed of your computer), running those tests may
take some time to execute.

`npm run test:e2e`

More Playwright commands:
  `npx playwright test`
    Runs the end-to-end tests.

  `npx playwright test --ui`
    Starts the interactive UI mode.

  `npx playwright test --project=chromium`
    Runs the tests only on Desktop Chrome.

  `npx playwright test example`
    Runs the tests in a specific file.

 ` npx playwright test --debug`
    Runs the tests in debug mode.

  `npx playwright codegen`
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    `npx playwright test`


### Architecture

![Arch|800](documentation/diagrams/architecture-draft.png)

For convenience, you can access and inspect any of the services at runtime (in the browser's JS console) by typing `useUI.getState(), useIO.getState()` etc
