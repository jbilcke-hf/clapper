// Define the window state type
export type WindowState = {
  id: string
  title: string | JSX.Element
  isVisible: boolean
  zIndex: number
  width: number
  height: number
  x: number
  y: number
  isFocused: boolean
  isReduced: boolean
  canBeReduced: boolean
  canBeClosed: boolean
}

// Define the store type
export type WindowsStore = {
  windows: Record<string, WindowState>
  snapToGrid: boolean
  gridWidthInPercent: number
  gridHeightInPercent: number
  gridAttractionAreaInPixels: number
  setSnapToGrid: (snapToGrid: boolean) => void
  setGridWidthInPercent: (gridWidthInPercent: number) => void
  setGridHeightInPercent: (gridHeightInPercent: number) => void
  setGridAttractionAreaInPixels: (gridAttractionAreaInPixels: number) => void
  getNextPosition: (width: number, height: number) => { x: number; y: number }
  addWindow: (
    win: Omit<
      WindowState,
      'zIndex' | 'isFocused' | 'isReduced' | 'x' | 'y'
    > & { x?: number; y?: number }
  ) => void
  snapToGridValue: (value: number, cellSize: number, attractionArea: number) => number
  updateWindow: (id: string, updates: Partial<WindowState>) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  removeWindow: (id: string) => void
  focusWindow: (id: string) => void
}
