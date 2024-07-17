import { cn } from '@/lib/utils'

import './styles/globals.css'
import './styles/react-reflex.css'
import './styles/react-reflex-custom.css'

import type { Metadata } from 'next'
import { inter } from './fonts'

export const metadata: Metadata = {
  title: 'Clapper',
  description: 'Clapper - The free and open-source AI Video Editor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ overscrollBehaviorX: 'none' }}>
      <body
        className={cn(`overflow-none dark h-full w-full`, inter.className)}
        style={{
          overscrollBehaviorX: 'none',
          backgroundImage:
            'repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #37353455, #373534 )',
        }}
      >
        {children}
      </body>
    </html>
  )
}
