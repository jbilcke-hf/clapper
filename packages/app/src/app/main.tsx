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
  /*
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
  */

  return <div>Hello, world</div>
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
          <div>Debugging</div>
        </ErrorBoundary>
      </DndProvider>
    </TooltipProvider>
  )
}
