'use client'

import React, { useRef } from 'react'
import { useTimeline } from '@aitube/timeline'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Monitor } from '@/components/monitor'

import { SettingsDialog } from '@/components/settings'
import { LoadingDialog } from '@/components/dialogs/loader/LoadingDialog'
import { TopBar } from '@/components/toolbars/top-bar'
import { useTheme } from '@/services'

export function Embed() {
  const ref = useRef<HTMLDivElement>(null)
  const isEmpty = useTimeline((s) => s.isEmpty)
  const theme = useTheme()

  return (
    <TooltipProvider>
      <div
        ref={ref}
        className={cn(
          `dark fixed flex h-screen w-screen select-none flex-col items-center justify-center overflow-hidden font-light text-neutral-900/90 dark:text-neutral-100/90`
        )}
        style={{ backgroundImage: theme.wallpaperBgImage }}
      >
        <TopBar />
        <div
          className={cn(
            `flex w-full flex-grow flex-row overflow-hidden`,
            isEmpty ? 'opacity-0' : 'opacity-100'
          )}
        >
          <Monitor />
        </div>
        <SettingsDialog />
        <LoadingDialog />
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
