import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

function NodeComponent({
  data,
}: {
  data: {
    name: string
    job: string
    emoji: string
  }
}) {
  return (
    <div className="rounded-md border-2 border-neutral-400 bg-white px-4 py-2 shadow-md">
      <div className="flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          {data.emoji}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.name}</div>
          <div className="text-gray-500">{data.job}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  )
}

export const Node = memo(NodeComponent)
