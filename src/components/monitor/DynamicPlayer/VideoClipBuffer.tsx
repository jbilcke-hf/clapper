import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export function VideoClipBuffer({
  src,
  className,
  muted = true,
  isPlaying = false,
}: {
  src?: string;
  className?: string;
  muted?: boolean;
  isPlaying?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null)

  const togglePlayVideo = (play: boolean) => {
    const player = ref.current
    if (!player) { return }
    // console.log(`togglePlayVideo(${play}) (current status = ${player.paused ? "paused" : "playing"})`)
    if (play && player.paused) {
      // console.log("playing video..")
      player.play()
    } else if (!play && !player.paused) {
      // console.log("pausing video..")
      player.pause()
    }
  }

  useEffect(() => {
    const player = ref.current
    if (!player) { return }
    togglePlayVideo(isPlaying)
  }, [isPlaying])

  if (!src) { return null }
  
  return (
    <video    
      ref={ref}
      autoPlay={isPlaying}
      controls={false}
      playsInline
      muted={muted}
      loop
      className={cn(
        `absolute`,
        `h-full w-full rounded-md overflow-hidden`,

        // iseally we could only use the ease-out and duration-150
        // to avoid a weird fade to grey,
        // but the ease out also depends on which video is on top of each other,
        // in term of z-index, so we should also intervert this
        `transition-all duration-100 ease-out`,
        className
      )}
      src={src}
    />
  )
}