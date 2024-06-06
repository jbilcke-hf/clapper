"use client"

import React from "react"
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'
import { useTimelineState } from "@aitube/timeline"

import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RenderClap } from "@/components/core/render-clap"

import { SettingsDialog } from "@/components/settings"
import { LoadingDialog } from "@/components/dialogs/loader/LoadingDialog"
import { useUI } from "@/controllers/ui"
import { TopBar } from "@/components/toolbars/top-bar"
import { Timeline } from "@/components/core/timeline"

export function Main() {

  const isEmpty = useTimelineState(s => s.isEmpty)
  const showTimeline = useUI((s) => s.showTimeline)

  return (
    <TooltipProvider>
      <div className={cn(`
        dark
        select-none
        fixed
        flex flex-col
        w-screen h-screen
        overflow-hidden
        items-center justify-center
        font-light
        text-stone-900/90 dark:text-stone-100/90
        `)}
        style={{
          backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #37353455, #373534 )"
        }}
        >
        <TopBar />
        <div className={cn(
          `flex flex-row flex-grow w-full overflow-hidden`, 
          isEmpty ? "opacity-0" : "opacity-100"
         )}>
          <ReflexContainer orientation="horizontal">
            <ReflexElement
              >
              <RenderClap />
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement
              size={showTimeline ? 600 : 1}
              minSize={showTimeline ? 150 : 1}
              maxSize={showTimeline ? 1200 : 1}
              >
              <Timeline />
            </ReflexElement>
          </ReflexContainer>
        </div>
        <SettingsDialog />
        <LoadingDialog />
        <Toaster />
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
