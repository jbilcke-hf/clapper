# /services

Each service represents a core features of Clapper.

They each have their own state (managed using Zustand, so it can be used in and out of a React component), and should be considered like tiny independent apps (each manage one important thing), although they deeply relate to each other.

For instance multiple services might need to tap into the Settings service to pull parameters or default values.

## Assistant

The chatbot assistant.

Usage:

```typescript
useAssistant()
```

## Audio

Audio management, including playing back audio files for dialogues, sound effects and music.

Usage:

```typescript
useAudio()
```

## IO

Input/output management, to import and export various file formats.

Usage:

```typescript
useIO()
```

## Monitor

The video monitor is the big video display component used to preview an existing (pre-generated) full video, or preview a work in progress project composed of many tiny video clips.

The monitor is responsible for handling the play, pause, seek etc..
functions.

Usage:

```typescript
useMonitor()
```

## Renderer

This is the engine that can generate a video stream on the fly from a sequence of tiny video and audio clips.

Usage:

```typescript
useRenderer()
```

## Settings

Responsible for organizing user preferences, which are serialized
and persisted into the browser local storage, that way no login or account management is necessary.

Usage:

```typescript
useSettings()
```

## UI

The user interface service, through which you can show/hidden elements of the interface.

Usage:

```typescript
useUI()
```
