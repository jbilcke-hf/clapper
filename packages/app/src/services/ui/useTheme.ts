import { UITheme } from '@aitube/clapper-services'

import { useUI } from './useUI'

export function useTheme(): UITheme {
  const getTheme = useUI((s) => s.getTheme)
  const themeName = useUI((s) => s.themeName)
  const theme = getTheme()
  return theme
}
