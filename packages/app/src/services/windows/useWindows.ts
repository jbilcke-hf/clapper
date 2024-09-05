import { create } from 'zustand'

import { WindowsStore, WindowState } from './types'
import { useCallback } from 'react'

export const useWindows = create<WindowsStore>((set, get) => ({
  windows: {},
  snapToGrid: false,
  gridWidthInPercent: 10,
  gridHeightInPercent: 10,
  gridAttractionAreaInPixels: 20,

  setSnapToGrid: (snapToGrid: boolean) => set({ snapToGrid }),
  setGridWidthInPercent: (gridWidthInPercent: number) =>
    set({ gridWidthInPercent }),
  setGridHeightInPercent: (gridHeightInPercent: number) =>
    set({ gridHeightInPercent }),
  setGridAttractionAreaInPixels: (gridAttractionAreaInPixels: number) =>
    set({ gridAttractionAreaInPixels }),

  getNextPosition: (width: number, height: number) => {
    const state = get()
    const existingWindows = Object.values(state.windows)
    const defaultOffset = 100 // Offset for cascading windows
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
  addWindow: (win) =>
    set((state) => {
      const maxZIndex = Math.max(
        0,
        ...Object.values(state.windows).map((w) => w.zIndex)
      )
      const { x: newX, y: newY } = state.getNextPosition(
        win.width,
        win.height
      )
      return {
        windows: {
          ...state.windows,
          [win.id]: {
            ...win,
            zIndex: maxZIndex + 1,
            isFocused: true,
            isReduced: false,
            x: win.x !== undefined ? win.x : newX,
            y: win.y !== undefined ? win.y : newY,
            width: win.width,
            height: win.height,
          },
        },
      }
    }),
    
    snapToGridValue: (value: number, cellSize: number, attractionArea: number): number => {
      const closestGridLine = Math.round(value / cellSize) * cellSize
      if (Math.abs(value - closestGridLine) <= attractionArea) {
        return closestGridLine
      }
      return value
    },
  
    updateWindowPosition: (id: string, x: number, y: number) => {
      const state = get()
      const { snapToGrid, gridWidthInPercent, gridHeightInPercent, gridAttractionAreaInPixels } = state
      const win = state.windows[id]
      
      if (snapToGrid) {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const gridCellWidth = (viewportWidth * gridWidthInPercent) / 100
        const gridCellHeight = (viewportHeight * gridHeightInPercent) / 100
    
        // Snap to left or right edge
        if (x <= gridAttractionAreaInPixels) {
          x = 0
        } else if (viewportWidth - (x + win.width) <= gridAttractionAreaInPixels) {
          x = viewportWidth - win.width
        } else {
          x = state.snapToGridValue(x, gridCellWidth, gridAttractionAreaInPixels)
        }
    
        // Snap to top or bottom edge
        if (y <= gridAttractionAreaInPixels) {
          y = 0
        } else if (viewportHeight - (y + win.height) <= gridAttractionAreaInPixels) {
          y = viewportHeight - win.height
        } else {
          y = state.snapToGridValue(y, gridCellHeight, gridAttractionAreaInPixels)
        }
    
        // Adjust width and height to snap to opposite edges if close
        let newWidth = win.width
        let newHeight = win.height
    
        if (viewportWidth - (x + win.width) <= gridAttractionAreaInPixels) {
          newWidth = viewportWidth - x
        }
        if (viewportHeight - (y + win.height) <= gridAttractionAreaInPixels) {
          newHeight = viewportHeight - y
        }
    
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], x, y, width: newWidth, height: newHeight },
          },
        }))
      } else {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], x, y },
          },
        }))
      }
    },
    
    updateWindowSize: (id: string, width: number, height: number) => {
      const state = get()
      const { snapToGrid, gridWidthInPercent, gridHeightInPercent, gridAttractionAreaInPixels } = state
      const win = state.windows[id]
      
      if (snapToGrid) {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const gridCellWidth = (viewportWidth * gridWidthInPercent) / 100
        const gridCellHeight = (viewportHeight * gridHeightInPercent) / 100
    
        width = state.snapToGridValue(width, gridCellWidth, gridAttractionAreaInPixels)
        height = state.snapToGridValue(height, gridCellHeight, gridAttractionAreaInPixels)
    
        // Adjust position if snapping to right or bottom edge
        let newX = win.x
        let newY = win.y
    
        if (viewportWidth - (win.x + width) <= gridAttractionAreaInPixels) {
          newX = viewportWidth - width
        }
        if (viewportHeight - (win.y + height) <= gridAttractionAreaInPixels) {
          newY = viewportHeight - height
        }
    
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], width, height, x: newX, y: newY },
          },
        }))
      } else {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], width, height },
          },
        }))
      }
    },
  
    updateWindow: (id, updates) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: state.windows[id]
            ? { ...state.windows[id], ...updates }
            : state.windows[id],
        },
      }))
    },

    
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
