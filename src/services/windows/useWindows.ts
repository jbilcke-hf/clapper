import { create } from 'zustand'

import { WindowsStore, WindowState } from './types'
import { useCallback } from 'react'

// Create the Zustand store
export const useWindows = create<WindowsStore>((set, get) => ({
  windows: {},
  getNextPosition: (width: number, height: number) => {
    const state = get()
    const existingWindows = Object.values(state.windows)
    const defaultOffset = 30 // Offset for cascading windows
    let newX = 0
    let newY = 0
    let maxIterations = 100 // Prevent infinite loop

    const isOverlapping = (x: number, y: number) => {
      return existingWindows.some(
        (w) =>
          x < w.x + w.width &&
          x + width > w.x &&
          y < w.y + w.height &&
          y + height > w.y
      )
    }

    while (maxIterations > 0) {
      if (!isOverlapping(newX, newY)) {
        break
      }

      newX += defaultOffset
      newY += defaultOffset

      // Reset position if it goes too far
      if (newX > 300 || newY > 300) {
        newX = Math.floor(Math.random() * 100)
        newY = Math.floor(Math.random() * 100)
      }

      maxIterations--
    }

    return { x: newX, y: newY }
  },
  addWindow: (window) =>
    set((state) => {
      const maxZIndex = Math.max(
        0,
        ...Object.values(state.windows).map((w) => w.zIndex)
      )
      const { x: newX, y: newY } = state.getNextPosition(
        window.width,
        window.height
      )
      return {
        windows: {
          ...state.windows,
          [window.id]: {
            ...window,
            zIndex: maxZIndex + 1,
            isFocused: true,
            isReduced: false,
            x: window.x !== undefined ? window.x : newX,
            y: window.y !== undefined ? window.y : newY,
            width: window.width,
            height: window.height,
          },
        },
      }
    }),
  updateWindow: (id, updates) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], ...updates },
      },
    })),
  removeWindow: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.windows
      return { windows: rest }
    }),
  focusWindow: (id) =>
    set((state) => {
      const maxZIndex = Math.max(
        ...Object.values(state.windows).map((w) => w.zIndex)
      )
      return {
        windows: Object.fromEntries(
          Object.entries(state.windows).map(([key, window]) => [
            key,
            {
              ...window,
              zIndex: key === id ? maxZIndex + 1 : window.zIndex,
              isFocused: key === id,
            },
          ])
        ),
      }
    }),
}))

// Custom hook to use window state in other components
export const useWindow = (id: string) => {
  return useWindows(
    useCallback(
      (state) => ({
        ...state.windows[id],
        updateWindow: (updates: Partial<WindowState>) =>
          state.updateWindow(id, updates),
      }),
      [id]
    )
  )
}
