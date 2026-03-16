'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSettings } from '@/services/settings'

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

export function ComfyUIConnectionStatus() {
  const comfyUiApiUrl = useSettings((s) => s.comfyUiApiUrl)
  const [state, setState] = useState<ConnectionState>('disconnected')

  const checkConnection = useCallback(async () => {
    if (!comfyUiApiUrl) {
      setState('disconnected')
      return
    }

    setState('connecting')
    try {
      const response = await fetch(`${comfyUiApiUrl}/system_stats`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      setState(response.ok ? 'connected' : 'error')
    } catch {
      setState('error')
    }
  }, [comfyUiApiUrl])

  useEffect(() => {
    checkConnection()
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [checkConnection])

  const statusColors: Record<ConnectionState, string> = {
    disconnected: 'bg-neutral-500',
    connecting: 'bg-yellow-500 animate-pulse',
    connected: 'bg-green-500',
    error: 'bg-red-500',
  }

  const statusLabels: Record<ConnectionState, string> = {
    disconnected: 'Not configured',
    connecting: 'Connecting...',
    connected: 'Connected',
    error: 'Connection failed',
  }

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-400">
      <div className={`h-2 w-2 rounded-full ${statusColors[state]}`} />
      <span>ComfyUI: {statusLabels[state]}</span>
      {state === 'connected' && (
        <span className="text-xs text-neutral-500">({comfyUiApiUrl})</span>
      )}
    </div>
  )
}
