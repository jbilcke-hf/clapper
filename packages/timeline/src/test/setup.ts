import { vi } from "vitest"

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => ({
    measureText: (text: string) => ({ width: text.length * 8 }),
  })),
})
