import { cn } from '@/lib/utils'

export function DeprecatedLoader({
  isLoading = false,
  className = '',
}: {
  isLoading?: boolean
  className?: string
}) {
  // TODO: read our global state

  return (
    <div
      className={cn(
        `fixed z-[100] flex h-svh w-screen`,

        // the purpose here is to make the background blur work a bit more nicely
        // by going outside the edges
        `scale-105`,

        `top-0 right-0 bottom-0 left-0`,
        `m-0 items-center justify-center overflow-hidden p-0 backdrop-blur-lg`,
        isLoading
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0',
        className
      )}
    >
      <p
        className={cn('font-sans text-[3vw] font-thin text-neutral-100')}
        style={{ textShadow: '#000 1px 0 3px' }}
      >
        <span className="">Loading..</span>
      </p>
    </div>
  )
}
