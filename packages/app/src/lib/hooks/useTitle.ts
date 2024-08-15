import { useState, useEffect } from 'react'

export const useTitle = (): {
  title: string
  changeTitle: (newTitle: string) => void
} => {
  const [title, setTitle] = useState<string>(document.title)

  useEffect(() => {
    document.title = title
  }, [title])

  const changeTitle = (newTitle: string) => setTitle(newTitle)

  return { title, changeTitle }
}
