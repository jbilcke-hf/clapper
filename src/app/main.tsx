"use client"

import React, { useEffect } from "react"
import { parseClap } from "@aitube/clap"
import { ClapTimeline, useTimelineState } from "@aitube/timeline"

import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useQueryStringParams } from "@/lib/hooks/useQueryStringParams"

export function Main() {
  const { clapUrl } = useQueryStringParams({
    // clapUrl: `/samples/test.clap`,
    // clapUrl: `/samples/Afterglow%20v10%20X%20Rewrite%20Bryan%20E.%20Harris%202023.clap`,
    clapUrl: '',
  })

  const clap = useTimelineState(s => s.clap)
  const setClap = useTimelineState(s => s.setClap)

  useEffect(() => {
    (async () => {
      if (!clapUrl) {
        console.log("No clap URL provided")
        return
      }
      const res = await fetch(clapUrl)
      const blob = await res.blob()
      const clap = await parseClap(blob)
      setClap(clap)
    })()
  }, [clapUrl])

  return (
    <TooltipProvider>
      <div className={cn(`
        fixed
        flex
        w-screen h-full
        overflow-y-scroll md:overflow-hidden
        items-center justify-center
        bg-black
        `
      )}

      style={{
        backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #34353655, #343536 )"
      }}
        >
        {clap
        ? <ClapTimeline
          showFPS
        />
        : <p className="text-stone-50 text-4xl">Loading..</p>}
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
