import { cn } from '@/lib/utils'

import './styles/globals.css'
import "./styles/react-reflex.css"
import "./styles/react-reflex-custom.css"

import type { Metadata } from 'next'
import { inter } from './fonts'

export const metadata: Metadata = {
  title: 'Clap Viewer - Visualize .clap files 🎞️',
  description: 'Clap Viewer - Visualize .clap files 🎞️',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ overscrollBehaviorX: "none"}}>
      <body className={cn(
        `h-full w-full overflow-none dark`,
       inter.className
        )}
        style={{
          overscrollBehaviorX: "none",
          backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #34353655, #343536 )"
        }}>
        {children}
      </body>
    </html>
  )
}
