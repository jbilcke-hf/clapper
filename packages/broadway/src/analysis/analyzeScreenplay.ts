import { ClapEntity, ClapOutputType, ClapScene, ClapSegment, ClapSegmentCategory, newEntity, UUID } from "@aitube/clap"

import { Screenplay, TemporaryAssetData } from "@/types"
import { pick } from "@/utils"
import { getEra, getMostProbableEras } from "@/parsers/eras"
import { getGenre, getMostProbableGenres } from "@/parsers/genres"
import { getEntities } from "@/utils/getEntities"
import { onlyContainsStrangeNumber } from "@/utils/onlyContainsStrangeNumber"
import { parseTransition } from "@/parsers/transitions/parseTransition"
import { ScreenplaySequenceType } from "@/constants/screenplaySequences"
import { createSegment } from "@/factories/createSegment"
import { parseLocations, parseLocationType } from "@/parsers/locations"
import { parseLights } from "@/parsers/lights"
import { parseWeather } from "@/parsers/weather"
import { parseShots } from "@/parsers/shots"
import { parseSounds } from "@/parsers/sounds"
import { mockCategoryPrompts } from "@/constants/mocks"
import { DEFAULT_COLUMNS_PER_SLICE } from "@/constants/general"

import { parseCharacterName } from "./parseCharacterName"
import { analyzeName } from "./analyzeName"
import { parseDialogueLine } from "./parseDialogueLine"
import { isVoiceOver } from "./isVoiceOver"
import { findSubtext } from "./findSubtext"

export async function analyzeScreenplay(
  screenplay: Screenplay,
   onProgress?: (value: number, message?: string) => Promise<void>
  ): Promise<{
  movieGenreLabel: string
  extraPositivePrompt: string[]
  segments: ClapSegment[]
  entitiesByScreenplayLabel: Record<string, ClapEntity>
  entitiesById: Record<string, ClapEntity>
  finalPlainText: string
  totalDurationInMs: number
  scenes: ClapScene[]
}> {
  /**
   * List of all segments identified inside the screenplay
   */
  const segments: ClapSegment[] = []

  // TODO: use those as an index?
  // const segmentsByStartTime: Record<number, SegmentData[]> = {}
  // const segmentsByEndTime: Record<number, SegmentData[]> = {}

  // this is only used during analysis
  const assetsByLabel: Record<string, TemporaryAssetData> = {}
  
  const entitiesByScreenplayLabel: Record<string, ClapEntity> = {}
  const entitiesById: Record<string, ClapEntity> = {}

  let startTimeInSteps = 1

  let progress = 0
  await onProgress?.(progress, "Analyzing time period..")

  // those are not going to change a lot during the movie,
  // although it is true some movies use this as a trick (eg. Titanic)

  let movieEras = await getMostProbableEras(screenplay.fullText, 2)
  let movieEraLabel = Object.keys(movieEras)[0] || "contemporary"
  let movieEra = getEra(movieEraLabel)
  // console.log("movieEras:", { movieEras, movieEraLabel, movieEra })
  await onProgress?.(progress += 10, "Analyzing genre..")

  // using the movie genre isn't probably a good idea because thousands of words will be mentionned,
  // triggering a lot of different and unrelated genres
  // still this is useful when the genre if a given sequence cannot be guessed
  let movieGenres = await getMostProbableGenres(screenplay.fullText, 20)
  let movieGenreLabel = Object.keys(movieGenres)[0] || ""
  let movieGenre = getGenre(movieGenreLabel)
  await onProgress?.(progress += 10, "Analyzing each scenes..")

  const extraPositivePrompt = movieGenreLabel ? [movieGenreLabel]: []


  /*
  console.log("movie:", {
    movieEras,
    movieEraLabel,
    movieEra,
    movieGenres,
    movieGenreLabel,
    movieGenre
  })
  */

  // we use a sliding window system
  // "to paint over time" the characteristics of a scene
  // this should greatly improve the visual quality of a scene
  // however this can also proves an issue if we do not reset it at the right time

  let currentDescription = "" // this should be slightly long-lived
  let currentAction = "" // this should be short lived
  let currentLocationName = ""
  let currentLocationType: ScreenplaySequenceType = "UNKNOWN"
  let currentTime = ""
  let currentLighting = ""
  let currentWeather = ""
  let currentShotType = ""
  let currentSound = ""
  let currentMusic = ""

  let nbProcessedSequences = 0

  const sizeOfProgressChunk = Math.floor(screenplay.sequences.length / 3)

  let totalDurationInMs = 0

  for (const sequence of screenplay.sequences) {

    if ((++nbProcessedSequences % sizeOfProgressChunk) === 0) {
      await onProgress?.(progress += 20, `Analyzing sequences (${nbProcessedSequences}/${screenplay.sequences.length} completed)`)
    }

    // those are not going to change a lot during the sequence
    let sequenceGenres = await getMostProbableGenres(sequence.fullText, 2)


    // note: we use the movie genre as a fallback
    let sequenceGenreLabel = Object.keys(sequenceGenres)[0] || "classic" // movieGenre
    let sequenceGenre = getGenre(sequenceGenreLabel)

    /*
    TODO we should use this, but with correct length, to space over multiple steps

    const sequenceInOrOut: SegmentData = createSegment({    
      startTimeInSteps,
      prompt: sequence.type === "INTERIOR" ? "Interior" : "Outdoor",
      categoryName: "location",
    })

    const sequenceLocation: SegmentData = createSegment({    
      startTimeInSteps,
      prompt: sequence.location,
      categoryName: "location",
    })

    const sequenceTime: SegmentData = createSegment({    
      startTimeInSteps,
      prompt: sequence.time,
      categoryName: "time",
    })
    */
    getEntities(sequence.location).map(uppercaseAssetName => {

      // console.log(`FOUND REFERENCE TO ENTITY: ${entity}`)
      // console.log(`CONTEXT:`, sequence.fullText)

      const existingOccurrences = assetsByLabel[uppercaseAssetName]?.occurrences || 0

      const existingAsset = assetsByLabel[uppercaseAssetName]
      const existingAssetSequences = existingAsset?.sequences || []

      assetsByLabel[uppercaseAssetName] = {
        id: UUID(), // unique identifier of the assets (UUID)
        type: "Description",
        category: "location",
        label: uppercaseAssetName, // the asset name (eg. in the script)
        content: uppercaseAssetName, // url to the resource, or content string
        occurrences:  1 + existingOccurrences,
        sequences: existingAssetSequences.concat(
          existingAssetSequences.find(s => s.id === sequence.id)
            ? []
            : sequence // only add the sequence if it's not already there
          ),
          predictedPrompt: "",
      }
      if (!entitiesByScreenplayLabel[uppercaseAssetName]) {
        const newEnt = newEntity({
          category: ClapSegmentCategory.LOCATION,
          triggerName: uppercaseAssetName, // uppercase
          label: uppercaseAssetName,

          // TODO: find a way to extract the definition of the location and
          // inject it in this field
          description: "", // <-- TODO
          gender: "object",
        })
        entitiesByScreenplayLabel[newEnt.triggerName] = newEnt
        entitiesById[newEnt.id] = newEnt
        // console.log(`entitiesByScreenplayLabel[${newEntity.triggerName}] = `, newEntity)
      }
    })

    for (const scene of sequence.scenes) {

      const sceneCharacters: Record<string, boolean> = {}

      for (const event of scene.events) {
        if (event.character) {
          sceneCharacters[event.character] = true
        }
      }

      for (const event of scene.events) {
        let startTimeInLines = event.startAtLine
        let endTimeInLines = event.endAtLine
        // console.log(`---- event [${startTimeInLines}:${endTimeInLines}] = "${event.description}" ---`)
  
        try {
          const segmentCandidates: ClapSegment[] = []

          // the "action prompt" is very interesting for us, because we can look into it
          // to extract infor about weather, sounds etc
          // (contrary to the dialogue, which are less relevant for us)

          if (onlyContainsStrangeNumber(event.description)) {
            // console.log("skipping anomaly")
            continue
          }

          // if we detect a transition we will bypass the rest of the block
          // that's because a transition is an "in-between" event
          const transition = parseTransition(event.description)
          if (transition) {
            // console.log(`Parsed a transition: "${transition}"`)

            const durationInSteps = 2

            const transitionSegment: ClapSegment = {
              ...createSegment({    

                // full fade to black
                startTimeInSteps,

                // alternatively, we can also create cross-over transitions, like this:
                // startTimeInSteps: Math.round(startTimeInSteps - (durationInSteps / 2)),
                
                durationInSteps,

                startTimeInLines: event.startAtLine,
                endTimeInLines: event.endAtLine,
                sceneId: scene.id,
                
                // we automatically eliminate empty prompt arrays,
                // so we must put something in here
                prompt: [transition],
  
                categoryName: ClapSegmentCategory.TRANSITION,
                outputType: ClapOutputType.TEXT,
              }),

              // watch-out: this 7 is a bit arbitrary, we should instead
              // assign it to another track eg. the camera one
              // or track 0 maybe
              track: 7,
            }

            segments.push(transitionSegment)

            // only relevant in case of a fade to black
            startTimeInSteps += durationInSteps // 2 steps

            // a transition isn't really a scene shot, so we just ignore the rest
            continue
          }

          const sequenceLocation = sequence.location.join(", ")

          if (sequenceLocation) {
            const weAreStillAtTheSameLocation = sequenceLocation !== currentLocationName

            // we reset those for each shot
            currentShotType = ""
            currentSound = ""
            currentAction = ""
              
            // while those last for longer spans of time
            if (weAreStillAtTheSameLocation) {
              currentDescription = ""
              currentLocationName = ""
              currentLocationType = "UNKNOWN"
              currentTime = ""
              currentLighting = ""
              currentWeather = ""
              currentMusic = ""
            }
          }

          currentDescription = (
            event.type === "action" || event.type === "description"
            ? event.description
            : ""
          ) || currentDescription

          // note that here we don't take the previous value into account
          currentAction =
            event.type === "action" || event.type === "description"
            ? event.description
            : ""

          //////////////////////////////////////////////////////////////////////////////
          //
          //    /!\ The preview segment must be the first one! /!\
          //
          //   That is because it is a special segment used to create the thumbnail!
          //
          //////////////////////////////////////////////////////////////////////////////
          
          
          segmentCandidates.push(createSegment({    
            startTimeInSteps,
            startTimeInLines: event.startAtLine,
            endTimeInLines: event.endAtLine,
            sceneId: scene.id,
            // we automatically eliminate empty prompt arrays,
            // so we must put something in here
            prompt: ["movie"],

            categoryName: ClapSegmentCategory.VIDEO,
            outputType: ClapOutputType.VIDEO,
          }))
      
          segmentCandidates.push(createSegment({    
            startTimeInSteps,
            startTimeInLines: event.startAtLine,
            endTimeInLines: event.endAtLine,
            sceneId: scene.id,
            prompt: [
              // "photo"
              "movie still", // so it isn't empty
            ],
            categoryName: ClapSegmentCategory.STORYBOARD,
            outputType: ClapOutputType.IMAGE,
          }))

          segmentCandidates.push(createSegment({    
            startTimeInSteps,
            startTimeInLines: event.startAtLine,
            endTimeInLines: event.endAtLine,
            sceneId: scene.id,
            prompt: [
              ...sequenceGenre.prompts.STYLE,
              "cinematic photo",
              "movie screencap",
              ...movieEra.prompts.STYLE
            ],
            categoryName: ClapSegmentCategory.STYLE,
          }))

          // the parsed location is less reliable than the sequence location
          const parsedLocations = await parseLocations([ currentDescription ])

          const parsedLocation = parsedLocations.join(", ")

          const detectedLocation = sequenceLocation || parsedLocation

          // LOCATION segment
          currentLocationName = detectedLocation || currentLocationName
          if (currentLocationName) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [currentLocationName],
              categoryName: ClapSegmentCategory.LOCATION,
            }))
          }
          
  
          
          const parsedLocationType = await parseLocationType([ currentDescription ])

          // we try to use the sequence location type (interior / exterior")
          // if it is unavailable then we use an heuristic, which might not be reliable
          currentLocationType =
            sequence.type === "UNKNOWN" && parsedLocationType !== "UNKNOWN"
              ? parsedLocationType :
            sequence.type === "UNKNOWN"
              ? currentLocationType
              : sequence.type


          // convert the type to a string prompt
          // (we ignore unknown location types)
          // e use the term "Inside" instead of "Indoor" as it suit better
          // places that are like cars, helicopters, bus, metro, submarines etc
          const locationTypeAsPrompt = currentLocationType === "INTERIOR" ? "Inside" : 
            currentLocationType === "EXTERIOR" ? "Outdoor" :
            currentLocationType === "INT./EXT." ? "Indoor and outdoor" :
            "" // ignored

          if (locationTypeAsPrompt) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [locationTypeAsPrompt],
              categoryName: ClapSegmentCategory.LOCATION,
            }))
          }


          // LIGHTING / TIME segment
          currentTime = (sequence.time || currentTime).toLowerCase()

          // let's skip unknown time
          if (currentTime === "unknown") {
            currentTime = ""
          }

          const parsedLight = (await parseLights([ currentDescription ])).join(", ")
          currentLighting = parsedLight || currentLighting

          // console.log({ currentTime, currentLighting })

          // note: 
          if (currentTime || currentLighting) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [
                currentTime,
                currentLighting,
                ...sequenceGenre.prompts.LIGHTING,
                ...movieEra.prompts.LIGHTING,
              ],
              categoryName: ClapSegmentCategory.LIGHTING,
            }))
          }
          
          const parsedWeather = (await parseWeather([ currentDescription ])).join(", ")
          currentWeather = parsedWeather || currentWeather
          if (currentWeather) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [
                currentWeather,
                ...sequenceGenre.prompts.WEATHER,
              ],
              categoryName: ClapSegmentCategory.WEATHER,
            }))
          }

          // by default, we assume that we want a close range shot for scenes
          // with a character in it
          const shotTypeForCharacters = [
            sequence.type === "EXTERIOR" ? "medium-long shot" : "",
            "medium shot",
            "medium close-up",
            "close-up",
            "American shot",
            // "Italian shot",
            // "trolley shot"
          ].filter(x => x)

          const shotTypesForEverythingElse =
            sequence.type === "INTERIOR"
            ? [
              "medium-long shot",
              "medium shot",
              "full shot",
            ] : [
              "long wide establishing shot",
              "extreme long shot",
              "long shot",
              "medium-long shot",
              "medium shot",
              "full shot",
            ]

          const defaultShotType = event.character
            ? pick(shotTypeForCharacters)
            : pick(shotTypesForEverythingElse)

          // console.log("currentDescription:", currentDescription)
          // in some movies, the shot type may be embed in the description text
          // this is the best place
          const shotTypes = await parseShots([ currentDescription ])
          // console.log("shot types:", shotTypes)
          currentShotType = (shotTypes.join(", ") || currentShotType) || defaultShotType
          // console.log("currentShotType:", currentShotType)

          if (currentShotType) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [
                currentShotType,
                ...sequenceGenre.prompts.CAMERA,
                ...movieEra.prompts.CAMERA
              ],
              categoryName: ClapSegmentCategory.CAMERA,
            }))
          }

          const currentSliceEntities: ClapEntity[] = []

          for (const rawUppercaseAssetName of getEntities(event.character)) {
            // note: the "uppercaseAssetName" might be something like "JOHN'S VOICE"
            // which is why we normalize it, and convert it to a smaller characterName
            const characterName = parseCharacterName(rawUppercaseAssetName)
            const existingAsset = assetsByLabel[characterName]
            const existingOccurrences = existingAsset?.occurrences || 0
            const existingAssetSequences = existingAsset?.sequences || []
      
            // console.log("trigger name identified:", uppercaseAssetName)
            assetsByLabel[characterName] = {
              id: UUID(), // unique identifier of the assets (UUID)
              type: "Description",
              category: "character",
              label: characterName, // the asset name (eg. in the script)
              content: characterName, // url to the resource, or content string
              occurrences: 1 + existingOccurrences,
              sequences: existingAssetSequences.concat(
                existingAssetSequences.find(s => s.id === sequence.id)
                  ? []
                  : sequence // only add the sequence if it's not already there
                ),
              predictedPrompt: ""
            }

            if (!entitiesByScreenplayLabel[characterName]) {
              // console.log(`no entity going by "${entity}", so creating one`)

              // region is available, but it has a different name from what
              // ElevenLabs expect (we should probably create our own unified data type,
              // and a map between it and ElevenLabs accents)
              const { name, age, gender, /*region*/ } = await analyzeName(characterName)
           
              const newEnt = newEntity({

                // the trigger name is used in case we have a LoRA attached to the character
                triggerName: characterName, // uppercase
                label: name,

                // TODO: put any other info we can get from the script
                description: `${name} is a ${gender}`,

                category: ClapSegmentCategory.CHARACTER,
                age,
                gender,
                region: "american",
                
                // TODO put things like "blond hair, wearing a suit" etc
                // appearance: "",
              })
              // console.log("newEnt:", newMod)
              entitiesByScreenplayLabel[characterName] = entitiesById[newEnt.id] = newEnt
            }
            
            currentSliceEntities.push(entitiesByScreenplayLabel[characterName])
          }
          
          // if (currentSliceEntities.length) console.log("currentSliceEntities:", currentSliceEntities)
          /*
          Nope we don't do that anymore, instead we use our new "Entity" system

          const character: SegmentData = createSegment({    
            startTimeInSteps,
            prompt: event.character ? [event.character] : [], // Object.keys(sceneCharacters),
            categoryName: "character",
          })
          */

          // if (currentSliceEntities.length) console.log("identified entities:", currentSliceEntities)


          // this is how we create nicely animated characters
          // who are not just talking but also doing other things at the same time
          if (event.behavior) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [event.behavior],
              label: `${currentSliceEntities[0]?.label}: ${event.behavior}`,
              categoryName: ClapSegmentCategory.ACTION,

              // important: we need to use the character entity
              // based on a fine-tune, a LoRA, IP adapter or other similar things
              entityId: currentSliceEntities[0]?.id || ""
            }))
          }

          const dialogueLine = parseDialogueLine(event.description)
            
          if (event.type === "dialogue" && dialogueLine) {
            // console.log("found a dialogue! currentSliceEntities:", currentSliceEntities)
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [dialogueLine],

              // it is easier to understand in the UI when we can see the speaker's name
              label:
                currentSliceEntities[0]?.label
                ? `${currentSliceEntities[0].label}: ${dialogueLine}`
                : "",
              categoryName: ClapSegmentCategory.DIALOGUE,
              entityId: currentSliceEntities[0]?.id || ""
            }))
          }

          // no need to keep voice over, it's not interesting
          if (currentAction && !isVoiceOver(currentAction)) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [currentAction],
              label:
                event.character
                  ? `${currentSliceEntities[0]?.label || event.character}: ${currentAction}`
                  : "",
              categoryName: ClapSegmentCategory.ACTION,
              entityId:
              event.character
                ? currentSliceEntities[0]?.id || ""
                : "",
            }))
          }

          // @deprecated, we should only use TIME instead,
          // as it is more encompassing
          segmentCandidates.push(createSegment({    
            startTimeInSteps,
            startTimeInLines: event.startAtLine,
            endTimeInLines: event.endAtLine,
            sceneId: scene.id,
            prompt: [
              // note: here we use the *GENRE* parser, and on the FULL MOVIE
              //...sequenceGenre.prompts.era,

              // note: here we use the *ERA* parser, and on the FULL MOVIE
              ...movieEra.prompts.ERA,
            ],
            categoryName: ClapSegmentCategory.ERA,
          }))

          const defaultSoundPrompt =
            event.type === "dialogue"

            // a generic "people talking" sound isn't very interesting
            ? []
            // ? ["people talking"]

            // event.description.includes(" SOUND ")
            //   ? event.description :
            : currentLocationType === "EXTERIOR" && currentTime !== "night"
              ? ["wind", "birds"]
            : currentLocationType === "EXTERIOR" && currentTime === "night"
              ? ["crickets and cicadas sounds during night"]
            : []

          const parsedSound = await parseSounds([ currentDescription ])
          currentSound = (parsedSound.join(", ") || currentSound) || defaultSoundPrompt.join(", ")
    
          if (currentSound) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [
                currentSound,
                // note: here we use the *GENRE* parser, and on the FULL MOVIE
                ...sequenceGenre.prompts.SOUND,
                
                ...movieEra.prompts.SOUND,
              ],
              entityId: currentSliceEntities[0]?.id || undefined,
              categoryName: ClapSegmentCategory.SOUND,
            }))
          }

          currentMusic = pick(mockCategoryPrompts.MUSIC) || currentMusic

          if (currentMusic) {
            segmentCandidates.push(createSegment({    
              startTimeInSteps,
              startTimeInLines,
              endTimeInLines,
              sceneId: scene.id,
              prompt: [
                currentMusic,
                // note: here we use the *GENRE* parser, and on the FULL MOVIE
                ...sequenceGenre.prompts.MUSIC,

                ...movieEra.prompts.MUSIC
              ],
              categoryName: ClapSegmentCategory.MUSIC,
            }))
          }

          // now we filter segments to only keep the ones with a non-empty prompt
          const newSegments = segmentCandidates.filter(segment => segment.prompt.length)
            
          // we need to assign each segment to a track, without collision
          let track = 1
          for (const newSegment of newSegments) {
            const segmentToSave: ClapSegment = {
              ...newSegment,
              track: track++
            }

            if (segmentToSave.endTimeInMs > totalDurationInMs) {
              totalDurationInMs = segmentToSave.endTimeInMs
            }

            segments.push(segmentToSave)
          }

          startTimeInSteps += DEFAULT_COLUMNS_PER_SLICE
        } catch (err) {
         console.error("failed to process an event:", err)
        }
      }
    }
  }
  
  // TODO Julian: move this part to another library
  // if (screenplayEntityDetectionStrategy === "llm_first_scene") {
  //   await onProgress?.(progress += 10, "Imagining entities (will take a while)..")
  //   for (const [name, asset] of Object.entries(assetsByLabel)) {
// 
  //     console.log(` - imagining "${name}"..`)
  //       
  //     await onProgress?.(progress, `Imagining "${name}"..`)
// 
  //     // note: this will perform client-side calls to Hugging Face, which may not be desireable
  //     // an alternative could be to use a proxy (see /api/huggingface/predict.ts)
// 
  //     let description = await analyzeAsset({
  //       asset,
  //     
  //       movieGenreLabel,
  //       movieEraLabel,
// 
  //       // to avoid being rate-limited by Hugging Face,
  //       // we introduce a generous artificial delay
  //       delayBeforeApiCallInMs: 5000,
  //       
  //       // delayBetweenAttempts: 10000,
  //       // nbMaxAttempts: 3
  //     })
// 
  //     /*
  //     // Hugging Face likes to timeout and throttle, sometimes for no reason
  //     // this is you should always entities locally, folks!
  //     if (!description.trim()) {
  //       await sleep(10000)
  //       description = await predict(prompt + ".", nbMaxTokens)
// 
  //       if (!description.trim()) {
  //         await sleep(30000)
  //         description = await predict(prompt + ".", nbMaxTokens)
  //       }
  //     }
  //     */
// 
  //   
  //     const entity = entitiesByScreenplayLabel[name]
  //     if (entity) {
  //       // console.log("entity:", entity)
  //       // console.log("existing description:", entity.description)
  //       if (description) {
  //         console.log(` - entity description: "${description}"\n`)
  //         entity.description = description
  //       } else {
  //         console.log(` - error: description is empty, ignoring..`)
  //       }
  //     } else {
  //       console.log(`error, couldn't find entity ${name}`)
  //     }
  //   }
  // }


  let scenes: ClapScene[] = []

  for (const sequence of screenplay.sequences) {
    scenes = scenes.concat(sequence.scenes)
  }

  let finalPlainTextLines = screenplay.fullText.split("\n")

  // let lastRow = 0

  for (const segment of segments) {
    let needle = ""
    if (segment.category === ClapSegmentCategory.DIALOGUE
       || segment.category === ClapSegmentCategory.ACTION
    ) {
      needle = segment.prompt
    }
    if (!needle) { continue }

    let searchZoneLines = finalPlainTextLines.slice(
      segment.startTimeInLines,
      segment.endTimeInLines
    )

    let haystack = searchZoneLines.join("\n")

    
    // console.log(`searching for: "${needle}"\ninside: "${haystack}"`)

    try {
      const found = findSubtext(needle, haystack)
      // console.log(`found:`, found)

      if (typeof found?.startAtRow === "number") {
        // this improves the quality of results a bit,
        // but sometimes the findSubtext function doesn't find anything
        segment.startTimeInLines += 1 + (found.startAtRow || 0)
        segment.endTimeInLines += 1 + (found.endAtRow || 0)
      }

    } catch (err) {
      // console.log(`not found`)
    }

  }

  // const finalPlainText = finalPlainTextLines.join("\n")
  const finalPlainText = screenplay.fullText

  return {
    movieGenreLabel,
    extraPositivePrompt,
    segments,
    entitiesByScreenplayLabel,
    entitiesById,
    finalPlainText,
    totalDurationInMs,
    scenes
  }
}
