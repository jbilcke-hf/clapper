import { cn } from "@/lib/utils"

export function Loader({
  isLoading = false,
  className = ""
}: {
  isLoading?: boolean
  className?: string
}) {
  // TODO: read our global state

  return (
    <div className={cn(`
      fixed
      z-[100]
      flex
      w-screen h-screen
      top-0 left-0 right-0 bottom-0
      p-0 m-0
      overflow-hidden
      items-center justify-center

      backdrop-blur-lg
      `,
      isLoading
      ? 'opacity-100 pointer-events-auto'
      : 'pointer-events-none opacity-0',
      className)}
      style={{
       // backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #37353455, #373534 )"
      }}>
      <p
        className={cn("text-stone-100 font-sans font-thin text-[3vw]")}
        style={{ textShadow: "#000 1px 0 3px" }}>
        <span className="">Loading..</span>
      </p>
    </div>
  )
}