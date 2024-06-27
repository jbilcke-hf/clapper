export type VersionedState<T> = {
  current?: T
  version: number
  history: T[]
}

export type VersionControls<T> = {
  setCurrent: (current?: T) => void
  undo: () => void
  redo: () => void
}
