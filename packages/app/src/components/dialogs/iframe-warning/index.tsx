'use client'

import { APP_DOMAIN, APP_LINK, APP_NAME } from '@/lib/core/constants'
import { cn } from '@/lib/utils'
import { useTheme } from '@/services'
import { useEffect, useState } from 'react'

/**
 * When Clapper is hosted in a space, using the fingers to scroll in the timeline
 * make the page go back to the previous one, so the user loses all their data
 *
 * obviously people aren't happy about this, so with a heavy heart I took the decision
 * to disable clapper on Hugging Face (I'll try to see of there are alternative solutions, maybe using the original subdomain)
 * @returns
 */
export function IframeWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    setShowWarning(window.self !== window.top)
    return () => {}
  }, [])

  return (
    <div
      className={cn(
        `fixed top-0 right-0 bottom-0 left-0 z-[999] m-0 flex h-svh w-screen items-center justify-center overflow-hidden bg-neutral-950 p-0 text-center`,
        showWarning
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      )}
      style={{ backgroundImage: theme.wallpaperBgImage }}
    >
      <p
        className={cn('font-sans text-neutral-100')}
        style={{ textShadow: '#000 1px 0 3px' }}
      >
        <span className="text-[2vw] font-thin">
          {APP_NAME} doesn&apos;t support iframe embedding yet,
          <br />
          please use the official domain instead:
        </span>
        <br />
        <a
          href={APP_LINK}
          className="font-regular text-[4vw] underline underline-offset-[1vw]"
          target="_blank"
        >
          {APP_DOMAIN}
        </a>
      </p>
    </div>
  )
}
