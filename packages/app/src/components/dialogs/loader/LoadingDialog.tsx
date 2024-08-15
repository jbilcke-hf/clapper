import { TaskStatus, TaskVisibility } from '@aitube/clapper-services'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

import { useTasks } from '../../tasks/useTasks'

// a loading dialog that cannot be closed once it's loading
export function LoadingDialog({ className = '' }: { className?: string }) {
  const { find, tasks } = useTasks()

  const runningBlockerTasks = find({
    status: TaskStatus.RUNNING,
    visibility: TaskVisibility.BLOCKER,
  })
  const isLoading = runningBlockerTasks.length > 0
  const currentMessage = runningBlockerTasks[0]?.currentMessage || ''
  const progress = runningBlockerTasks[0]?.progress || 0

  return (
    <Dialog open={isLoading}>
      <DialogContent className="h-44">
        <div
          className={cn(
            'absolute',
            'flex flex-col',
            'items-center justify-center',
            'h-full w-full',
            'space-y-6',
            `transition-all duration-200 ease-in-out`,
            {
              'pointer-events-auto opacity-100 backdrop-blur-xl': isLoading,
              'pointer-events-none opacity-0': !isLoading,
            }
          )}
        >
          <div className={cn(`text-lg`, className)}>{currentMessage}</div>
          <div className="flex w-full flex-col items-center justify-center p-8">
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
