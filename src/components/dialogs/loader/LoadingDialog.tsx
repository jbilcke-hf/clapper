import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { useTasks } from "../../tasks/useTasks"
import { TaskStatus, TaskVisibility } from "@/components/tasks/types"

// a loading dialog that cannot be closed once it's loading
export function LoadingDialog({ className = "" }: { className?: string }) {
  const { find } = useTasks()

  const runningBlockerTasks = find({ status: TaskStatus.RUNNING, visibility: TaskVisibility.BLOCKER })
  const isLoading = runningBlockerTasks.length > 0
  const currentMessage = runningBlockerTasks[0]?.currentMessage || ""
  const progress = runningBlockerTasks[0]?.progress || 0

  return (
    <Dialog open={isLoading}>
      <DialogContent className="h-44">
        <div className={cn(
          "absolute",
          "flex flex-col",
          "items-center justify-center",
          "w-full h-full",
          "space-y-6",
          `transition-all duration-200 ease-in-out`,
          {
            "backdrop-blur-xl opacity-100 pointer-events-auto": isLoading,
            "opacity-0 pointer-events-none": !isLoading,
          })}>
          <div className={cn(`text-lg`, className)}>
            {currentMessage}
          </div>
          <div className="flex flex-col items-center justify-center w-full p-8">
            <Progress
              value={progress}
              className="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}