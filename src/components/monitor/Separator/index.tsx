import { cn } from '@/lib/utils'

export function Separator({
  className,
  color,
}: {
  className?: string
  color?: string
}) {
  return (
    <div className={cn(`inline-block opacity-50`, className)} style={{ color }}>
      <span className="trangray-y-[-1px] @lg:trangray-y-[-2px] @2xl:trangray-y-[-3px] inline-block scale-[0.8]">
        :
      </span>
    </div>
  )
}
