export type VersionHistory<T> = {
  before: T[]
  current?: T
  after: T[]
}

export type VersionState<T> = VersionHistory<T> & {
  version: number
}

export type VersionControls<T> = {
  setCurrent: (current?: T) => void
  undo: () => void
  redo: () => void
}

export function undo<T>(state: VersionState<T>) {
  let before: T[] = state?.before || []
  let current: T | undefined = typeof state?.current !== 'undefined' && state?.current !== null ? state?.current : undefined
  let after: T[] = state?.after || []
  let version: number = state?.version || 0

  // we add the current value to the redo
  if (current) {
    after.unshift(current)
  }
  if (before.length) {
    current = before.pop()
  }

  return {
    before,
    current,
    after,
    version: version + 1
  }
}

export function redo<T>(state: VersionState<T>) {
  let before: T[] = state?.before || []
  let current: T | undefined = typeof state?.current !== 'undefined' && state?.current !== null ? state?.current : undefined
  let after: T[] = state?.after || []
  let version: number = state?.version || 0

  // we add the current value to the undo
  if (current) {
    before.push(current)
  }
  if (after.length) {
    current = after.shift()
  }

  return {
    before,
    current,
    after,
    version: version + 1
  }
}
