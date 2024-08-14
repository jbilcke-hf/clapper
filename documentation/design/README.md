# Design

(those are just quick notes for now, we can elaborate later)

## Designing Clapper for the Web

### Targeted devices

Currently Clapper works best on a laptop,
since the UI has been developed around the presence of a relatively wide screen,
a mouse and a touch pad (for horizontal scrolling in the timeline).

However I think we should try to better support the following environments:

- Tiny laptop (12", 11")
- Tablet (without a mouse)
- Desktop computer with multiple screens

(mobile has its own chapter, see below in this document)

### Use Web APIs in priority

We should try to use standard Web APIs (ratified by the W3C) as much as possible, with polyfills in case some browsers don't implement them yet.

We can use experimental standards (eg. WebGPU),
but since they are unstable and not supported by all browsers, they should not be mandatory to the experience.

## Designing Clapper for desktop

The experience on Desktop should be similar to the one in a browser, but we can do some changes:

### Customizing the look of the app window

Electron offers us to hide or customize the app's window, so we should do it.

We don't have to follow the design principles of the underlying operating system (some apps don't care eg. video games, Spotify, Slack, FLStudio, Discord..) but it may be necessary for some operations (file pickers, installer, window management etc).

### Use the native file system

The big benefit of running Clapper as a desktop application is that we can access the file system, meaning we can work with files of arbitrary file length (note: for this kind of file system manipulation, we will have to use extra code eg. NodeJS)

This can also be used for performance optimization such as using temporary files, or pre-computing things and store them in a cache for the next time Clapper is opened.

### Download additional data for local use

By running Clapper on the user's device, we can also make it download data of arbitrary size.

This can help with various use cases, such as running AI models locally.

For instance the desktop app LMStudio can download models from Hugging Face.

### Call external or embedded native libraries

We have complete freedom to ship Clapper with embedded native tools eg. a database or a native library (eg. a C++ library to run a LLM locally).

We could even use Python scripts with Clapper.

Please note however that we will have to make sure anything we embed works on various operating systems (Windows/macOS/Linux) so this requires dedicated skills and maintenance.

### Use System Notifications

When a job is pending, finished, a software update is ready etc.

## Clapper Design For Mobile

Currently Clapper can *run* on mobile, but it is not designed for it.

So things like the top menu etc will be pretty much unuseable, unless we adapt them.


