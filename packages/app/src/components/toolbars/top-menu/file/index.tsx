'use client'
import { useEffect } from 'react'
import { useTimeline } from '@aitube/timeline'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useOpenFilePicker, useQueryStringParams } from '@/lib/hooks'
import { IframeWarning } from '@/components/dialogs/iframe-warning'
import { useIO, useUI } from '@/services'
import { newClap } from '@aitube/clap'
import { getDemoGame } from '@/experiments/samples/demo'

export function TopMenuFile() {
  const isTimelineLoading: boolean = useTimeline((s) => s.isLoading)
  const clap = useTimeline((s) => s.clap)
  const setClap = useTimeline((s) => s.setClap)
  //const saveClapAs = useTimeline(s => s.saveClapAs)
  //const setFullVideo = useTimeline(s => s.fullVideo)

  const { openFilePicker, isLoading: filePickerIsLoading } = useOpenFilePicker()

  //const isLoading = isTimelineLoading || filePickerIsLoading

  const openClapUrl = useIO((s) => s.openClapUrl)
  const openScreenplayUrl = useIO((s) => s.openScreenplayUrl)
  const saveClap = useIO((s) => s.saveClap)
  const saveVideoFile = useIO((s) => s.saveVideoFile)
  const saveZipFile = useIO((s) => s.saveZipFile)
  const saveKdenline = useIO((s) => s.saveKdenline)

  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

  const showWelcomeScreen = useUI((s) => s.showWelcomeScreen)
  const setShowWelcomeScreen = useUI((s) => s.setShowWelcomeScreen)

  // const setShowSettings = useUISettings(s => s.setShowSettings)
  useHotkeys('ctrl+o', () => openFilePicker(), { preventDefault: true }, [])
  useHotkeys('meta+o', () => openFilePicker(), { preventDefault: true }, [])
  // useHotkeys('ctrl+s', () => saveClapAs({ embedded: true }), { preventDefault: true }, [])
  // useHotkeys('meta+s', () => saveClapAs({ embedded: true }), { preventDefault: true }, [])
  useHotkeys('ctrl+s', () => saveClap(), { preventDefault: true }, [])
  useHotkeys('meta+s', () => saveClap(), { preventDefault: true }, [])

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onClick={() => {
              setClap(newClap())
              setShowWelcomeScreen(false)
            }}
          >
            New Project<MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onClick={() => {
              openFilePicker()
            }}
          >
            Open project (.clap)<MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              saveClap()
            }}
          >
            Save project (.clap)<MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Import an example</MenubarSubTrigger>
            <MenubarSubContent>
              {hasBetaAccess && (
                <MenubarItem
                  onClick={() => {
                    setClap(getDemoGame())
                  }}
                >
                  (secret demo)
                </MenubarItem>
              )}
              <MenubarItem
                onClick={() => {
                  openClapUrl('/samples/claps/wasteland.clap')
                }}
              >
                [demo] Wasteland.clap
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  openScreenplayUrl('/samples/scripts/The Apery.txt')
                }}
              >
                [demo] The Apery.txt
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  openScreenplayUrl('/samples/scripts/Star Wars A New Hope.txt')
                }}
              >
                Star Wars A New Hope.txt
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  openScreenplayUrl('/samples/scripts/Rear Window.txt')
                }}
              >
                Rear Window.txt
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  openScreenplayUrl(
                    '/samples/scripts/Raiders of the Lost Ark.txt'
                  )
                }}
              >
                Raiders of the Lost Ark.txt
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  openScreenplayUrl('/samples/scripts/The Goonies.txt')
                }}
              >
                The Goonies.txt
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  openScreenplayUrl('/samples/scripts/Citizen Kane.txt')
                }}
              >
                Citizen Kane.txt
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  openScreenplayUrl('/samples/scripts/The Wizard Of Oz.txt')
                }}
              >
                The Wizard Of Oz.txt
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem
            onClick={() => {
              openFilePicker()
            }}
          >
            Import screenplay (.txt)
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              openFilePicker()
            }}
          >
            Import video (.mp4)
          </MenubarItem>
          {/*
          In case we want to show a video import wizard UI:

          <MenubarItem
            onClick={() => {
              openFilePicker()
            }}
          >
            Import video (.mp4)
          </MenubarItem>
          <MenubarSeparator />
          */}

          <MenubarSeparator />
          <MenubarItem
            onClick={() => {
              saveVideoFile()
            }}
          >
            Export full video (.mp4)
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              saveZipFile()
            }}
          >
            Export all assets (.zip)
          </MenubarItem>
          {/*
        <MenubarItem onClick={() => {
          saveKdenline()
        }}>
          Export .kdenlive
        </MenubarItem>
        <MenubarSeparator />
        */}
          {/*
        <MenubarItem
        disabled
        onClick={() => {
         
        }}>
          Import .fountain (not implemented)
        </MenubarItem>
        <MenubarItem
        disabled
        onClick={() => {
          
        }}>
          Export .fountain (not implemented)
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
        disabled
        onClick={() => {
        
        }}>
          Import .fdx (not implemented)
        </MenubarItem>
        <MenubarItem
        disabled
        onClick={() => {

        }}>
          Export .fdx (not implemented)
        </MenubarItem>
        */}
        </MenubarContent>
      </MenubarMenu>
      {/*
    deprecated, this is the old design with progress bar
    <Loader isLoading={isLoading} /> */}
      <IframeWarning />
    </>
  )
}
