import { cn } from '@/lib/utils'
import './globals.css'
import "./react-reflex.css"
import "./react-reflex-custom.css"

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
        style={{ overscrollBehaviorX: "none" }}>
        {children}
      </body>
    </html>
  )
}
