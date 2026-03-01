'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useSettings } from '@/services/settings'
import { MdCheckCircle, MdCancel, MdRefresh, MdCircle } from 'react-icons/md'

type ConnectionStatus = 'idle' | 'checking' | 'connected' | 'error'

export function ComfyUIConnectionStatus() {
  const comfyUiApiUrl = useSettings((s) => s.comfyUiApiUrl)
  const [status, setStatus] = useState<ConnectionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [serverInfo, setServerInfo] = useState<string>('')

  const checkConnection = useCallback(async () => {
    if (!comfyUiApiUrl) {
      setStatus('idle')
      setServerInfo('')
      setErrorMessage('')
      return
    }

    setStatus('checking')
    setErrorMessage('')
    setServerInfo('')

    try {
      // Try to reach the ComfyUI system stats endpoint
      const url = comfyUiApiUrl.replace(/\/+$/, '')
      const response = await fetch(`${url}/system_stats`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        const data = await response.json()
        const deviceName = data?.system?.devices?.[0]?.name || 'Unknown GPU'
        const vramTotal = data?.system?.devices?.[0]?.vram_total
        const vramInfo = vramTotal
          ? ` (${(vramTotal / 1024 / 1024 / 1024).toFixed(1)}GB VRAM)`
          : ''
        setServerInfo(`${deviceName}${vramInfo}`)
        setStatus('connected')
      } else {
        setErrorMessage(`Server returned ${response.status}`)
        setStatus('error')
      }
    } catch (err: any) {
      if (err?.name === 'TimeoutError') {
        setErrorMessage('Connection timed out')
      } else if (err?.message?.includes('fetch')) {
        setErrorMessage('Cannot reach server (CORS or offline)')
      } else {
        setErrorMessage(err?.message || 'Connection failed')
      }
      setStatus('error')
    }
  }, [comfyUiApiUrl])

  // Auto-check when URL changes
  useEffect(() => {
    if (comfyUiApiUrl) {
      const timer = setTimeout(checkConnection, 500)
      return () => clearTimeout(timer)
    } else {
      setStatus('idle')
    }
  }, [comfyUiApiUrl, checkConnection])

  if (!comfyUiApiUrl) return null

  return (
    <div className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2">
      {status === 'idle' && (
        <>
          <MdCircle className="text-xs text-neutral-500" />
          <span className="text-xs text-neutral-500">Not configured</span>
        </>
      )}

      {status === 'checking' && (
        <>
          <MdRefresh className="animate-spin text-sm text-yellow-400" />
          <span className="text-xs text-yellow-400">
            Checking connection...
          </span>
        </>
      )}

      {status === 'connected' && (
        <>
          <MdCheckCircle className="text-sm text-green-400" />
          <div className="flex flex-col">
            <span className="text-xs text-green-400">Connected</span>
            {serverInfo && (
              <span className="text-[10px] text-neutral-400">{serverInfo}</span>
            )}
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <MdCancel className="text-sm text-red-400" />
          <div className="flex flex-col">
            <span className="text-xs text-red-400">Disconnected</span>
            {errorMessage && (
              <span className="text-[10px] text-neutral-500">
                {errorMessage}
              </span>
            )}
          </div>
        </>
      )}

      <button
        className="ml-auto text-neutral-400 hover:text-neutral-200 transition-colors"
        onClick={checkConnection}
        title="Test connection"
      >
        <MdRefresh
          className={cn('text-sm', status === 'checking' && 'animate-spin')}
        />
      </button>
    </div>
  )
}
