import { MdMovieFilter, MdOutlineMovieFilter } from "react-icons/md"
import { PiPauseFill, PiPlayFill } from "react-icons/pi"
import { BiSolidMoviePlay } from "react-icons/bi"
// import Image from "next/image"

import { useResolver } from "@/controllers/resolver/useResolver"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
// import logo from "../../../app/logo-v2.png"

import { ActivitySpinner } from "../ActivitySpinner"
import { cn } from "@aitube/timeline"
import { useTheme } from "@/controllers/ui/useTheme"

export function TopMenuLogo() {
  const theme = useTheme()
  const isPaused = useResolver(s => s.isPaused)
  const togglePause = useResolver(s => s.togglePause)
  const isBusyResolving = useResolver(s => s.isBusyResolving)

  // we could display this in the modal, but it is not very informative
  // it would be more useful to display things like:
  // nb remaining assets to process per category (10 images, 40 videos..) 
  // estimated total time
  // a little timeline of the production rate (a tiny chart)
  // rendering rate (frames per second etc, kbps etc)
  const nbRequestsRunningInParallel = useResolver(s => s.nbRequestsRunningInParallel)

  // it doesn't look great when minified like this
  // <Image src={logo} height={32} alt="Clapper" /> */}

  // we have to disable the button when we are in an intermediary state,
  // such has a paused resolver with pending tasks
  // otherwise users get confused, thinking it didn't work
  // and they might click multiple times
  const isDisabled = isBusyResolving && isPaused

  const color = theme.logoColor || theme.defaultPrimaryColor || ""

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center justify-center">
        <div
          className={cn(`
          flex items-center justify-center
          group
          `, isDisabled ? "" : "pointer-cursor")}
          onClick={() => {
            if (isDisabled) { return }
            togglePause()
          }}
          >
          {isBusyResolving 
          ? <div
             className="
             flex items-center justify-center
             w-4 h-4
             ">
              <ActivitySpinner
                isBusy={isBusyResolving}
                className="absolute opacity-100 group-hover:opacity-0 w-4 h-4"
                color={ color }
              />
              {isPaused

              // imho using the original "logo" (sort of) is a bit more elegant than a simple play button
              // ? <PiPlayFill className="absolute opacity-0 group-hover:opacity-100" style={{ color }} />
              ? <BiSolidMoviePlay className="absolute opacity-0 group-hover:opacity-100" style={{ color }} />

              : <PiPauseFill className="absolute opacity-0 group-hover:opacity-100" style={{ color }} />

              }
            </div>
          : <BiSolidMoviePlay
              style={{ color }}
            />}
          <span className="
          pr-2
          scale-[88%]
          text-lg font-bold tracking-[-0.03em]
          "
          style={{ color }}>Clapper</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs text-yellow-300">
          {/*
          <p>{
          nbRequestsRunningInParallel || 0
            } remaining task{
          nbRequestsRunningInParallel > 1 ? 's' : ''
          }</p>
          */}
          {isBusyResolving
          ? <span>Some tasks are still pending.</span>
          : <span>No pending task in progress.</span>
          }
          <br/>
          {isPaused
            ? <span>Click to RESUME generation.</span>
            : <span>Click to PAUSE generation.</span>}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}