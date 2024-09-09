
export type CursorName = 'auto' | 'grab' | 'ew-resize' | 'pointer'

export function setBodyCursor(cursor: CursorName) {
  if (cursor !== document.body.style.cursor) {
    document.body.style.cursor = cursor
  }
}
