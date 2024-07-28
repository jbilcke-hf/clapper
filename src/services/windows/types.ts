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
  getNextPosition: (width: number, height: number) => { x: number; y: number }
  addWindow: (
    window: Omit<
      WindowState,
      'zIndex' | 'isFocused' | 'isReduced' | 'x' | 'y'
    > & { x?: number; y?: number }
  ) => void
  updateWindow: (id: string, updates: Partial<WindowState>) => void
  removeWindow: (id: string) => void
  focusWindow: (id: string) => void
}
