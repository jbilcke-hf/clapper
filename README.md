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
npm i
npm run dev
```

### Making sure everything is working properly

There are no tests yet (I will create a ticket for that),
but until then you can run the following command to make sure all the types are consistant and properly set:

```bash
npm run build
```

### Code conventions

I haven't setup Prettier or a Linter yet.

### Testing

@jbilcke-hf is working to add tests, and will also act as the "QA engineer".

To run all the tests (unit and e2e) please run: 

`npm test`

This is not instantaneous: playwright may seems to do nothing for a while at first.

#### Unit tests

Note: I've just added Vitest so we only have like 2 tests for now.


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
