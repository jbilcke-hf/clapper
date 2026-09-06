import { expect, test } from 'vitest'

import { comfyUiToReactWorkflow } from './comfyUiToReactWorkflow'

test('converts ComfyUI API workflow nodes and links to React Flow graph data', () => {
  const graph = comfyUiToReactWorkflow({
    '1': {
      class_type: 'LoadImage',
      inputs: {},
      _meta: { title: 'Load Image' },
    },
    '2': {
      class_type: 'SaveImage',
      inputs: {
        images: ['1', 0],
        filename_prefix: 'ComfyUI',
      },
      _meta: { title: 'Save Image' },
    },
  })

  expect(graph.nodes).toEqual([
    expect.objectContaining({
      id: '1',
      data: expect.objectContaining({ name: 'Load Image' }),
    }),
    expect.objectContaining({
      id: '2',
      data: expect.objectContaining({ name: 'Save Image' }),
    }),
  ])
  expect(graph.edges).toEqual([
    expect.objectContaining({
      id: '1-2-images',
      source: '1',
      target: '2',
      label: 'images',
    }),
  ])
})
