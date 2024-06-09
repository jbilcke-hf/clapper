import localFont from "next/font/local"
import { Inter } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })

// note: this one is an "italic" digital display font
export const clock = localFont({
  src: "./alarm-clock/alarm-clock.woff2",
  variable: "--font-clock"
})

export const fonts = {
  clock,
  inter
}

export const fontList = Object.keys(fonts)
export type FontName = keyof typeof fonts
export const classNames = Object.values(fonts).map(font => font.className)
export const className = classNames.join(" ")
export type FontClass =
  | "font-clock"
  | "font-inter"