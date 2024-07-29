'use client'

import React, { useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { useSearchParams } from 'next/navigation'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend, NativeTypes } from 'react-dnd-html5-backend'
import { UIWindowLayout } from '@aitube/clapper-services'

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
import { FruityDesktop, FruityWindow } from '@/components/windows'
import { ScriptEditor } from '@/components/editors/ScriptEditor'
import { SegmentEditor } from '@/components/editors/SegmentEditor'
import { EntityEditor } from '@/components/editors/EntityEditor'
import { WorkflowEditor } from '@/components/editors/WorkflowEditor'
import { FilterEditor } from '@/components/editors/FilterEditor'

type DroppableThing = { files: File[] }

function MainContent() {
  const ref = useRef<HTMLDivElement>(null)
  const showWelcomeScreen = useUI((s) => s.showWelcomeScreen)
  const showExplorer = useUI((s) => s.showExplorer)
  const showVideoPlayer = useUI((s) => s.showVideoPlayer)
  const showTimeline = useUI((s) => s.showTimeline)
  const showAssistant = useUI((s) => s.showAssistant)
  const theme = useTheme()
  const openFiles = useIO((s) => s.openFiles)
  const isTopMenuOpen = useUI((s) => s.isTopMenuOpen)
  const windowLayout = useUI((s) => s.windowLayout)

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

  const gridLayout = (
    <ReflexContainer orientation="vertical">
      <ReflexElement>
        <ReflexContainer orientation="horizontal">
          <ReflexElement
            // minSize={showTimeline ? 1 : 100}
            // maxSize={2000}
            size={showTimeline ? 1200 : 400}
          >
            <ReflexContainer orientation="vertical">
              {showExplorer && (
                <ReflexElement
                  size={showExplorer ? undefined : 1}
                  minSize={showExplorer ? 100 : 1}
                  maxSize={showExplorer ? 2000 : 1}
                >
                  <Editors />
                </ReflexElement>
              )}
              {showExplorer && showVideoPlayer && <ReflexSplitter />}
              {showVideoPlayer && (
                <ReflexElement
                  minSize={showVideoPlayer ? 200 : 1}
                  size={showVideoPlayer ? undefined : 1}
                >
                  <Monitor />
                </ReflexElement>
              )}
            </ReflexContainer>
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement
            size={showTimeline ? 400 : 1}
            minSize={showTimeline ? 200 : 1}
            maxSize={showTimeline ? 1600 : 1}
          >
            <Timeline />
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
  )

  const flyingLayout = (
    <FruityDesktop>
      <FruityWindow
        id="ScriptEditor"
        title="Screenplay"
        defaultWidth={375}
        minWidth={200}
        defaultHeight={370}
        minHeight={100}
        defaultX={18}
        defaultY={7}
        canBeClosed={false}
      >
        <ScriptEditor />
      </FruityWindow>

      <FruityWindow
        id="SegmentEditor"
        title="Segments"
        defaultWidth={342}
        minWidth={200}
        defaultHeight={395}
        minHeight={100}
        defaultX={21}
        defaultY={424}
        canBeClosed={false}
      >
        <SegmentEditor />
      </FruityWindow>

      <FruityWindow
        id="EntityEditor"
        title="Entities"
        defaultWidth={544}
        minWidth={200}
        defaultHeight={318}
        minHeight={100}
        defaultX={347}
        defaultY={193}
        canBeClosed={false}
      >
        <EntityEditor />
      </FruityWindow>

      <FruityWindow
        id="WorkflowEditor"
        title="Workflows"
        defaultWidth={459}
        minWidth={200}
        defaultHeight={351}
        minHeight={100}
        defaultX={536}
        defaultY={3}
        canBeClosed={false}
      >
        <WorkflowEditor />
      </FruityWindow>

      <FruityWindow
        id="FilterEditor"
        title="Filters"
        defaultWidth={459}
        minWidth={200}
        defaultHeight={351}
        minHeight={100}
        defaultX={936}
        defaultY={400}
        canBeClosed={false}
      >
        <FilterEditor />
      </FruityWindow>

      <FruityWindow
        id="Monitor"
        title="Monitor"
        defaultWidth={333}
        minWidth={200}
        defaultHeight={298}
        minHeight={100}
        defaultX={1027}
        defaultY={21}
        canBeClosed={false}
      >
        <Monitor />
      </FruityWindow>

      <FruityWindow
        id="Timeline"
        title="Timeline"
        defaultWidth={936}
        minWidth={200}
        defaultHeight={282}
        minHeight={100}
        defaultX={375}
        defaultY={527}
        canBeClosed={false}
      >
        <Timeline />
      </FruityWindow>
    </FruityDesktop>
  )

  const welcomeScreen = (
    <div
      className={cn(
        showWelcomeScreen
          ? 'pointer-events-auto z-[101] flex'
          : 'pointer-events-none hidden',
        `fixed top-9 h-[calc(100vh-36px)] w-screen flex-row overflow-hidden`,
        `items-center justify-center`,
        `bg-stone-950`
      )}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          backgroundImage: theme.wallpaperBgImage,
        }}
      >
        <div
          className={cn(
            `pointer-events-none absolute left-[100px] top-[16px]`,
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
            `pointer-events-none absolute left-[305px] top-[136px]`,
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
  )

  return (
    <div
      ref={ref}
      className={cn(
        `dark fixed flex h-screen w-screen select-none flex-col overflow-hidden font-light text-neutral-900/90 dark:text-neutral-100/90`
      )}
    >
      <TopBar />
      <div
        className={cn(
          `flex w-screen flex-row overflow-hidden`,
          windowLayout === UIWindowLayout.GRID
            ? 'h-[calc(100vh-64px)]'
            : 'h-[calc(100vh-36px)]'
        )}
        style={
          windowLayout === UIWindowLayout.GRID
            ? { backgroundColor: theme.defaultBgColor }
            : { backgroundImage: theme.wallpaperBgImage }
        }
      >
        {windowLayout === UIWindowLayout.FLYING ? flyingLayout : gridLayout}
      </div>

      {welcomeScreen}

      <SettingsDialog />
      <LoadingDialog />
      <Toaster />
      {windowLayout === UIWindowLayout.GRID && <BottomToolbar />}
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
