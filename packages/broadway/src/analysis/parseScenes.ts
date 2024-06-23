import { UUID } from "@aitube/clap"


import { isAllCaps } from "@/utils/isAllCaps"
import { analyzeLine } from "@/analysis/analyzeLine"
import { Scene, SceneEvent, ScreenplaySequence } from "@/types"

import { parseCharacterName } from "@/analysis/parseCharacterName"

/**
 * Check whether the given line contains a character dialogue or action bitmap.
 * @param fullLine the line to check. Might contain spaces.
 */
function isDialogueLine(fullLine: string): boolean {
 
  const containsTabulation = fullLine.startsWith("        ")
  
  // this rule is a bit strict as some text files don't have tabulation..
  // but it helps A LOT
  if (!containsTabulation) {
    return false
  }

  return true
}

/**
 * Check whether the given line contains a character dialogue or action bitmap.
 * @param fullLine the line to check. Might contain spaces.
 */
function isCharacterLine(fullLine: string): boolean {
 
  const containsTabulation = fullLine.startsWith("            ")
  
  // disabled, because some character line include things like parenthesis
  // if (fullLine.match(/\([^\)]+\)/)) {
  //  return false
  // }

  // this rule is a bit strict as some text files don't have tabulation..
  // but it helps A LOT
  if (!containsTabulation) {
    return false
  }

  // the fullLine is important and useful (to locate characters, highlight etc)
  // however it might not be a reliable indicated, so we use uppercase
  const line = fullLine.trim()

  const { isTransition, isSceneDescription, timeType, locationType } = analyzeLine(line)


  const character = parseCharacterName(line)

  // doesn't look like a character name, after filtering
  if (!character) {
   return false
  }

  // console.log("isAllCaps?", isAllCaps(line))
  if (
    line.length < 2 || // line is too short to be a character
    !isAllCaps(line) // line is not all uppercase
    ) {
    // console.log("FAIL 1")
    return false
  }

  if (
    isTransition || // nope, that's a transition or scene
    isSceneDescription
    ) {
    // console.log("FAIL 2")
    return false
  }

  if (
    locationType !== "UNKNOWN" ||
    timeType !== "UNKNOWN"
    ) {
    // console.log("FAIL 3")
    return false
  }

  // nah, it's juste someone shouting
  if (line.includes("!")) {
    return false
  }

  if (
    line === "NO" || line === "NO." ||
    line === "YES" || line === "YES." ||
    line === "STOP" || line === "STOP." 
  ) {
    return false
  }

  const lineWithSpace = ` ${line} `
  if (
    lineWithSpace.includes(" INSERT ") ||
    lineWithSpace.includes(" POV ") ||
    lineWithSpace.includes(" CLOSE-UP ")
  ) {
    return false
  }

  return true
}

/**
 * Parse screenplay script into scenes and events..
 * @param screenplay The entire screenplay script.
 */
export function parseScenes(screenplaySequence: ScreenplaySequence): Scene[] {
  try {
    const screenplay = screenplaySequence.fullText

    let initialScene: string = ""

    // the little text in parenthesis
    let currentDialogueAction = ""

    let currentScene: Scene | undefined = undefined
    let currentEvents: SceneEvent[] = []
    let currentEvent: SceneEvent | undefined = undefined

    let lastCharacter = ""

    let lineNumber = screenplaySequence.startAtLine

    const scenes: Scene[] = []

    for (const lineWithSpaces of screenplay.split("\n")) {

      let line = lineWithSpaces.trim()

      // we are just going to the next page... normally
      if (line.match(/^\d+\.$/)) {
        lineNumber += 1
        continue
      }
      
      // TODO detect scenes (the "descriptions")

      // IMPORTANT: USE THE FULL LINE WITH SPACES HERE!
      const maybeCharacter = parseCharacterName(lineWithSpaces)
      const isCharacter = isCharacterLine(lineWithSpaces)
      // console.log(`isCharacterLine("${lineWithSpaces}"):`, isCharacter)
      // console.log(`maybeCharacter: `, maybeCharacter)
      if (isCharacter && maybeCharacter) {
        // console.log(" found a character:", maybeCharacter)
        lastCharacter = maybeCharacter

        if (currentScene) {
          if (currentEvent) {
            // no, we don't update the line here, since this is a NEW line
            // currentEvent.endAtLine = lineNumber
            currentEvents.push(currentEvent)
          }
          currentEvent = undefined
          currentScene.events = currentEvents
          // no, we don't update the line here, since this is a NEW line
          // currentScene.endAtLine = lineNumber
          scenes.push(currentScene)
          currentEvents = []
          currentScene = undefined
        }

        currentScene = {
          id: UUID(),
          scene: (currentScene as any)?.scene || "",
          line,
          rawLine: lineWithSpaces,
          sequenceFullText: screenplaySequence.fullText,
          sequenceStartAtLine: screenplaySequence.startAtLine,
          sequenceEndAtLine: screenplaySequence.endAtLine,
          startAtLine: lineNumber,
          endAtLine: lineNumber,
          events: [],
        }

        // need to reset this!
        currentDialogueAction = ""

        lineNumber += 1

        continue
      }

      if (!line.length) {

        // if the line is empty, we terminate the current event
        // UNLESS it is obviously not terminated (ie. unless
        // it isn't finishing in a !, ? or .)
        if (currentEvent && (
          currentEvent.description.endsWith("!") ||
          currentEvent.description.endsWith("?") ||
          currentEvent.description.endsWith(".")
        )) {
          // no, we don't update the line here, since this is a NEW line
          // currentEvent.endAtLine = lineNumber
          currentEvents.push(currentEvent)
          currentEvent = undefined
        }

        lineNumber += 1
        continue
      }

      // basic heuristic: the first line of a a scene is the scene description
      if (!initialScene) {

        let firstLine = ` ${line.trim().toUpperCase()} `

        // the first part of the line might be a number - we remove this
        firstLine = firstLine.replaceAll(/^(\s*\d+)[^\d]/gi, " ")
        
        // the last part of the line might be also a number - we remove this too
        firstLine = firstLine.replaceAll(/[^\d](\d+\s*)$/gi, " ")
        
        initialScene = firstLine.trim()

        // reset the last character
        lastCharacter = ""

        lineNumber += 1
        continue
      }


      // parse the line, and determine if it's dialogue,
      // commentary, action..
      const startOfAction = line.match(/^\(/)
      const endOfAction = line.match(/\)$/)
      const isDialogue = isDialogueLine(lineWithSpaces) // <-- yes, spaces are important here!!

      if (startOfAction) {
        if (currentEvent) {
          // no, we don't update the line here, since this is a NEW line
          // currentEvent.endAtLine = lineNumber
          currentEvents.push(currentEvent)
          currentEvent = undefined
        }

        const action = `${
          endOfAction
          ? line.replaceAll("(", "").replaceAll(")", "")
          : line.replaceAll("(", "")
        }`

        currentDialogueAction = action

        currentEvent = {
          id: UUID(),
          type: "action",
          character: lastCharacter,
          description: action,
          behavior: "",
          startAtLine: lineNumber,
          endAtLine: lineNumber,
        }
      } else if (endOfAction && currentEvent?.type === "action") {

        const action = currentEvent.description.trim()
          ? `${currentEvent.description.trim()} ${line.replace(")", "")}`
          : line.replace(")", "")

        currentEvent.description = action
        currentDialogueAction = action

        currentEvent.endAtLine = lineNumber
        currentEvents.push(currentEvent)
        currentEvent = undefined
      } else if (currentEvent) {
        const typeHasChanged = isDialogue && currentEvent.type !== "dialogue"

        // we are not in a dialogue anymore, so let's clear the dialogue action buffer
        if (currentEvent.type === "description") {
          currentDialogueAction = ""
        }

        if (typeHasChanged) {
          // no, we don't update the line here, since this is a NEW line
          // currentEvent.endAtLine = lineNumber
          currentEvents.push(currentEvent)
          currentEvent = undefined
    
          currentEvent = {
            id: UUID(),
            type: isDialogue ? "dialogue" : "action",
            character: lastCharacter,
            description: line,
            behavior: isDialogue ? currentDialogueAction : "",
            startAtLine: lineNumber,
            endAtLine: lineNumber
          }
        } else {
          // current event type has not changed, we are just extending it
          currentEvent.description =
            currentEvent.description.trim()
            ? `${currentEvent.description.trim()} ${line}`
            : `${line}`

          currentEvent.endAtLine = lineNumber
        }
      } else {
        // we are creating a new event
        currentEvent = {
          id: UUID(),
          type: lastCharacter && isDialogue ? "dialogue" : "description",
          character: lastCharacter && isDialogue ? lastCharacter : "",
          description: `${line}`,
          behavior: isDialogue ? currentDialogueAction : "",
          startAtLine: lineNumber,
          endAtLine: lineNumber
        }
      }

      lineNumber += 1
    }


    if (currentScene) {
      if (currentEvent) {
        // no, we don't update the line here, since this is a NEW line
        // currentEvent.endAtLine = lineNumber
        currentEvents.push(currentEvent)
      }
      currentEvent = undefined
      currentScene.events = currentEvents
      // no, we don't update the line here, since this is a NEW line
      // currentScene.endAtLine = lineNumber
      scenes.push(currentScene)
      currentEvents = []
      currentScene = undefined
    }

    // one last trick, which is pretty important actually: we expand the action further
    for (const scene of scenes) {
      const sceneEvents: SceneEvent[] = []
      for (const event of scene.events) {
        event.description.split(/\. /).forEach(sentence => {
          sceneEvents.push({
            ...event,
            description: sentence
          })
        })
      }

      scene.events = sceneEvents
    }
    return scenes
  } catch (err) {
    console.error(err)
    return []
  }
}