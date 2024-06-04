import { ReactNode } from "react"

export type TaskVisibility =
  | "blocker"
  | "background"
  | "invisible"

export type TaskProgressType =
  | "ratio" // number between 0 and 1
  | "percentage" // number between 0 and 100
  | "counter" // number between min and max

export type TaskCategory =
  | "download"
  | "import"
  | "analysis"
  | "storyboard"
  | "video"
  | "depth"
  | "mesh"
  | "splat"
  | "phenomenon"
  | "interface"
  | "generic"

export type TaskStatus =
  | "upcoming"
  | "running"
  | "paused"
  | "cancelled"
  | "error"
  | "success"
  | "deleted"

export type StatusGetter = () => TaskStatus
export type TaskRunner = (getStatus: StatusGetter) => Promise<TaskStatus>

export type NewTask = {
  id: string
  category: TaskCategory
  visibility: TaskVisibility
  initialMessage: ReactNode
  successMessage: ReactNode
  priority: number // 0 = lowest, 1 or more = more and more important
  value: number
  progress: number
  status: TaskStatus
  min: number
  max: number
  mode: TaskProgressType
  run?: TaskRunner
}

export type Task = NewTask & {
  currentMessage: ReactNode
  startedAt: string
  endedAt: string
  value: number
  promise: Promise<TaskStatus>
}

/**
 * A nice helper to do various operations with tasks
 */
export type TaskRemoteControl = {
  task: Task

  // a promise tracking the current status of the task
  promise: Promise<TaskStatus>
  pause: () => void
  continue: () => void
  setStatus: (status: TaskStatus) => void
  setProgress: (options?: {
    value?: number
    sleepDelay?: number
    message?: string
    isFinished?: boolean
  }) => Promise<void>

  success: () => void
  fail: (reason?: string) => void
  cancel: () => void
}