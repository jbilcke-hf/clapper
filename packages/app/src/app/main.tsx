'use client'

import React, { useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { useSearchParams } from 'next/navigation'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend, NativeTypes } from 'react-dnd-html5-backend'
import { UIWindowLayout } from '@aitube/clapper-services'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Bellhop } from 'bellhop-iframe'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Monitor } from '@/components/monitor'

import { SettingsDialog } from '@/components/settings'
import { LoadingDialog } from '@/components/dialogs/loader/LoadingDialog'
import { TopBar } from '@/components/toolbars/top-bar'
import { Timeline } from '@/components/core/timeline'
import { ChatView } from '@/components/assistant/ChatView'
import { Editors } from '@/components/editors/Editors'
import { BottomBar } from '@/components/toolbars/bottom-bar'
import { FruityDesktop, FruityWindow } from '@/components/windows'
import { ScriptEditor } from '@/components/editors/ScriptEditor'
import { SegmentEditor } from '@/components/editors/SegmentEditor'
import { EntityEditor } from '@/components/editors/EntityEditor'
import { WorkflowEditor } from '@/components/editors/WorkflowEditor'
import { FilterEditor } from '@/components/editors/FilterEditor'

import { useUI, useIO, useTheme, useMonitor } from '@/services'
import { useRenderLoop } from '@/services/renderer'
import { useDynamicWorkflows } from '@/services/editors/workflow-editor/useDynamicWorkflows'

import { useQueryStringLoader } from '@/components/toolbars/top-menu/file/useQueryStringLoader'
import { useSetupIframeOnce } from './embed/useSetupIframeOnce'
import { TimelineZoom } from '@/components/core/timeline/TimelineZoom'
import { useBreakpoints } from '@/lib/hooks/useBreakpoints'

export enum ClapperIntegrationMode {
  APP = 'APP',
  IFRAME = 'IFRAME',
}

export type DroppableThing = { files: File[] }

function MainContent({ mode }: { mode: ClapperIntegrationMode }) {
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

  const isIframe = mode === ClapperIntegrationMode.IFRAME

  const { isMd } = useBreakpoints()

  // this has to be done at the root of the app, that way it can
  // perform its routine even when the monitor component is hidden
  useRenderLoop()

  // this has to be done at the root of the app, that way it can
  // sync workflows even when the workflow component is hidden
  useDynamicWorkflows()

  // also has to be done here
  useSetupIframeOnce(isIframe)

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

  useQueryStringLoader()

  const iframeLayout = (
    <>
      <Monitor />
      <Timeline className="fixed bottom-96" />
    </>
  )

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
            size={showTimeline ? (isMd ? 400 : 250) : 1}
            minSize={showTimeline ? 50 : 1}
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
        toolbar={() => (
          <>
            <TimelineZoom />
          </>
        )}
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
        `fixed top-9 h-[calc(100svh-36px)] w-screen flex-row overflow-hidden`,
        `items-center justify-center`,
        `bg-neutral-950`
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
            `pointer-events-none absolute top-[16px] left-[100px]`,
            `opacity-90`
          )}
        >
          <img // eslint-disable-line @next/next/no-img-element
            src="/images/onboarding/get-started.png"
            alt="To get started please open the menu"
            width="180"
            className=""
          ></img>
        </div>
        <div
          className={cn(
            `pointer-events-none absolute top-[136px] left-[305px]`,
            `transition-all duration-200 ease-out`,
            isTopMenuOpen ? 'scale-100 opacity-90' : 'scale-90 opacity-0'
          )}
        >
          <img // eslint-disable-line @next/next/no-img-element
            src="/images/onboarding/pick-an-example.png"
            alt="Then open an example"
            width="140"
          ></img>
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
        `dark fixed flex h-svh w-screen flex-col overflow-hidden font-light text-neutral-900/90 select-none dark:text-neutral-100/90`
      )}
    >
      <TopBar className={isIframe ? 'hidden' : ''} />
      <div
        className={cn(
          `flex w-screen flex-row overflow-hidden`,
          isIframe
            ? 'h-svh'
            : windowLayout === UIWindowLayout.GRID
              ? 'h-[calc(100svh-48px)] md:h-[calc(100svh-64px)]'
              : 'h-[calc(100svh-36px)]'
        )}
        style={
          isIframe || windowLayout === UIWindowLayout.GRID
            ? { backgroundColor: theme.defaultBgColor }
            : { backgroundImage: theme.wallpaperBgImage }
        }
      >
        {isIframe
          ? iframeLayout
          : windowLayout === UIWindowLayout.FLYING
            ? flyingLayout
            : gridLayout}
      </div>

      {!isIframe && isMd && welcomeScreen}

      <SettingsDialog />
      <LoadingDialog />
      <Toaster />
      {!isIframe && windowLayout === UIWindowLayout.GRID && <BottomBar />}
    </div>
  )
}

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

export function Main(
  {
    mode = ClapperIntegrationMode.APP,
  }: {
    mode: ClapperIntegrationMode
  } = {
    mode: ClapperIntegrationMode.APP,
  }
) {
  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <ErrorBoundary fallbackRender={fallbackRender}>
          <MainContent mode={mode} />
        </ErrorBoundary>
      </DndProvider>
    </TooltipProvider>
  )
}
