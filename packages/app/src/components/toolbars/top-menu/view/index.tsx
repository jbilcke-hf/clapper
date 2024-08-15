'use client'

import { useEffect } from 'react'

import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useFullscreenStatus } from '@/lib/hooks'
import { useUI } from '@/services/ui'
import { ThemeList } from '../lists/ThemeList'
import { UIWindowLayout } from '@aitube/clapper-services'
import { cn } from '@/lib/utils'
import { GiStrawberry } from 'react-icons/gi'
import { BiSolidWindowAlt } from 'react-icons/bi'
import { RiFullscreenExitLine, RiFullscreenLine } from 'react-icons/ri'

export function TopMenuView() {
  const [isFullscreen, setFullscreen, ref] = useFullscreenStatus()

  // we want the whole body to become fullscreen
  // TODO: use pointer lock, to prevent the mouse from going up
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ref.current = document.body
    }
  }, [ref])

  const windowLayout = useUI((s) => s.windowLayout)
  const setWindowLayout = useUI((s) => s.setWindowLayout)

  const showTimeline = useUI((s) => s.showTimeline)
  const setShowTimeline = useUI((s) => s.setShowTimeline)

  const showExplorer = useUI((s) => s.showExplorer)
  const setShowExplorer = useUI((s) => s.setShowExplorer)

  const showAssistant = useUI((s) => s.showAssistant)
  const setShowAssistant = useUI((s) => s.setShowAssistant)

  const showVideoPlayer = useUI((s) => s.showVideoPlayer)
  const setShowVideoPlayer = useUI((s) => s.setShowVideoPlayer)

  const followCursor = useUI((s) => s.followCursor)
  const setFollowCursor = useUI((s) => s.setFollowCursor)

  const hasBetaAccess = useUI((s) => s.hasBetaAccess)

  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarItem
          onClick={(e) => {
            setFullscreen()

            e.stopPropagation()
            e.preventDefault()
            return false
          }}
        >
          <div
            className={cn(
              `grid h-4 w-5 scale-100 cursor-pointer grid-cols-4 grid-rows-4 overflow-hidden rounded border border-neutral-100 opacity-70 transition-all duration-200 ease-in-out hover:scale-110 hover:opacity-100`
            )}
          >
            <div className="flex h-4 w-4 items-center justify-center">
              <RiFullscreenLine
                className={cn(
                  `absolute -mt-0.5 ml-0.5 h-3 w-3`,
                  `transition-all duration-200 ease-in-out`,
                  !isFullscreen ? 'opacity-100' : 'opacity-0'
                )}
              />
              <RiFullscreenExitLine
                className={cn(
                  `absolute -mt-0.5 ml-0.5 h-3 w-3`,
                  `transition-all duration-200 ease-in-out`,
                  isFullscreen ? 'opacity-100' : 'opacity-0'
                )}
              />
            </div>
          </div>
          <span className="ml-2">Toggle fullscreen</span>
        </MenubarItem>

        <MenubarItem
          onClick={(e) => {
            setWindowLayout(
              windowLayout === UIWindowLayout.FLYING
                ? UIWindowLayout.GRID
                : UIWindowLayout.FLYING
            )

            e.stopPropagation()
            e.preventDefault()
            return false
          }}
        >
          <div
            className={cn(
              `grid h-4 w-5 scale-100 cursor-pointer grid-cols-4 grid-rows-4 overflow-hidden rounded border border-neutral-100 opacity-70 transition-all duration-200 ease-in-out hover:scale-110 hover:opacity-100`
            )}
          >
            <div className="flex h-4 w-4 items-center justify-center">
              <GiStrawberry
                className={cn(
                  `absolute -mt-0.5 ml-0.5 h-3 w-3`,
                  `transition-all duration-200 ease-in-out`,
                  windowLayout === UIWindowLayout.FLYING
                    ? 'opacity-100'
                    : 'opacity-0'
                )}
              />
              <BiSolidWindowAlt
                className={cn(
                  `absolute -mt-0.5 ml-0.5 h-3 w-3`,
                  `transition-all duration-200 ease-in-out`,
                  windowLayout === UIWindowLayout.GRID
                    ? 'opacity-100'
                    : 'opacity-0'
                )}
              />
            </div>
          </div>
          <span className="ml-2">Toggle layout</span>
        </MenubarItem>

        {/*
        <MenubarSeparator />
        <MenubarCheckboxItem
          checked={showTimeline}
          onClick={(e) => {
            setShowTimeline(!showTimeline)
            e.stopPropagation()
            e.preventDefault()
            return false
          }}
        >Show timeline</MenubarCheckboxItem>
      
        <MenubarCheckboxItem
          checked={showExplorer}
          onClick={(e) => {
            setShowExplorer(!showExplorer)
            e.stopPropagation()
            e.preventDefault()
            return false
          }}
          >Show asset explorer</MenubarCheckboxItem>
      */}

        {/*

        this feature isn't implemented yet

        <MenubarCheckboxItem
          checked={followCursor}
          onClick={(e) => {
            setFollowCursor(!followCursor)
            e.stopPropagation()
            e.preventDefault()
            return false
          }}
        >
          Follow cursor during playback
        </MenubarCheckboxItem>
        */}
        {/*
        <MenubarCheckboxItem
          checked={showVideoPlayer}
          onClick={(e) => {
            setShowVideoPlayer(!showVideoPlayer)
            e.stopPropagation()
            e.preventDefault()
            return false
          }}
          >Show video player</MenubarCheckboxItem>
          */}
        <ThemeList />
      </MenubarContent>
    </MenubarMenu>
  )
}
