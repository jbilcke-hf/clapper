'use client'

import React, { useState, useCallback } from 'react'
import { ComfyWorkflowGraphPreview } from './ComfyWorkflowGraphPreview'

interface CommunityWorkflow {
  id: string
  title: string
  description: string
  author: string
  thumbnailUrl: string
  tags: string[]
  category: string
  downloadUrl: string
  nodeCount: number
  likes: number
  source: string
}

interface CommunityWorkflowBrowserProps {
  onApplyWorkflow?: (workflow: CommunityWorkflow) => void
  width?: number
  height?: number
}

/**
 * Community Workflow Browser component.
 * Allows users to browse and import workflows from the community.
 */
export function CommunityWorkflowBrowser({
  onApplyWorkflow,
  width = 500,
  height = 600,
}: CommunityWorkflowBrowserProps) {
  const [query, setQuery] = useState('')
  const [source, setSource] = useState<'openart' | 'civitai'>('openart')
  const [workflows, setWorkflows] = useState<CommunityWorkflow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedWorkflow, setSelectedWorkflow] = useState<CommunityWorkflow | null>(null)

  const searchWorkflows = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      params.set('source', source)

      const response = await fetch(`/api/workflows?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setWorkflows(data.workflows || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows')
      setWorkflows([])
    } finally {
      setIsLoading(false)
    }
  }, [query, source])

  const handleApply = useCallback((workflow: CommunityWorkflow) => {
    setSelectedWorkflow(workflow)
    onApplyWorkflow?.(workflow)
  }, [onApplyWorkflow])

  return (
    <div className="community-workflow-browser flex flex-col gap-4" style={{ width, maxHeight: height }}>
      {/* Search bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchWorkflows()}
          placeholder="Search workflows..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as 'openart' | 'civitai')}
          className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
        >
          <option value="openart">OpenArt</option>
          <option value="civitai">CivitAI</option>
        </select>
        <button
          onClick={searchWorkflows}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
          {error}
        </div>
      )}

      {/* Workflow list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {workflows.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            {query ? 'No workflows found' : 'Search for community workflows above'}
          </div>
        )}

        {workflows.map((workflow) => (
          <div
            key={`${workflow.source}-${workflow.id}`}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedWorkflow?.id === workflow.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
            onClick={() => handleApply(workflow)}
          >
            <div className="flex gap-3">
              {workflow.thumbnailUrl && (
                <img
                  src={workflow.thumbnailUrl}
                  alt={workflow.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{workflow.title}</h3>
                <p className="text-xs text-gray-500 truncate">
                  by {workflow.author}
                </p>
                {workflow.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {workflow.description}
                  </p>
                )}
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {workflow.nodeCount} nodes
                  </span>
                  <span className="text-xs text-gray-400">
                    {workflow.likes} likes
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
                    {workflow.source}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected workflow actions */}
      {selectedWorkflow && (
        <div className="p-3 border border-blue-300 dark:border-blue-700 rounded-md bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm font-medium">Selected: {selectedWorkflow.title}</p>
          <p className="text-xs text-gray-500">Source: {selectedWorkflow.source}</p>
          <button
            onClick={() => handleApply(selectedWorkflow)}
            className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Apply Workflow
          </button>
        </div>
      )}
    </div>
  )
}
