'use client'

import React from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import { TooltipProvider } from '@/components/ui/tooltip'

export enum ClapperIntegrationMode {
  APP = 'APP',
  IFRAME = 'IFRAME',
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
          <div>Hello, world!</div>
        </ErrorBoundary>
      </DndProvider>
    </TooltipProvider>
  )
}
