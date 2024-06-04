"use client"
import { useEffect } from "react"
import { useTimelineState } from "@aitube/timeline"
import { useHotkeys } from "react-hotkeys-hook"
import { parseClap } from "@aitube/clap"

import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar"
import { useClapFilePicker, useQueryStringParams, useScreenplayFilePicker } from "@/lib/hooks"
import { Loader } from "../../loader"
import { IframeWarning } from "../../iframe-warning"

export function TopMenuFile() {
  const { clapUrl } = useQueryStringParams({
    // clapUrl: `/samples/test.clap`,
    // clapUrl: `/samples/Afterglow%20v10%20X%20Rewrite%20Bryan%20E.%20Harris%202023.clap`,
    clapUrl: '',
  })

  const isTimelineLoading: boolean = useTimelineState(s => s.isLoading)
  const setClap = useTimelineState(s => s.setClap)
  const saveClapAs = useTimelineState(s => s.saveClapAs)

  const clapPicker = useClapFilePicker()
  const screenplayPicker = useScreenplayFilePicker()

  const isLoading = isTimelineLoading || clapPicker.isLoading || screenplayPicker.isLoading

  // const setShowSettings = useInterfaceSettings(s => s.setShowSettings)
  useHotkeys('ctrl+o', () => clapPicker.openFilePicker(), { preventDefault: true }, [])
  useHotkeys('meta+o', () => clapPicker.openFilePicker(), { preventDefault: true }, [])
  useHotkeys('ctrl+s', () => saveClapAs({ embedded: true }), { preventDefault: true }, [])
  useHotkeys('meta+s', () => saveClapAs({ embedded: true }), { preventDefault: true }, [])

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
        <MenubarItem onClick={() => {
          saveClapAs({ embedded: true })
        }}>
          Save project (.clap)<MenubarShortcut>⌘S</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={() => {
          screenplayPicker.openFilePicker()
        }}>
          Import screenplay (.txt)
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <Loader isLoading={isLoading} />
    <IframeWarning />
    </>
  )
}
