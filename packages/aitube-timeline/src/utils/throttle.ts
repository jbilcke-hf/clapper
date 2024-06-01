export function throttle<T>(wait: number, fn: T): T {
  let inThrottle: boolean
  let lastFn: ReturnType<typeof setTimeout>
  let lastTime: number
  const result = function (this: any) {
    const context = this
    const args = arguments
    if (!inThrottle) {
      (fn as any).apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          (fn as any).apply(context, args)
          lastTime = Date.now()
        }
      }, Math.max(wait - (Date.now() - lastTime), 0))
    }
  }

  return result as unknown as T
}