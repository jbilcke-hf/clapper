import { ReactNode } from "react"

export enum TaskVisibility {
  BLOCKER = "BLOCKER",
  BACKGROUND = "BACKGROUND",
  INVISIBLE = "INVISIBLE"
}

export enum TaskProgressType {
  RATIO = "RATIO", // number between 0 and 1
  PERCENTAGE = "PERCENTAGE", // number between 0 and 100
  COUNTER = "COUNTER"  // number between min and max
}

export enum TaskCategory {
  DOWNLOAD = "DOWNLOAD",
  EXPORT = "EXPORT",
  IMPORT = "IMPORT",
  ANALYSIS = "ANALYSIS",
  STORYBOARD = "STORYBOARD",
  VIDEO = "VIDEO",
  GENERIC = "GENERIC"
}

export enum TaskStatus {
  UPCOMING = "UPCOMING",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  CANCELLED = "CANCELLED",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  DELETED = "DELETED"
}

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

export type TasksState = {
  tasks: Record<string, Task>,
  expandTasks: boolean
}

export type TasksControls = {
  setExpandTasks: (expandTasks: boolean) => void,
  get: (taskId?: string) => TaskRemoteControl | undefined
  find: (params?: {
    status?: TaskStatus
    category?: TaskCategory
    visibility?: TaskVisibility
  }) => Task[]
  add: (partialTask: Partial<Task>, status?: TaskStatus) => TaskRemoteControl
  pause: (taskId?: string) => void
  continue: (taskId?: string) => void
  setStatus: (status: TaskStatus, taskId?: string) => void
  setProgress: (taskId: string, options?: {
    value?: number
    sleepDelay?: number
    message?: string
    isFinished?: boolean
    hasFailed?: boolean
  }) => Promise<void>

  // cancel and clear all tasks (used when switching project)
  clear: () => void

  // mark a task as completed
  success: (taskId: string) => void
  fail: (taskId: string, reason?: string) => void
  cancel: (taskId?: string) => void
}

export type TasksStore = TasksState & TasksControls