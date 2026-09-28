import { useMemo } from 'react'
import { ComfyUIWorkflowApiGraph } from '@/app/api/resolve/providers/comfyui/graph'

/** Compact API graph preview. This never executes or installs imported nodes. */
export function ComfyWorkflowPreview({ json }: { json: string }) {
  const graph = useMemo(() => {
    try {
      return ComfyUIWorkflowApiGraph.fromString(json)
    } catch {
      return undefined
    }
  }, [json])
  if (!graph) return null
  const nodes = graph.getNodes()
  const { dependencyList } = graph.getGraphData()
  const depths = new Map<string, number>()
  const depthOf = (id: string): number => {
    if (depths.has(id)) return depths.get(id)!
    const depth =
      Math.max(
        -1,
        ...dependencyList[id].map((parent) => depthOf(parent.from))
      ) + 1
    depths.set(id, depth)
    return depth
  }
  const rows = new Map<number, number>()
  const positions = new Map(
    nodes.map((node) => {
      const depth = depthOf(node.id)
      const row = rows.get(depth) || 0
      rows.set(depth, row + 1)
      return [node.id, { x: depth * 240 + 12, y: row * 80 + 12 }]
    })
  )
  const width = (Math.max(...Array.from(depths.values())) + 1) * 240
  const height = Math.max(...Array.from(rows.values())) * 80
  return (
    <details className="rounded border border-neutral-500/30 p-3">
      <summary className="cursor-pointer text-sm">
        Preview workflow · {nodes.length} nodes
      </summary>
      <div className="mt-3 max-h-80 overflow-auto rounded bg-neutral-950">
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`ComfyUI workflow graph with ${nodes.length} nodes`}
        >
          {nodes.flatMap((node) =>
            dependencyList[node.id].map((parent) => {
              const from = positions.get(parent.from)!
              const to = positions.get(node.id)!
              return (
                <path
                  key={`${parent.from}-${node.id}-${parent.inputName}`}
                  fill="none"
                  stroke="#94a3b8"
                  d={`M${from.x + 204},${from.y + 27} C${from.x + 222},${from.y + 27} ${to.x - 18},${to.y + 27} ${to.x},${to.y + 27}`}
                />
              )
            })
          )}
          {nodes.map((node) => {
            const { x, y } = positions.get(node.id)!
            const name = node._meta?.title || node.class_type || node.id
            return (
              <g key={node.id} transform={`translate(${x},${y})`}>
                <title>{`#${node.id}: ${name} (${node.class_type})`}</title>
                <rect
                  width="204"
                  height="54"
                  rx="6"
                  fill="#1e293b"
                  stroke="#64748b"
                />
                <text x="9" y="22" fill="#f8fafc" fontSize="12">
                  {name.slice(0, 26)}
                </text>
                <text x="9" y="40" fill="#cbd5e1" fontSize="10">
                  #{node.id} · {(node.class_type || '').slice(0, 24)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <ol className="mt-3 grid max-h-64 gap-2 overflow-auto sm:grid-cols-2">
        {nodes.map((node) => (
          <li
            key={node.id}
            className="rounded border border-neutral-500/30 p-2 text-xs"
          >
            <strong>{node._meta?.title || node.class_type}</strong>
            <div className="opacity-70">
              #{node.id} · {node.class_type}
            </div>
            {Object.entries(node.inputs || {})
              .filter(([, value]) => Array.isArray(value))
              .map(([input, value]) => (
                <div key={input}>
                  #{value[0]} → {input} (output {value[1]})
                </div>
              ))}
          </li>
        ))}
      </ol>
    </details>
  )
}
