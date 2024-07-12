"use client"

import { create } from "zustand"
import { toast } from "sonner"
import { UUID } from "@aitube/clap"
import { TasksStore, NewTask, Task, TaskCategory, TaskProgressType, TaskRemoteControl, TaskStatus, TaskVisibility } from "@aitube/clapper-services"

import { TaskStatusUpdate } from "./TaskStatusUpdate"
import { sleep } from "@/lib/utils/sleep"

// we enforce the impossibility of some transitions
function statusTransition(current: TaskStatus, requested: TaskStatus): TaskStatus {
  switch (current) {
    case TaskStatus.UPCOMING:
    case TaskStatus.RUNNING:
    case TaskStatus.PAUSED:
      return requested

    default:
      return current
  }
}

/**
 * A task manager, used for downloads, processing..
 * 
 * It may seem a bit complicated, but that's because it can handle various modes:
 * 
 * - Promise (you pass a function returning a promise, and it will wait the end)
 * - Progressive (no function, no promise, instead you call yourself a progress update function)
 * 
 * It is also complex, because it is bidirectional!
 * - A task can receive a helper to gets its status, but it can also sets its own status
 * - A task can finish itself, ir be finished by an external event etc..
 * 
 * and it also provides tons of helper to track the status
 */
export const useTasks = create<TasksStore>((set, get) => ({
  tasks: {} as Record<string, Task>,
  expandTasks: false,
  setExpandTasks: (expandTasks: boolean) => {
    set({ expandTasks })
  },
  get: (taskId?: string): TaskRemoteControl | undefined => {
    const { tasks } = get()
    if (!taskId) { return undefined }
    const task = (tasks[taskId || "" ] || undefined) as Task | undefined
    if (!task) { return }

    // we provide a helper to whoever called us
    return {
      task,
      promise: task.promise,
      pause: () => {
        return get().pause(task.id)
      },
      continue: () => {
        return get().continue(task.id)
      },
      setStatus: (status: TaskStatus) => {
        return get().setStatus(status, task.id)
      },
      setProgress: async (options?: {
        value?: number
        sleepDelay?: number
        message?: string
        isFinished?: boolean
        hasFailed?: boolean
      }) => {
        return get().setProgress(task.id, options)
      },
      success: () => {
        return get().success(task.id)
      },
      fail: (reason?: string) => {
        return get().fail(task.id, reason)
      },
      cancel: () => {
        return get().cancel(task.id)
      }
    }
  },
  find: (params?: {
    status?: TaskStatus
    category?: TaskCategory
    visibility?: TaskVisibility
  }): Task[] => {
    const {
      tasks,
    } = get()

    let list = Object.values(tasks)
  
    if (params?.status) {
      list = list.filter(t => t.status === params?.status)
    }

    if (params?.category) {
      list = list.filter(t => t.category === params?.category)
    }

    return list
  },
  add: (partialTask: Partial<NewTask>, status?: TaskStatus): TaskRemoteControl => {
    const mode: TaskProgressType = partialTask?.mode || TaskProgressType.PERCENTAGE

    const min = mode === TaskProgressType.COUNTER && partialTask?.min ? partialTask.min : 0
    const max = mode === TaskProgressType.COUNTER && partialTask?.max ? partialTask.max : mode === TaskProgressType.RATIO ? 1 : mode === TaskProgressType.PERCENTAGE ? 100 : 100
  
    const id = UUID()

    const newTask: NewTask = {
      id,
      visibility: partialTask?.visibility || TaskVisibility.BACKGROUND,
      category: partialTask?.category || TaskCategory.GENERIC,
      initialMessage: partialTask?.initialMessage || "Loading..",
      successMessage: partialTask?.successMessage || "Task completed!",
      priority: partialTask?.priority || 0, // 0 = lowest, 1 or more = more and more important
      status: status || TaskStatus.RUNNING,
      value: partialTask?.value || 0,
      progress: partialTask?.progress || 0,
      min,
      max,
      mode,
      run: partialTask.run,
    }

    const task: Task = {
      ...newTask,
      currentMessage: newTask.initialMessage,
      startedAt: new Date().toISOString(),
      endedAt: "",
      promise: Promise.resolve(TaskStatus.RUNNING),
    }

    task.promise = new Promise<TaskStatus>((resolve, reject) => {
      let checkStatus = () => {
        try {
          // need to use fresh data here
          const t = get().get(id)!
          
          if (!t) {
            resolve(TaskStatus.SUCCESS)
            return
          }

          const status = t.task.status || "deleted"
          const progress = t.task.progress || 0

          console.log(`useTasks[${id}]: checkStatus: checking task, current status is: "${status}"`)
          if (
            status === TaskStatus.ERROR ||
            status === TaskStatus.SUCCESS ||
            status === TaskStatus.DELETED ||
            status === TaskStatus.CANCELLED
          ) {
            console.log(`useTasks[${id}]: checkStatus: status is "${status}", interrupting task loop..`)

            // this call might be redundant
            if (status === TaskStatus.SUCCESS) {
              get().setProgress(id, { isFinished: true })
            }
            resolve(status)
          } else if (progress >= 100) {
            console.log(`useTasks[${id}]: checkStatus: task is completed at 100%, interrupting task loop..`)
            // this call might be redundant
            get().setProgress(id, { isFinished: true })
            // get().setStatus(TaskStatus.SUCCESS, id)
            resolve(TaskStatus.SUCCESS)
          } else {
            console.log(`useTasks[${id}]: checkStatus: status is "${status}", continuing task loop..`)
            setTimeout(checkStatus, 1000)
          }
        } catch (err) {
          console.error("useTasks:checkStatus: ", err)
        }
      }

      checkStatus()
    })

    toast.promise<TaskStatus>(task.promise, {
      loading: <TaskStatusUpdate taskId={id} />,
      success: (finalStatus) => {
        return finalStatus === TaskStatus.SUCCESS ? task.successMessage : `Task ended`;
      },
      error: 'Task aborted',
    });

    const { tasks } = get()
    set({
      tasks: {
        ...tasks,
        [id]: task,
      }
    })

    setTimeout(async () => {
      // optionally launch the task function, if there is one
      if (!task.run) { return }
      // oh, one last thing: let's launch-and-forget the actual task

      console.log(`useTasks[${id}]: launching the task runner in the background..`)

      // we provide to the task runner a wait to get the current status
      // that wait long-running jobs will know when they have been cancelled and no longer needed
      const result = await task.run(() => {
        const remoteControl = get().get(id)!
        const status = remoteControl?.task?.status
        console.log(`useTasks[${id}]: task runner asked for current status (which is: "${status || "deleted"}")`)
        return status || "deleted"
      })

      console.log(`useTasks[${id}]: task runner ended with status: "${result}"`)
      get().setProgress(id, { isFinished: true })
      // get().setStatus(result, id)
    },  100)

    // we want to return the "remote control", which is a more complex object,
    // with functions and all
    // the easiest way to do this is to call our get() function
    const remoteControl = get().get(id)!

    return remoteControl
  },
  pause: (taskId?: string) => {
    get().setStatus(TaskStatus.PAUSED, taskId)
  },
  continue: (taskId?: string) => {
    get().setStatus(TaskStatus.RUNNING, taskId)
  },
  setStatus: (status: TaskStatus, taskId?: string) => {
    const { tasks } = get()
    const task = get().get(taskId)?.task

    console.log(`useTasks[${taskId}]:setStatus("${status}")`)
    if (task) {
      console.log(`useTasks[${taskId}]:setStatus("${status}") -> setting one task to ${status}`)
      set({
        tasks: {
          ...tasks,
          [task.id]: { ...task, status: statusTransition(task.status, status) }
        }
      })
    } else {
      console.log(`useTasks[${taskId}]:setStatus("${status}") -> setting all tasks to ${status}`)
      const newTasks = {} as Record<string, Task>
      for (const [id, t] of Object.entries(tasks)) {
        newTasks[id] = { ...t, status: statusTransition(t.status, status) }
      }
      set({
        tasks: newTasks
      })
    }
  },
  setProgress: async (taskId: string, options?: {
    value?: number
    sleepDelay?: number
    message?: string
    isFinished?: boolean
    hasFailed?: boolean
  }): Promise<void> => {
    try {
      const { tasks } = get()
      const task = get().get(taskId)?.task

      const message = options?.message || ""
      const value = options?.value || task?.value || 0
      const sleepDelay = options?.sleepDelay || 100

      if (task) {

        let progress =
          task.mode === TaskProgressType.PERCENTAGE
            ? value :
          task.mode === TaskProgressType.RATIO
            ? (value * 100)
          : ((value - task.min) / (task.max - task.min)) * 100
      
        const currentMessage = message || task.initialMessage

        if (options?.hasFailed) {
          set({
            tasks: {
              ...tasks,
              [task.id]: {
                ...task,
                currentMessage,
                status: TaskStatus.ERROR,
                endedAt: new Date().toISOString(),
              }
            }
          })
          
        } else {
          
          const isFinished = options?.isFinished || progress >= 100

          if (isFinished) {
            progress = 100
          } 
          
          set({
            tasks: {
              ...tasks,
              [task.id]: {
                ...task,
                progress,
                value,
                currentMessage,
                status: isFinished ? TaskStatus.SUCCESS : TaskStatus.RUNNING,
                endedAt: isFinished ? new Date().toISOString() : task.endedAt,
              }
            }
          })
        }

        await sleep(sleepDelay)
      }
    } catch (err) {

    }
  },
  clear: () => {
    get().cancel()
    set({ tasks: {} })
  },
  success: (taskId: string) => {
    get().setProgress(taskId, { isFinished: true })
    get().setStatus(TaskStatus.SUCCESS, taskId)
  },
  fail: (taskId: string, reason?: string) => {
    get().setProgress(taskId, {
      message: reason || "unknown failure",
      isFinished: true,
      hasFailed: true,
    })
    get().setStatus(TaskStatus.ERROR, taskId)
  },
  cancel: (taskId?: string) => {
    get().setStatus(TaskStatus.CANCELLED, taskId)
  }
}));

