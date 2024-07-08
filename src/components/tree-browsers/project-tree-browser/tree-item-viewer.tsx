"use client"

import { useEntityLibrary } from "../stores/useEntityLibrary"

export function TreeItemViewer() {
  const selectedNodeItem = useEntityLibrary(s => s.selectedNodeItem)
  const selectedNodeType = useEntityLibrary(s => s.selectedNodeType)

  const nodeType = selectedNodeType
  const data = selectedNodeItem

  if (!nodeType || !data) { return null }

  return (
    <div>TODO</div>
  )
}