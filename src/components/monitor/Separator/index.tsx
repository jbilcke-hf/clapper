
import { cn } from "@/lib/utils"

export function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `inline-block opacity-50`,
        className
      )}
    ><span
      className="inline-block scale-[0.8] trangray-y-[-1px] @lg:trangray-y-[-2px] @2xl:trangray-y-[-3px]"
      >:</span></div>
  )
}