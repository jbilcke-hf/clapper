"use client"

import React, { useEffect, useState } from "react"
import { FileUploader } from "react-drag-drop-files"
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

  const handleChange = async (file: File) => {
    const clap = await parseClap(file)
    setClap(clap)
  };
  
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
        w-screen h-screen
        overflow-hidden
        items-center justify-center
        bg-[rgb(58,54,50)]
        `
      )}
        >
        {clap
        ? <ClapTimeline
          showFPS={false}
          className={cn(

          )}
        />
        :
          <FileUploader
            handleChange={handleChange}
            name="file" types={["clap"]}>
          <div className={cn(`
          flex
        w-screen h-screen
        overflow-hidden
        items-center justify-center
        cursor-pointer
        `, clapUrl ? 'animate-pulse' : '')}
        style={{
          backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #34353655, #343536 )"
        }}><p
        className="text-stone-100 font-sans font-thin text-[4.5vw]"
        style={{ textShadow: "#000 1px 0 3px" }}
        >
          {clapUrl ? 'Loading..' : 'Click here to load a .clap'}
          </p>
          </div>
          </FileUploader>
        }
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
