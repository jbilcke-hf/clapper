"use client"

import { useState, useTransition } from "react"
import { ClapOutputType, ClapProject, ClapSegment, ClapSegmentCategory, newSegment } from "@aitube/clap"
import { DEFAULT_DURATION_IN_MS_PER_STEP, findFreeTrack, useTimeline } from "@aitube/timeline"

import { useAssistant } from "@/controllers/assistant/useAssistant"
import { queryAssistant } from "@/app/api/assistant/providers/openai/askAssistant"
import { useSettings } from "@/controllers/settings"

import { ChatBubble } from "./ChatBubble"
import { Input } from "../ui/input"

export function ChatView() {
  const [_isPending, startTransition] = useTransition()

  /*
  const others = useLiveProject((state) => state.liveblocks.others)
  const userCount = others.length
  console.log(`TODO: finish this There are ${userCount} other user(s) online`)
  */
  
  const [draft, setDraft] = useState("")
  const runCommand = useAssistant((s) => s.runCommand)
  const history = useAssistant((s) => s.history)
  const addEventToHistory = useAssistant((s) => s.addEventToHistory)

  /*
  const updateSegment = useApp((state) => state.updateSegment)
  const addSegment = useApp((state) => state.addSegment)
  const projectInfo = useApp((state) => state.projectInfo)
  */

  const handleSubmit = () => {
    const message = draft.trim()

    if (!message) {
      return
    }

    setDraft("")

    addEventToHistory({
      senderId: "director",
      senderName: "Director",
      message,
    })
  
    // the LLM is behind a server action
    startTransition(async () => {
  
       
      const basicCommand = await runCommand(message)
      // LLM analysis can be slow and expensive, so first we try to see if this was a trivial command
      // like "start", "pause", "stop" etc
      if (basicCommand) {

        addEventToHistory({
          senderId: "assistant",
          senderName: "Assistant",
          message: `${basicCommand}`,
        })
        return // no need to go further
      }
    

      const clap: ClapProject = useTimeline.getState().clap

      console.log(`TODO @julian: restore the concept of "addSegment()", "updateSegment()", "active segment" and "cursor position" inside @aitube-timeline`)
      // const { addSegment, activeSegments, cursorInSteps,  } = useTimeline.getState()

      const activeSegments: ClapSegment[] = []
      const cursorInSteps = 0
  
      const referenceSegment: ClapSegment | undefined = activeSegments.at(0)
      
      if (!referenceSegment) {
        throw new Error(`No segment under the current cursor`)
      }

      console.log(`TODO @julian: filter entities to only keep the ones in the current active segment? (although.. maybe a bad idea since the LLM need as much context as possible to "fill in the gap" eg. repair/invent missing elements of the story)`)

      const entities = clap.entityIndex

      const projectInfo = clap.meta.description

      const sceneId = referenceSegment.sceneId

      const scene = clap.scenes.find(s => s.id === sceneId)
      
      const fullScene: string = scene?.sequenceFullText || ""
      const actionLine: string = scene?.line || ""
    
      const segments: ClapSegment[] = activeSegments
        .filter(s =>
          s.category === ClapSegmentCategory.LOCATION ||
          s.category === ClapSegmentCategory.TIME ||
          s.category === ClapSegmentCategory.LIGHTING ||
          s.category === ClapSegmentCategory.ACTION ||
          s.category === ClapSegmentCategory.DIALOGUE ||
          s.category === ClapSegmentCategory.WEATHER  
        )
  
      console.log(`TODO @julian: provide both contextual segments and editable ones to the LLM?`)

      const { prompt, categoryName, llmOutput } = await queryAssistant({
        settings: useSettings.getState().getSettings(),
        prompt: message,
        segments,
        fullScene,
        actionLine,
        entities,
        projectInfo,
      })
      if (!prompt.length) {
        addEventToHistory({
          senderId: "assistant",
          senderName: "Assistant",
          message: llmOutput || "🤔" // or "???" for a "boomer" theme
        })
        return
      }
  
      let match = segments.find(s => s.category === categoryName) || undefined
      if (!match) {
  
        const startTimeInMs = cursorInSteps * DEFAULT_DURATION_IN_MS_PER_STEP
        const durationInSteps = 4
        const durationInMs = durationInSteps * DEFAULT_DURATION_IN_MS_PER_STEP
        const endTimeInMs = startTimeInMs + durationInMs
  
        const newSeg = newSegment({
          startTimeInSteps: cursorInSteps,
          prompt: [prompt],
          durationInSteps: 4,
          trackId: findFreeTrack({
            segments,
            startTimeInMs,
            endTimeInMs,
          }), 
          outputType: ClapOutputType.TEXT,
          categoryName,
        })
        console.log("Creating new existing segment:", newSeg)
  
        console.log(`TODO Julian: add the segment!!`)
        // addSegment(newSeg)

        addEventToHistory({
          senderId: "assistant",
          senderName: "Assistant",
          message: `Segment added: ${newSeg.prompt}`,
        })
      } else {
    
        console.log("Updating an existing segment to:", {
          ...match,
          prompt,
          label: prompt,
        })
  
        console.log(`TODO Julian: update the segment!!`)
        // addSegment(newSeg)

        /*
        updateSegment({
          ...match,
          prompt,
          label: prompt,
        })
          */

        addEventToHistory({
          senderId: "assistant",
          senderName: "Assistant",
          message: `Segment updated: ${prompt}`,
        })
      }

    })
  
  }

  return (
    <div className="flex h-full w-full items-center justify-center pt-8">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-grow overflow-y-scroll">
          <div className="flex flex-col space-y-6 p-2 w-full">
            {history.map(event => (
                <ChatBubble
                  key={event.eventId}
                  {...event}
                />
            ))}
          </div>
        </div>
        <div>
          <Input
            placeholder="Ask something (a red car, etc)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={({ key }) => {
              if (key === 'Enter') {
                handleSubmit()
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
