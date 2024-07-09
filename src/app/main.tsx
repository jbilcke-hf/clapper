"use client"

import React, { useEffect, useRef } from "react"
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from "react-reflex"
import { useSearchParams } from "next/navigation"
import { DndProvider, useDrop } from "react-dnd"
import { HTML5Backend, NativeTypes } from "react-dnd-html5-backend"
import { useTimeline } from "@aitube/timeline"

import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Monitor } from "@/components/monitor"

import { SettingsDialog } from "@/components/settings"
import { LoadingDialog } from "@/components/dialogs/loader/LoadingDialog"
import { useUI } from "@/services/ui"
import { TopBar } from "@/components/toolbars/top-bar"
import { Timeline } from "@/components/core/timeline"
import { useIO } from "@/services/io/useIO"
import { ChatView } from "@/components/assistant/ChatView"
import { Editors } from "@/components/editors/Editors"

type DroppableThing = { files: File[] }

function MainContent() {
  const ref = useRef<HTMLDivElement>(null)
  const isEmpty = useTimeline(s => s.isEmpty)
  const showTimeline = useUI(s => s.showTimeline)
  const showAssistant = useUI(s => s.showAssistant)
  
  const openFiles = useIO(s => s.openFiles)
  
  const [{ isOver, canDrop }, connectFileDrop] = useDrop({
    accept: [
      NativeTypes.FILE,
    ],
    drop: (item: DroppableThing): void => {
      // console.log("DROP", item)
      openFiles(item.files)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  connectFileDrop(ref)

  const setHasBetaAccess = useUI(s => s.setHasBetaAccess)

  const searchParams = useSearchParams()
  const hasBetaAccess = searchParams.get("beta") === "true"
  useEffect(() => { setHasBetaAccess(hasBetaAccess) }, [hasBetaAccess])

  return (
    <div
      ref={ref}
      className={cn(`
      dark
      select-none
      fixed
      flex flex-col
      w-screen h-screen
      overflow-hidden
      justify-between
      
      font-light
      text-stone-900/90 dark:text-stone-100/90
      `)}
      style={{
        backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #37353455, #373534 )"
      }}
      >
      <TopBar />
        <div className={cn(`
        flex flex-row overflow-hidden
        h-[calc(100vh-40px)] w-screen
        `, 
        isEmpty ? "opacity-0" : "opacity-100"
        )}

        >
          <ReflexContainer orientation="vertical">
          
            <ReflexElement>
              <ReflexContainer orientation="horizontal">
                <ReflexElement
                  minSize={showTimeline ? 100 : 1}
                  >
                  <ReflexContainer orientation="vertical">

       
                    <ReflexElement
                      size={showTimeline ? 400 : 1}
                      minSize={showTimeline ? 100 : 1}
                      maxSize={showTimeline ? 1600 : 1}
                      >
                      <Editors />
                    </ReflexElement>
                    <ReflexSplitter />
                    <ReflexElement
                      minSize={showTimeline ? 100 : 1}
                      >
                      <Monitor />
                    </ReflexElement>
                  </ReflexContainer>
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElement
                  size={showTimeline ? 400 : 1}
                  minSize={showTimeline ? 100 : 1}
                  maxSize={showTimeline ? 1600 : 1}
                  >
                  <Timeline />
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>

          {showAssistant && <ReflexSplitter />}
          {showAssistant && <ReflexElement size={300}><ChatView /></ReflexElement>}

          </ReflexContainer>
        </div>

      <SettingsDialog />
      <LoadingDialog />
      <Toaster />
    </div>
  );
}

export function Main() {
  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <MainContent />
      </DndProvider>
    </TooltipProvider>
  );
}
