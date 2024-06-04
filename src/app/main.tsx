"use client"

import React, { useEffect, useState } from "react"
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RenderClap } from "@/components/interface/render-clap"
import { Timeline } from "@/components/interface/timeline"
import { TopBar } from "@/components/interface/top-bar"
import { useTimelineState } from "@aitube/timeline"
import { SettingsDialog } from "@/components/settings"
import { LoadingDialog } from "@/components/interface/loader/LoadingDialog"

export function Main() {
  const isEmpty = useTimelineState(s => s.isEmpty)
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
            <ReflexElement>
              <RenderClap />
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement>
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
