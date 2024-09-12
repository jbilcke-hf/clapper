import { useState, useEffect } from 'react'

export type Breakpoints = {
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  is2xl: boolean
}

export function useBreakpoints(): Breakpoints {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2xl: false,
  })

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth
      setBreakpoints({
        isSm: width >= 640,
        isMd: width >= 768,
        isLg: width >= 1024,
        isXl: width >= 1280,
        is2xl: width >= 1536,
      })
    }

    // Initial check
    updateBreakpoints()

    // Add event listener
    window.addEventListener('resize', updateBreakpoints)

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoints)
  }, [])

  return breakpoints
}
