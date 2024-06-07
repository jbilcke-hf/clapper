"use client"
import { useEffect } from "react"
import { useTimelineState } from "@aitube/timeline"
import { useHotkeys } from "react-hotkeys-hook"
import { ClapProject, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType, newSegment, parseClap, serializeClap } from "@aitube/clap"

import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar"
import { useClapFilePicker, useQueryStringParams, useScreenplayFilePicker } from "@/lib/hooks"
import { Loader } from "@/components/dialogs/loader"
import { IframeWarning } from "@/components/dialogs/iframe-warning"
import { blobToBase64DataUri } from "@/lib/utils/blobToBase64DataUri"

export function TopMenuFile() {
  const { clapUrl } = useQueryStringParams({
    // clapUrl: `/samples/test.clap`,
    // clapUrl: `/samples/Afterglow%20v10%20X%20Rewrite%20Bryan%20E.%20Harris%202023.clap`,
    clapUrl: '',
  })

  const isTimelineLoading: boolean = useTimelineState(s => s.isLoading)
  const clap = useTimelineState(s => s.clap)
  const setClap = useTimelineState(s => s.setClap)
  //const saveClapAs = useTimelineState(s => s.saveClapAs)
  //const setFullVideo = useTimelineState(s => s.fullVideo)

  const clapPicker = useClapFilePicker()
  const screenplayPicker = useScreenplayFilePicker()

  const isLoading = isTimelineLoading || clapPicker.isLoading || screenplayPicker.isLoading

  useEffect(() => {
    (async () => {
      if (!clapUrl) {
        console.log("No clap URL provided")
        return
      }
      const res = await fetch(clapUrl)
      const blob = await res.blob()
      const clap = await parseClap(blob)
      await setClap(clap)
    })()
  }, [clapUrl])


  const saveClap = async () => {
    const { clap } = useTimelineState.getState()

    if (!clap) { throw new Error(`cannot save a clap.. if there is no clap`) }

    // make sure we update the total duration
    for (const s of clap.segments) {
      if (s.endTimeInMs > clap.meta.durationInMs) {
        clap.meta.durationInMs = s.endTimeInMs
      }
    }

    const clapBlob: Blob = await serializeClap(clap)

    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(clapBlob)
  
    // Create an anchor element and force browser download
    const anchor = document.createElement("a")
    anchor.href = objectUrl

    anchor.download = `my_project.clap`

    document.body.appendChild(anchor) // Append to the body (could be removed once clicked)
    anchor.click() // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(anchor)
  }

  const renderAndSaveVideoFile = async () => {
    console.log(`rendering project using the free community server..`)

    const clap: ClapProject = useTimelineState.getState().clap

    // note: I didn't put it inside the clapper's own API,
    // because this is something a bit fragile
    // (it uses ffmpeg and puppeteer, sometimes it crashes etc)
    const result = await fetch(
      // TODO: put this into a variable
      // also rename this to so cool-sounding module
      `https://jbilcke-hf-ai-tube-clap-exporter.hf.space?f=mp4`,
      {
        method: "POST",
        body: await serializeClap(clap)
      }
    )

    const videoBlob = await result.blob()

    const videoDataUrl = await blobToBase64DataUri(videoBlob)

    const alreadyAnEmbeddedFinalVideo = clap.segments.filter(s =>
      s.category === ClapSegmentCategory.VIDEO &&
      s.status === ClapSegmentStatus.COMPLETED &&
      s.startTimeInMs === 0 &&
      s.endTimeInMs === clap.meta.durationInMs &&
      s.assetUrl).at(0)

   // inject the final mp4 video file into the .clap
   if (alreadyAnEmbeddedFinalVideo) {
      console.log(`editing the clap to update the final video`)
      alreadyAnEmbeddedFinalVideo.assetUrl = videoDataUrl
    } else {
      console.log(`editing the clap to add a new final video`)
      clap.segments.push(newSegment({
        category: ClapSegmentCategory.VIDEO,
        status: ClapSegmentStatus.COMPLETED,
        startTimeInMs: 0,
        endTimeInMs: clap.meta.durationInMs,
        assetUrl: videoDataUrl,
        assetDurationInMs: clap.meta.durationInMs,
        assetSourceType: getClapAssetSourceType(videoDataUrl),
        outputGain: 1.0,
      }))
    }
    // Create an object URL for the compressed clap blob
    // object urls are short-lived urls, with the benefit of having a short id too
    const objectUrl = URL.createObjectURL(videoBlob)
    
    console.log(`The free community server responded: ${result.status} ${result.statusText}`, objectUrl)
    
    // Create an anchor element and force browser download
    const anchor = document.createElement("a")
    anchor.href = objectUrl

    anchor.download = `export.mp4`

    document.body.appendChild(anchor) // Append to the body (could be removed once clicked)
    anchor.click() // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(anchor)

  }

  // const setShowSettings = useUISettings(s => s.setShowSettings)
  useHotkeys('ctrl+o', () => clapPicker.openFilePicker(), { preventDefault: true }, [])
  useHotkeys('meta+o', () => clapPicker.openFilePicker(), { preventDefault: true }, [])
  // useHotkeys('ctrl+s', () => saveClapAs({ embedded: true }), { preventDefault: true }, [])
  // useHotkeys('meta+s', () => saveClapAs({ embedded: true }), { preventDefault: true }, [])
  useHotkeys('ctrl+s', () => saveClap(), { preventDefault: true }, [])
  useHotkeys('meta+s', () => saveClap(), { preventDefault: true }, [])
  

  return (
    <>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => {
          clapPicker.openFilePicker()
        }}>
          Open project (.clap)<MenubarShortcut>⌘O</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
        onClick={() => {
          saveClap()
        }}>
          Save project (.clap)<MenubarShortcut>⌘S</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
        onClick={() => {
          renderAndSaveVideoFile()
        }}>
          Render project (.mp4)
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={() => {
          screenplayPicker.openFilePicker()
        }}>
          Import screenplay (.txt)
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
        disabled
        onClick={() => {
          screenplayPicker.openFilePicker()
        }}>
          Import .fountain (not implemented)
        </MenubarItem>
        <MenubarItem
        disabled
        onClick={() => {
          screenplayPicker.openFilePicker()
        }}>
          Export .fountain (not implemented)
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
        disabled
        onClick={() => {
          screenplayPicker.openFilePicker()
        }}>
          Import .fdx (not implemented)
        </MenubarItem>
        <MenubarItem
        disabled
        onClick={() => {
          screenplayPicker.openFilePicker()
        }}>
          Export .fdx (not implemented)
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <Loader isLoading={isLoading} />
    <IframeWarning />
    </>
  )
}
