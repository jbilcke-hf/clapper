"use client"
import { useEffect } from "react"
import { useTimeline } from "@aitube/timeline"
import { useHotkeys } from "react-hotkeys-hook"

import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar"
import { useClapFilePicker, useQueryStringParams, useScreenplayFilePicker } from "@/lib/hooks"
import { Loader } from "@/components/dialogs/loader"
import { IframeWarning } from "@/components/dialogs/iframe-warning"
import { useIO } from "@/controllers/io/useIO"

export function TopMenuFile() {
  const { clapUrl } = useQueryStringParams({
    // clapUrl: `/samples/test.clap`,
    // clapUrl: `/samples/Afterglow%20v10%20X%20Rewrite%20Bryan%20E.%20Harris%202023.clap`,
    clapUrl: '',
  })

  const isTimelineLoading: boolean = useTimeline(s => s.isLoading)
  const clap = useTimeline(s => s.clap)
  const setClap = useTimeline(s => s.setClap)
  //const saveClapAs = useTimeline(s => s.saveClapAs)
  //const setFullVideo = useTimeline(s => s.fullVideo)

  const clapPicker = useClapFilePicker()
  const screenplayPicker = useScreenplayFilePicker()

  const isLoading = isTimelineLoading || clapPicker.isLoading || screenplayPicker.isLoading

  const openClapUrl = useIO(s => s.openClapUrl)
  const saveClap = useIO(s => s.saveClap)
  const saveVideoFile = useIO(s => s.saveVideoFile)
  const saveKdenline = useIO(s => s.saveKdenline)

  useEffect(() => {
    (async () => {
      if (!clapUrl) {
        console.log("No clap URL provided")
        return
      }
      await openClapUrl(clapUrl)
    })()
  }, [clapUrl])

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
          saveVideoFile()
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
        {/*
        <MenubarItem onClick={() => {
          saveKdenline()
        }}>
          Export .kdenlive
        </MenubarItem>
        <MenubarSeparator />
        */}
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
