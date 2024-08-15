'use client'

import { useTheme } from '@/services'
import { cn } from '@/lib/utils'

import { TopMenu } from '../top-menu'

export function TopBar() {
  const theme = useTheme()

  return (
    <div
      className={cn(`h-9 w-full`)}
      style={{
        backgroundColor: theme.defaultBgColor || '#000000',
      }}
    >
      <div
        className={cn(
          `flex flex-row`,
          `h-full w-full`,
          `items-center bg-neutral-900/30`,
          `border-b`,
          `border-b-neutral-700/30`
        )}
      >
        <TopMenu />
      </div>
    </div>
  )
}
