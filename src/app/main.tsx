"use client"

import React, { useEffect, useState } from "react"
import { FileUploader } from "react-drag-drop-files"
import 'react-reflex/styles.css'
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'
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

  const [isImporting, setIsImporting] = useState(false)
  const clap = useTimelineState(s => s.clap)
  const setClap = useTimelineState(s => s.setClap)
  const isLoading = useTimelineState(s => s.isLoading)
  const isEmpty = useTimelineState(s => s.isEmpty)

  const isBusy = isLoading || isImporting

  const handleChange = async (file: File) => {
    if (file.name.endsWith("clap")) {
      setIsImporting(true)
      try {
        const clap = await parseClap(file)
        setClap(clap)
        setTimeout(() => {
          setIsImporting(false)
        }, 500)
      } catch (err) {
        console.error(err)
        setIsImporting(false)
      }
    } else {
      setIsImporting(true)
      try {
        const res = await fetch("https://jbilcke-hf-broadway-api.hf.space", {
          method: "POST",
          headers: { 'Content-Type': 'text/plain' },
          body: await file.text(),
        })
        const blob = await res.blob()
        const clap = await parseClap(blob)
        setClap(clap)
        setTimeout(() => {
          setIsImporting(false)
        }, 1000)
      } catch (err) {
        console.error(err)
        setIsImporting(false)
      }
    }
  };
  
  useEffect(() => {
    (async () => {
      if (!clapUrl) {
        console.log("No clap URL provided")
        return
      }
      setIsImporting(true)
      const res = await fetch(clapUrl)
      const blob = await res.blob()
      const clap = await parseClap(blob)
      setClap(clap)
      setTimeout(() => {
        setIsImporting(false)
      }, 1000)
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
        ? 
        <ReflexContainer orientation="horizontal">
          <ReflexElement className={isLoading ? 'opacity-0' :  'opacity-100'}>
            <ClapTimeline
              showFPS={false}
              className={cn(

              )}
            />
          </ReflexElement>
        </ReflexContainer>
        :
          <FileUploader
            handleChange={handleChange}
            name="file" types={["txt", "clap"]}>
          <div className={cn(`
          flex
        w-screen h-screen
        overflow-hidden
        items-center justify-center
        cursor-pointer
        `, isBusy ? 'animate-pulse' : '')}
        style={{
          backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #34353655, #343536 )"
        }}><p
        className="text-stone-100 font-sans font-thin text-[3vw]"
        style={{ textShadow: "#000 1px 0 3px" }}
        >
          {isBusy ? 'Loading..' : 
          <span className="flex flex-center justify-center text-center w-full">
            Click to import a screenplay (.txt)<br/>
          or an OpenClap file (.clap)</span>}
          </p>
          </div>
          </FileUploader>
        }
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
