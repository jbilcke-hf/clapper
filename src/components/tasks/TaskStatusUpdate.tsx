import { useTasks } from './useTasks'

export function TaskStatusUpdate({ taskId }: { taskId: string }) {
  const { tasks } = useTasks()

  return <span>{tasks[taskId]?.currentMessage || 'Task in progress..'}</span>
}
