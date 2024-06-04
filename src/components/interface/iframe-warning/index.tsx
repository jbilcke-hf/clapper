"use client"

import { APP_DOMAIN, APP_LINK, APP_NAME } from "@/lib/core/constants"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function IframeWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setShowWarning(window.self !== window.top)
    return () => {}
  }, [])
  // TODO: read our global state

  return (
    <div className={cn(`
      fixed
      z-50
      flex
      w-screen h-screen
      top-0 left-0 right-0 bottom-0
      p-0 m-0
      overflow-hidden
      items-center justify-center
      `,
      showWarning
      ? 'opacity-100 pointer-events-auto'
      : 'pointer-events-none opacity-0',
      )}
      style={{
       backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #34353655, #343536 )"
      }}>
      <p
        className={cn("text-stone-100 font-sans font-thin text-[3vw]")}
        style={{ textShadow: "#000 1px 0 3px" }}>
        <span>
          {APP_NAME} doesn&apos;t work well when used from an iframe, please use the official website instead:
        </span>
        <br/>
        <a href={APP_LINK} target="_blank">
          {APP_DOMAIN}
        </a>
      </p>
    </div>
  )
}