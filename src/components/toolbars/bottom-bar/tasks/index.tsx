import { TaskStatus, TaskVisibility } from '@aitube/clapper-services'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useTasks } from '@/services'

export function Tasks() {
  const { find, tasks } = useTasks()

  const runningBlockerTasks = find({
    status: TaskStatus.RUNNING,
    visibility: TaskVisibility.BLOCKER,
  })
  const runningBackgroundTasks = find({
    status: TaskStatus.RUNNING,
    visibility: TaskVisibility.BACKGROUND,
  })

  const nbRunningBackgroundTasks = runningBackgroundTasks.length
  const hasRunningBackgroundTasks = nbRunningBackgroundTasks > 0
  const currentRunningBackgroundTaskProgress =
    runningBackgroundTasks[0]?.progress || 0

  const nbRunningBlockerTasks = runningBlockerTasks.length
  const hasRunningBlockerTasks = nbRunningBlockerTasks > 0
  const currentRunningBlockerTaskProgress =
    runningBlockerTasks[0]?.progress || 0

  return (
    <div className={cn(``)}>
      <Popover>
        <PopoverTrigger>
          {nbRunningBackgroundTasks || 'no'} pending tasks
        </PopoverTrigger>
        <PopoverContent>
          <div className={cn(`flex flex-col text-xs font-light`)}>
            {runningBackgroundTasks.map((task) => {
              return (
                <div className="flex flex-row" key={task.id}>
                  <div>{task.status}</div>
                  <div>{task.priority}</div>
                  <div>{task.category}</div>
                  <div>{task.progress}%</div>
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
