# WARNING

This documented has been generated using GPT-4.
It probably contains inacurracies.

# OpenClap File Format Specification

## 1. Introduction

This document specifies the OpenClap file format, which is used to serialize AI video projects into a compressed stream of YAML documents. The format is designed to include information regarding metadata, entities, scenes, and segments, ensuring a structure suitable for AI-driven video generation.

## 2. Conventions Used in This Document

The key words **"MUST"**, **"MUST NOT"**, **"REQUIRED"**, **"SHALL"**, **"SHALL NOT"**, **"SHOULD"**, **"SHOULD NOT"**, **"RECOMMENDED"**, **"MAY"**, and **"OPTIONAL"** in this document are to be interpreted as described in RFC 2119.

## 3. Structure of the OpenClap File

An OpenClap file is composed of a sequence of YAML documents, representing various components of an AI video project. These documents MUST be serialized in the following order:

1. **ClapHeader**

2. **ClapMeta**

3. **ClapEntity** objects

4. **ClapScene** objects

5. **ClapSegment** objects

The entire YAML sequence MUST be compressed using gzip for efficient storage and transmission.

### 3.1 ClapHeader

The ClapHeader provides the format version and counts of entities, scenes, and segments included in the file.

#### 3.1.1 Fields

- **format** (ClapFormat): The format version, e.g., "clap-0".

- **numberOfEntities** (number): The total number of entities.

- **numberOfScenes** (number): The total number of scenes.

- **numberOfSegments** (number): The total number of segments.


### 3.2 ClapMeta

The ClapMeta provides metadata about the project.


#### 3.2.1 Fields


- **id** (string): Unique identifier for the metadata.

- **title** (string): Title of the project.

- **description** (string): Description of the project.

- **synopsis** (string): Synopsis of the project.

- **licence** (string): Licensing information.

- **orientation** (ClapMediaOrientation): Media orientation, e.g., "landscape".

- **durationInMs** (number): Duration in milliseconds.

- **width** (number): Width of the video.

- **height** (number): Height of the video.

- **defaultVideoModel** (string): Default video model.

- **extraPositivePrompt** (string[]): Additional positive prompts.

- **screenplay** (string): Screenplay text.

- **isLoop** (boolean): Indicates if the project should loop.

- **isInteractive** (boolean): Indicates if the project is interactive.



### 3.3 ClapEntity



A ClapEntity represents an entity in the project, such as a character.



#### 3.3.1 Fields



- **id** (string): Unique identifier for the entity.

- **category** (ClapSegmentCategory): Category of the entity.

- **triggerName** (string): Trigger name associated with the entity.

- **label** (string): Label of the entity.

- **description** (string): Description of the entity.

- **author** (string): Author of the entity.

- **thumbnailUrl** (string): URL of the thumbnail image for the entity.

- **seed** (number): Random seed for generation.

- **imagePrompt** (string): Prompt for generating the image.

- **imageSourceType** (ClapAssetSource): Source type of the image.

- **imageEngine** (string): Engine used for generating the image.

- **imageId** (string): Identifier of the image.

- **audioPrompt** (string): Prompt for generating the audio.

- **audioSourceType** (ClapAssetSource): Source type of the audio.

- **audioEngine** (ClapEntityAudioEngine): Engine used for generating the audio.

- **audioId** (string): Identifier of the audio.

- **age** (number): Age of the entity.

- **gender** (ClapEntityGender): Gender of the entity.

- **region** (ClapEntityRegion): Region associated with the entity.

- **appearance** (ClapEntityAppearance): Appearance of the entity.



### 3.4 ClapScene



A ClapScene describes scenes within the project, including events.



#### 3.4.1 Fields



- **id** (string): Unique identifier for the scene.

- **scene** (string): Description of the scene.

- **line** (string): Line identifier associated with the scene.

- **rawLine** (string): Raw line text.

- **sequenceFullText** (string): Full text of the sequence.

- **sequenceStartAtLine** (number): Start line of the sequence.

- **sequenceEndAtLine** (number): End line of the sequence.

- **startAtLine** (number): Start line of the scene.

- **endAtLine** (number): End line of the scene.

- **events** (ClapSceneEvent[]): List of events in the scene.



### 3.5 ClapSegment



A ClapSegment represents a segment of time within the timeline of the project.



#### 3.5.1 Fields



- **id** (string): Unique identifier for the segment.

- **track** (number): Track number of the segment.

- **startTimeInMs** (number): Start time in milliseconds.

- **endTimeInMs** (number): End time in milliseconds.

- **category** (ClapSegmentCategory): Category of the segment.

- **entityId** (string): Identifier of the associated entity.

- **sceneId** (string): Identifier of the associated scene.

- **prompt** (string): Prompt for generating content in the segment.

- **label** (string): Label of the segment.

- **outputType** (ClapOutputType): Output type of the segment.

- **renderId** (string): Identifier of the render.

- **status** (ClapSegmentStatus): Status of the segment.

- **assetUrl** (string): URL of the asset.

- **assetDurationInMs** (number): Duration of the asset in milliseconds.

- **assetSourceType** (ClapAssetSource): Source type of the asset.

- **assetFileFormat** (string): File format of the asset.

- **createdAt** (string): Creation timestamp.

- **createdBy** (ClapAuthor): Creator of the segment.

- **editedBy** (ClapAuthor): Editor of the segment.

- **outputGain** (number): Output gain value.

- **seed** (number): Random seed for generation.



## 4. Serialization and Compression



The series of YAML documents MUST be serialized and then compressed using gzip. The resulting MIME type SHALL be "application/x-gzip".



### 4.1 YAML Serialization



Each component (ClapHeader, ClapMeta, ClapEntity, ClapScene, and ClapSegment) SHOULD be serialized to a separate YAML document. The following steps MUST be followed for serialization and compression:



1. Serialize each component to YAML.

2. Concatenate the YAML strings in the prescribed order.

3. Compress the combined string using gzip.



## 5. Deserialization and Decompression



When reading an OpenClap file, the following steps MUST be adhered to:



1. Decompress the file using gzip.

2. Parse the YAML documents in the order they appear.

3. Construct the in-memory data structures representing `ClapProject` components.



## 6. Example



Below is an example OpenClap YAML structure before compression:



```yaml

- format: clap-0

  numberOfEntities: 1

  numberOfScenes: 1

  numberOfSegments: 1

- id: 123e4567-e89b-12d3-a456-426614174000

  title: Example Project

  description: An example AI video project.

  synopsis: This is an example synopsis.

  licence: MIT

  orientation: landscape

  durationInMs: 5000

  width: 1920

  height: 1080

  defaultVideoModel: SVD

  extraPositivePrompt: []

  screenplay: Example screenplay

  isLoop: false

  isInteractive: false

- id: 1

  category: character

  triggerName: trigger_1

  label: Example Entity

  description: An example entity.

  author: human

  thumbnailUrl: http://example.com/thumbnail.jpg

  seed: 12345

  imagePrompt: Example image prompt

  imageSourceType: REMOTE

  imageEngine: ExampleEngine

  imageId: img_001

  audioPrompt: Example audio prompt

  audioSourceType: REMOTE

  audioEngine: ExampleAudioEngine

  audioId: audio_001

  age: 25

  gender: male

  region: european

  appearance: friendly

- id: 1

  scene: Example Scene

  line: Line 1

  rawLine: Raw line 1

  sequenceFullText: Example full text

  sequenceStartAtLine: 1

  sequenceEndAtLine: 10

  startAtLine: 1

  endAtLine: 5

  events:

    - id: evt_001

      type: action

      description: Example action

      behavior: Neutral

      startAtLine: 1

      endAtLine: 2

- id: 1

  track: 0

  startTimeInMs: 1000

  endTimeInMs: 2000

  category: video

  entityId: 1

  sceneId: 1

  prompt: Example prompt

  label: Example label

  outputType: video

  renderId: render_001

  status: to_generate

  assetUrl: http://example.com/asset.mp4

  assetDurationInMs: 1000

  assetSourceType: REMOTE

  assetFileFormat: mp4

  createdAt: 2022-01-01T00:00:00Z

  createdBy: human

  editedBy: human

  outputGain: 0

  seed: 12345

```


## 7. Types and Enumerations



This section details the types and enumerations used in the OpenClap file format.



### 7.1 Enumerations


#### 7.1.1 ClapFormat

Describes the format version of the Clap file.

- **CLAP_0**: "clap-0"

- Future versions, e.g. **CLAP_1**, are reserved for future use.



#### 7.1.2 ClapSegmentCategory

Defines categories for different types of segments.

- **SPLAT**: "splat"

- **MESH**: "mesh"

- **DEPTH**: "depth"

- **EVENT**: "event"

- **INTERFACE**: "interface"

- **PHENOMENON**: "phenomenon"

- **VIDEO**: "video"

- **STORYBOARD**: "storyboard"

- **TRANSITION**: "transition"

- **CHARACTER**: "character"

- **LOCATION**: "location"

- **TIME**: "time"

- **ERA**: "era" (deprecated, use TIME instead)

- **LIGHTING**: "lighting"

- **WEATHER**: "weather"

- **ACTION**: "action"

- **MUSIC**: "music"

- **SOUND**: "sound"

- **DIALOGUE**: "dialogue"

- **STYLE**: "style"

- **CAMERA**: "camera"

- **GENERIC**: "generic"



#### 7.1.3 ClapMediaOrientation

Defines the orientation for media.

- **LANDSCAPE**: "landscape"

- **PORTRAIT**: "portrait"

- **SQUARE**: "square"



#### 7.1.4 ClapOutputType

Defines output types for segments.

- **TEXT**: "text"

- **ANIMATION**: "animation"

- **INTERFACE**: "interface"

- **EVENT**: "event"

- **PHENOMENON**: "phenomenon"

- **TRANSITION**: "transition"

- **IMAGE**: "image"

- **VIDEO**: "video"

- **AUDIO**: "audio"



#### 7.1.5 ClapSegmentStatus

Defines the status of a segment.

- **TO_GENERATE**: "to_generate"

- **TO_INTERPOLATE**: "to_interpolate"

- **TO_UPSCALE**: "to_upscale"

- **COMPLETED**: "completed"

- **ERROR**: "error"



#### 7.1.6 ClapAssetSource

Defines the source type of assets.

- **REMOTE**: "REMOTE"

- **PATH**: "PATH"

- **DATA**: "DATA"

- **PROMPT**: "PROMPT"

- **EMPTY**: "EMPTY"



#### 7.1.7 ClapEntityGender

Defines gender types for entities.

- **male**

- **female**

- **person**

- **object**



#### 7.1.8 ClapEntityRegion

Defines regions for entities.

- **global**

- **american**

- **european**

- **british**

- **australian**

- **canadian**

- **indian**

- **french**

- **italian**

- **german**

- **chinese**



#### 7.1.9 ClapEntityAudioEngine

Defines audio engines for entities.

- **ElevenLabs**

- **XTTS**

- **Parler-TTS**

- **OpenVoice**



#### 7.1.10 ClapSegmentFilteringMode

Defines filtering mode for segments.

- **START**: start of a segment must be within the range.

- **END**: end of a segment must be within the range.

- **ANY**: any end of a segment must be within the range.

- **BOTH**: both ends of a segment must be within the range.



### 7.2 Types

This section describes the various type definitions used in the OpenClap format.



#### 7.2.1 ClapAuthor

Defines the type of author.

- **"auto"**: automatically edited using basic if/else logical rules

- **"ai"**: edited using a large language model

- **"human"**: edited by a human

- **string**: custom author type



#### 7.2.2 ClapVoice

Describes the attributes of a voice.

- **name** (string)

- **gender** (ClapEntityGender)

- **age** (number)

- **region** (ClapEntityRegion)

- **timbre** (string: "high" | "neutral" | "deep")

- **appearance** (string)

- **audioEngine** (ClapEntityAudioEngine)

- **audioId** (string)



#### 7.2.3 ClapSceneEvent

Describes an event within a scene.

- **id** (string): Unique identifier for the event.

- **type** (string: "description" | "dialogue" | "action"): Type of the event.

- **character** (string): Character involved in the event, if applicable.

- **description** (string): Description of the event.

- **behavior** (string): Behavior during the event.

- **startAtLine** (number): Starting line of the event.

- **endAtLine** (number): Ending line of the event.



#### 7.2.4 ClapHeader, ClapMeta, ClapEntity, ClapScene, ClapSegment

These types have been described in the sections 3.1 to 3.5 respectively.



## 8. Compliance and Future Considerations



### 8.1 Compliance

To ensure compliance with the OpenClap specification, implementations MUST strictly adhere to the prescribed serialization, structure, and compression processes as defined in this document. Non-compliant implementations MAY result in files that are not interoperable with existing tools and programs designed to read or write OpenClap files.



### 8.2 Extensibility

Future versions of this specification MAY introduce new fields or types. Existing fields MAY evolve. Backwards compatibility SHALL be maintained whenever possible. Developers are encouraged to closely follow updates to the specification to ensure ongoing compatibility with future versions.



## 9. Security Considerations



Implementations that read, write, or otherwise process OpenClap files SHOULD be aware of potential security risks, especially when handling remote or file path assets as defined by the `ClapAssetSource` type. Specifically:



- **REMOTE**: Ensure proper validation of all URLs to mitigate potential exploits, such as URL redirection attacks.

- **PATH**: Handle file paths with care to prevent potential directory traversal attacks and ensure paths are valid and do not expose sensitive files on the filesystem.

- **DATA**: Validate `data:` URIs to prevent data injection or related security issues.



An implementation processing OpenClap files MUST ensure that untrusted files and sources do not compromise system security.


## Addendum

## 10. Before you read

The following IS NOT a proposal to add OpenClap to AAF,
but simply a study (generated using GPT-4) of the possibility
of converting OpenClap to AAF some how.

## 10.1 Advanced Authoring Format (AAF) Compatibility

To ensure compatibility with the Advanced Authoring Format (AAF), we outline the necessary mapping between OpenClap and the AAF structures. This section provides guidelines on how OpenClap’s data model can integrate with AAF's existing specifications.

### 10.2 Mapping OpenClap Data Model to AAF

AAF is a professional file interchange format designed for the exchange of digital media and metadata. It incorporates a sophisticated data model to support the interchange of authored media data, including timelines, metadata, and media essence.

This section describes how the various elements of the OpenClap data model can be mapped to the AAF data structure.

#### 10.2.1 ClapHeader and AAF Descriptive Metadata

The `ClapHeader` in OpenClap can be mapped to AAF’s descriptive metadata to indicate the format version and counts of entities, scenes, and segments.


- **ClapHeader.format** -> AAF `Identification.Description`

- **ClapHeader.numberOfEntities** -> AAF `MobID`

- **ClapHeader.numberOfScenes** -> AAF `MobID`

- **ClapHeader.numberOfSegments** -> AAF `MobID`



#### 10.2.2 ClapMeta and AAF Content Description

The `ClapMeta` object in OpenClap includes metadata about the project which can be mapped to various AAF metadata fields.



- **ClapMeta.id** -> AAF `Identification.InstanceUID`

- **ClapMeta.title** -> AAF `Mob.Name`

- **ClapMeta.description** -> AAF `Mob.Comment`

- **ClapMeta.synopsis** -> AAF `DescriptiveObjectFramework`

- **ClapMeta.licence** -> AAF `ContentStorage`

- **ClapMeta.orientation** -> Custom descriptive metadata in AAF

- **ClapMeta.durationInMs** -> AAF `Mob.Sequence.Length`

- **ClapMeta.width** and **ClapMeta.height** -> AAF `DescriptiveClip.FrameLayout`

- **ClapMeta.defaultVideoModel** -> Custom taxonomy in AAF metadata

- **ClapMeta.extraPositivePrompt** -> AAF `CommentMarker`

- **ClapMeta.screenplay** -> Custom descriptive metadata in AAF

- **ClapMeta.isLoop** -> Custom descriptive metadata in AAF

- **ClapMeta.isInteractive** -> Custom descriptive metadata in AAF



#### 10.2.3 ClapEntity and AAF Composition Mob

The `ClapEntity` object in OpenClap can correspond to the `Composition Mob` in AAF, which represents logical groupings of media assets.



- **ClapEntity.id** -> AAF `Composition Mob UID`

- **ClapEntity.category** -> AAF `User defined data or Custom subclass`

- **ClapEntity.triggerName** -> AAF `Slot.EditRate`

- **ClapEntity.label** -> AAF `MobSlot.Name`

- **ClapEntity.description** -> AAF `MobSlot.Comment`

- **ClapEntity.author** -> AAF `DescriptiveMarkerText`

- **ClapEntity.thumbnailUrl** -> Custom metadata field linked to a locator in AAF

- **ClapEntity.seed** -> Custom descriptive metadata in AAF

- **ClapEntity.imagePrompt** -> Custom descriptive metadata in AAF

- **ClapEntity.imageSourceType** -> AAF `Locator`

- **ClapEntity.imageEngine** -> AAF `CodecDefinition`

- **ClapEntity.imageId** -> Custom metadata in AAF

- **ClapEntity.audioPrompt** -> Custom descriptive metadata in AAF

- **ClapEntity.audioSourceType** -> AAF `Locator`

- **ClapEntity.audioEngine** -> AAF `CodecDefinition`

- **ClapEntity.audioId** -> Custom metadata in AAF

- **ClapEntity.age** -> Custom descriptive metadata in AAF

- **ClapEntity.gender** -> Custom taxonomy in AAF

- **ClapEntity.region** -> Custom taxonomy in AAF

- **ClapEntity.appearance** -> Custom descriptive metadata in AAF



#### 10.2.4 ClapScene and AAF Event Mob

The `ClapScene` can be represented as AAF `Event MobReferences`.



- **ClapScene.id** -> AAF `MobID`

- **ClapScene.scene** -> Custom descriptive metadata in AAF

- **ClapScene.line** -> AAF `Timeline Track`

- **ClapScene.rawLine** -> Custom descriptive metadata in AAF

- **ClapScene.sequenceFullText** -> Custom descriptive metadata in AAF

- **ClapScene.sequenceStartAtLine** -> AAF `SourceClip.StartTime`

- **ClapScene.sequenceEndAtLine** -> AAF `SourceClip.Length`

- **ClapScene.startAtLine** -> AAF `Event.StartTime`

- **ClapScene.endAtLine** -> AAF `Timeline Track`



The `ClapSceneEvent` type in OpenClap maps to AAF’s events within a timeline track:



- **ClapSceneEvent.id** -> AAF `Event UID`

- **ClapSceneEvent.type** -> Custom marker in AAF (e.g., EventType)

- **ClapSceneEvent.character** -> AAF `Descriptive Marker Text`

- **ClapSceneEvent.description** -> AAF `Event Comment`

- **ClapSceneEvent.behavior** -> Custom descriptive metadata

- **ClapSceneEvent.startAtLine** and **ClapSceneEvent.endAtLine** -> AAF `Timeline Track`



#### 10.2.5 ClapSegment and AAF Source Clips

`ClapSegment` aligns with AAF's `Source Clips` and related components.



- **ClapSegment.id** -> AAF `SourceClip UID`

- **ClapSegment.track** -> AAF `Timeline Track Number`

- **ClapSegment.startTimeInMs** -> AAF `SourceClip.StartTime`

- **ClapSegment.endTimeInMs** -> AAF `SourceClip.Length`

- **ClapSegment.category** -> User-defined metadata in AAF

- **ClapSegment.entityId** -> AAF `SourceMob SourceID`

- **ClapSegment.sceneId** -> AAF `MobID`

- **ClapSegment.prompt** -> Custom descriptive metadata in AAF

- **ClapSegment.label** -> AAF `MobSlot.Name`

- **ClapSegment.outputType** -> Custom classification in AAF

- **ClapSegment.renderId** -> Custom descriptive metadata in AAF

- **ClapSegment.status** -> Custom metadata in AAF

- **ClapSegment.assetUrl** -> AAF `Locator.Location`

- **ClapSegment.assetDurationInMs** -> AAF `Descriptive Marker Length`

- **ClapSegment.assetSourceType** -> AAF `Locator.Type`

- **ClapSegment.assetFileFormat** -> Custom classification in AAF

- **ClapSegment.createdAt** -> AAF `MobID.CreationTime`

- **ClapSegment.createdBy** -> User-defined metadata in AAF

- **ClapSegment.editedBy** -> User-defined metadata in AAF

- **ClapSegment.outputGain** -> Custom field in AAF

- **ClapSegment.seed** -> User-defined metadata in AAF


### 10.3 Implementation Considerations

While mapping OpenClap data to AAF:

1. **Data Translation**: Ensure that all non-standard fields in OpenClap are correctly translated to AAF's “user-defined” fields or through custom metadata extensions in AAF.

2. **Application Specifications**: Follow AAF's application-specific guidelines to maintain integrity and compatibility of the data.

3. **Interface Specifications**: Use AAF’s interface specifications to handle APIs and data interchange effectively.


### 10.4 Example Mapping


Here is an example of how a simple `ClapMeta` object would map to AAF metadata fields:

**ClapMeta JSON:**


```yaml

id: "123e4567-e89b-12d3-a456-426614174000"

title: "Example Project"

description: "An example AI video project."

synopsis: "This is an example synopsis."

licence: "MIT"

orientation: "landscape"

durationInMs: 5000

width: 1920

height: 1080

defaultVideoModel: "SVD"

extraPositivePrompt: []

screenplay: "Example screenplay"

isLoop: false

isInteractive: false

```


**AAF Metadata Mapping:**


```

AAF Identification.InstanceUID = "123e4567-e89b-12d3-a456-426614174000"

AAF Mob.Name = "Example Project"

AAF Mob.Comment = "An example AI video project."

AAF DescriptiveObjectFramework = "This is an example synopsis."

AAF ContentStorage = "MIT"

Custom Metadata Field (Orientation) = "landscape"

AAF Mob.Sequence.Length = 5000

AAF DescriptiveClip.FrameLayout = [Width: 1920, Height: 1080]

Custom Metadata Field (DefaultVideoModel) = "SVD"

Custom Descriptive Metadata (Extra Positive Prompt) = []

Custom Metadata Field (Screenplay) = "Example screenplay"

Custom Metadata Field (IsLoop) = false

Custom Metadata Field (IsInteractive) = false

```
