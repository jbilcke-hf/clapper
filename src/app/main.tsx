'use client'

import React, { useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { useSearchParams } from 'next/navigation'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend, NativeTypes } from 'react-dnd-html5-backend'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Monitor } from '@/components/monitor'

import { SettingsDialog } from '@/components/settings'
import { LoadingDialog } from '@/components/dialogs/loader/LoadingDialog'
import { useUI, useIO } from '@/services'
import { TopBar } from '@/components/toolbars/top-bar'
import { Timeline } from '@/components/core/timeline'
import { ChatView } from '@/components/assistant/ChatView'
import { Editors } from '@/components/editors/Editors'
import { useTheme } from '@/services/ui/useTheme'
import { BottomToolbar } from '@/components/toolbars/bottom-bar'

type DroppableThing = { files: File[] }

function MainContent() {
  const ref = useRef<HTMLDivElement>(null)
  const showWelcomeScreen = useUI((s) => s.showWelcomeScreen)
  const showTimeline = useUI((s) => s.showTimeline)
  const showAssistant = useUI((s) => s.showAssistant)
  const theme = useTheme()
  const openFiles = useIO((s) => s.openFiles)
  const isTopMenuOpen = useUI((s) => s.isTopMenuOpen)

  const [{ isOver, canDrop }, connectFileDrop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: DroppableThing): void => {
      // console.log("DROP", item)
      openFiles(item.files)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  connectFileDrop(ref)

  const setHasBetaAccess = useUI((s) => s.setHasBetaAccess)

  const searchParams = useSearchParams()
  const hasBetaAccess = searchParams.get('beta') === 'true'
  useEffect(() => {
    setHasBetaAccess(hasBetaAccess)
  }, [hasBetaAccess, setHasBetaAccess])

  return (
    <div
      ref={ref}
      className={cn(
        `dark fixed flex h-screen w-screen select-none flex-col justify-between overflow-hidden font-light text-stone-900/90 dark:text-stone-100/90`
      )}
      style={{
        backgroundImage:
          'repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #37353455, #373534 )',
      }}
    >
      <TopBar />
      <div
        className={cn(
          `flex h-[calc(100vh-40px)] w-screen flex-row overflow-hidden`
        )}
      >
        <ReflexContainer orientation="vertical">
          <ReflexElement>
            <ReflexContainer orientation="horizontal">
              <ReflexElement minSize={showTimeline ? 100 : 1}>
                <ReflexContainer orientation="vertical">
                  <ReflexElement
                    size={showTimeline ? 700 : 1}
                    minSize={showTimeline ? 100 : 1}
                    maxSize={showTimeline ? 2000 : 1}
                  >
                    <Editors />
                  </ReflexElement>
                  <ReflexSplitter />
                  <ReflexElement minSize={showTimeline ? 100 : 1}>
                    <Monitor />
                  </ReflexElement>
                </ReflexContainer>
              </ReflexElement>
              <ReflexSplitter />
              <ReflexElement
                size={showTimeline ? 400 : 1}
                minSize={showTimeline ? 100 : 1}
                maxSize={showTimeline ? 1600 : 1}
              >
                <Timeline />
                <BottomToolbar />
              </ReflexElement>
            </ReflexContainer>
          </ReflexElement>

          {showAssistant && <ReflexSplitter />}
          {showAssistant && (
            <ReflexElement size={300}>
              <ChatView />
            </ReflexElement>
          )}
        </ReflexContainer>
      </div>

      <div
        className={cn(
          showWelcomeScreen
            ? 'pointer-events-auto z-[101] flex'
            : 'pointer-events-none hidden',
          `fixed top-[40px] h-[calc(100vh-40px)] w-screen flex-row overflow-hidden`,
          `items-center justify-center`,
          `bg-stone-950`
        )}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            backgroundImage:
              'repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #37353455, #373534 )',
          }}
        >
          <div
            className={cn(
              `pointer-events-none absolute left-[100px] top-[20px]`,
              `opacity-90`
            )}
          >
            <img
              src="/images/onboarding/get-started.png"
              width="180"
              className=""
            ></img>
          </div>
          <div
            className={cn(
              `pointer-events-none absolute left-[305px] top-[140px]`,
              `transition-all duration-200 ease-out`,
              isTopMenuOpen ? 'scale-100 opacity-90' : 'scale-90 opacity-0'
            )}
          >
            <img src="/images/onboarding/pick-an-example.png" width="140"></img>
          </div>
          <div className="flex flex-col items-center justify-center space-y-6">
            <h1 className="text-6xl font-bold">
              Welcome to{' '}
              <span className="" style={{ color: theme.defaultPrimaryColor }}>
                Clapper
              </span>
              .
            </h1>
            <div className="flex flex-col items-center justify-center space-y-2 text-center text-2xl font-semibold">
              <p>A free and open-source AI video editor,</p>
              <p>designed for the age of generative filmmaking.</p>
            </div>
          </div>
        </div>
      </div>

      <SettingsDialog />
      <LoadingDialog />
      <Toaster />
    </div>
  )
}

export function Main() {
  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <MainContent />
      </DndProvider>
    </TooltipProvider>
  )
}
