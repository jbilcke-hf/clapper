import { expect, test } from 'vitest'
import { ComfyUIWorkflowApiUtils } from './utils'

// Default workflow used by ComfyUI, downloaded for API
const workflowRaw = {
  '3': {
    inputs: {
      seed: 156680208700286,
      steps: 20,
      cfg: 8,
      sampler_name: 'euler',
      scheduler: 'normal',
      denoise: 1,
      model: ['4', 0],
      positive: ['6', 0],
      negative: ['7', 0],
      latent_image: ['5', 0],
    },
    class_type: 'KSampler',
    _meta: {
      title: 'KSampler',
    },
  },
  '4': {
    inputs: {
      ckpt_name: 'v1-5-pruned-emaonly.ckpt',
    },
    class_type: 'CheckpointLoaderSimple',
    _meta: {
      title: 'Load Checkpoint',
    },
  },
  '5': {
    inputs: {
      width: 512,
      height: 512,
      batch_size: 1,
    },
    class_type: 'EmptyLatentImage',
    _meta: {
      title: 'Empty Latent Image',
    },
  },
  '6': {
    inputs: {
      text: 'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
      clip: ['4', 1],
    },
    class_type: 'CLIPTextEncode',
    _meta: {
      title: 'CLIP Text Encode (Prompt)',
    },
  },
  '7': {
    inputs: {
      text: 'text, watermark',
      clip: ['4', 1],
    },
    class_type: 'CLIPTextEncode',
    _meta: {
      title: 'CLIP Text Encode (Prompt)',
    },
  },
  '8': {
    inputs: {
      samples: ['3', 0],
      vae: ['4', 2],
    },
    class_type: 'VAEDecode',
    _meta: {
      title: 'VAE Decode',
    },
  },
  '9': {
    inputs: {
      filename_prefix: 'ComfyUI',
      images: ['8', 0],
    },
    class_type: 'SaveImage',
    _meta: {
      title: 'Save Image',
    },
  },
}

// Example workflow object using @clapper/- tokens
const workflowRawWithTokens = {
  '3': {
    inputs: {
      seed: 156680208700286,
      steps: 20,
      cfg: 8,
      sampler_name: 'euler',
      scheduler: 'normal',
      denoise: 1,
      model: ['4', 0],
      positive: ['6', 0],
      negative: ['7', 0],
      latent_image: ['5', 0],
    },
    class_type: 'KSampler',
    _meta: {
      title: 'KSampler',
    },
  },
  '4': {
    inputs: {
      ckpt_name: 'v1-5-pruned-emaonly.ckpt',
    },
    class_type: 'CheckpointLoaderSimple',
    _meta: {
      title: 'Load Checkpoint',
    },
  },
  '5': {
    inputs: {
      width: 512,
      height: 512,
      batch_size: 1,
    },
    class_type: 'EmptyLatentImage',
    _meta: {
      title: 'Empty Latent Image',
    },
  },
  '6': {
    inputs: {
      text: '@clapper/prompt',
      clip: ['4', 1],
    },
    class_type: 'CLIPTextEncode',
    _meta: {
      title: 'CLIP Text Encode (Prompt)',
    },
  },
  '7': {
    inputs: {
      text: '@clapper/negative',
      clip: ['4', 1],
    },
    class_type: 'CLIPTextEncode',
    _meta: {
      title: 'CLIP Text Encode (Prompt)',
    },
  },
  '8': {
    inputs: {
      samples: ['3', 0],
      vae: ['4', 2],
    },
    class_type: 'VAEDecode',
    _meta: {
      title: 'VAE Decode',
    },
  },
  '9': {
    inputs: {
      filename_prefix: 'ComfyUI',
      images: ['8', 0],
    },
    class_type: 'SaveImage',
    _meta: {
      title: 'Save Image',
    },
  },
}

test('should return all nodes that have inputs', () => {
  const nodesWithInputs = new ComfyUIWorkflowApiUtils(
    workflowRaw
  ).getNodesWithInputs()

  // Expect nodes 3, 4, 5, 6, 7, 8, and 9 to have inputs
  expect(nodesWithInputs).toHaveLength(7)
  expect(nodesWithInputs).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: '3' }),
      expect.objectContaining({ id: '4' }),
      expect.objectContaining({ id: '5' }),
      expect.objectContaining({ id: '6' }),
      expect.objectContaining({ id: '7' }),
      expect.objectContaining({ id: '8' }),
      expect.objectContaining({ id: '9' }),
    ])
  )
})

test('should return the correct output node', () => {
  const outputNode = new ComfyUIWorkflowApiUtils(workflowRaw).getOutputNode()

  expect(outputNode).toEqual({
    id: '9',
    inputs: {
      filename_prefix: 'ComfyUI',
      images: ['8', 0],
    },
    class_type: 'SaveImage',
    _meta: {
      title: 'Save Image',
    },
  })
})

test('should build the correct graph from the workflow', () => {
  const { adjList, dependencyList, inDegree } = new ComfyUIWorkflowApiUtils(
    workflowRaw
  ).getGraphData()

  expect(adjList['3']).toEqual(['8'])
  expect(adjList['8']).toEqual(['9'])
  expect(inDegree['3']).toBe(4)
  expect(dependencyList['3']).toEqual([
    {
      from: '4',
      inputName: 'model',
    },
    {
      from: '6',
      inputName: 'positive',
    },
    { from: '7', inputName: 'negative' },
    { from: '5', inputName: 'latent_image' },
  ])
  expect(inDegree['9']).toBe(1)
})

test('should return the correct inputs by node id', () => {
  const workflow = new ComfyUIWorkflowApiUtils(workflowRaw)

  expect(workflow.getInputsByNodeId('3')).toEqual([
    {
      type: 'number',
      name: 'seed',
      value: 156680208700286,
      key: '3.inputs.seed',
      nodeId: '3',
    },
    {
      type: 'number',
      name: 'steps',
      value: 20,
      key: '3.inputs.steps',
      nodeId: '3',
    },
    { type: 'number', name: 'cfg', value: 8, key: '3.inputs.cfg', nodeId: '3' },
    {
      type: 'string',
      name: 'sampler_name',
      value: 'euler',
      key: '3.inputs.sampler_name',
      nodeId: '3',
    },
    {
      type: 'string',
      name: 'scheduler',
      value: 'normal',
      key: '3.inputs.scheduler',
      nodeId: '3',
    },
    {
      type: 'number',
      name: 'denoise',
      value: 1,
      key: '3.inputs.denoise',
      nodeId: '3',
    },
  ])

  expect(workflow.getInputsByNodeId('4')).toEqual([
    {
      type: 'string',
      name: 'ckpt_name',
      value: 'v1-5-pruned-emaonly.ckpt',
      key: '4.inputs.ckpt_name',
      nodeId: '4',
    },
  ])

  expect(workflow.getInputsByNodeId('5')).toEqual([
    {
      type: 'number',
      name: 'width',
      value: 512,
      key: '5.inputs.width',
      nodeId: '5',
    },
    {
      type: 'number',
      name: 'height',
      value: 512,
      key: '5.inputs.height',
      nodeId: '5',
    },
    {
      type: 'number',
      name: 'batch_size',
      value: 1,
      key: '5.inputs.batch_size',
      nodeId: '5',
    },
  ])

  expect(workflow.getInputsByNodeId('6')).toEqual([
    {
      type: 'string',
      name: 'text',
      value:
        'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
      key: '6.inputs.text',
      nodeId: '6',
    },
  ])

  const nonExistentNodeInputs = workflow.getInputsByNodeId('99')
  expect(nonExistentNodeInputs).toBeNull()
})

test('should detect the correct main inputs', () => {
  const mainInputs = new ComfyUIWorkflowApiUtils(workflowRaw).detectMainInputs()

  expect(mainInputs).toEqual([
    {
      nodeId: '6',
      name: 'text',
      value:
        'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
    },
    { nodeId: '7', name: 'text', value: 'text, watermark' },
  ])

  expect(mainInputs).not.toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'width' }),
      expect.objectContaining({ name: 'cfg' }),
    ])
  )
})

test('should detect the correct positive and negative prompt inputs', () => {
  const workflow = new ComfyUIWorkflowApiUtils(workflowRaw)
  const positivePrompts = workflow.detectPositivePromptInput()
  const negativePrompts = workflow.detectNegativePromptInput()

  expect(positivePrompts).toEqual([
    {
      nodeId: '6',
      name: 'text',
      type: 'positive',
      value:
        'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
    },
  ])

  expect(negativePrompts).toEqual([
    { nodeId: '7', name: 'text', type: 'negative', value: 'text, watermark' },
  ])

  expect(positivePrompts).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'steps' })])
  )
  expect(negativePrompts).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'cfg' })])
  )
})

test('should detect the correct positive and negative prompt inputs using clapper tokens', () => {
  const workflow = new ComfyUIWorkflowApiUtils(workflowRawWithTokens)
  const positivePrompts = workflow.detectPositivePromptInput()
  const negativePrompts = workflow.detectNegativePromptInput()

  expect(positivePrompts).toEqual([
    {
      nodeId: '6',
      type: 'positive',
      name: 'text',
      value: '@clapper/prompt',
    },
  ])

  expect(negativePrompts).toEqual([
    { nodeId: '7', type: 'negative', name: 'text', value: '@clapper/negative' },
  ])

  expect(positivePrompts).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'steps' })])
  )
  expect(negativePrompts).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'cfg' })])
  )
})

test('should create the PromptBuilder', () => {
  const promptBuilder = new ComfyUIWorkflowApiUtils(
    workflowRaw
  ).createPromptBuilder()
  expect(promptBuilder.mapOutputKeys).toEqual({
    output: '9',
  })
  expect(promptBuilder.mapInputKeys).toEqual({
    seed: '3.inputs.seed',
    steps: '3.inputs.steps',
    cfg: '3.inputs.cfg',
    sampler_name: '3.inputs.sampler_name',
    scheduler: '3.inputs.scheduler',
    denoise: '3.inputs.denoise',
    ckpt_name: '4.inputs.ckpt_name',
    width: '5.inputs.width',
    height: '5.inputs.height',
    batch_size: '5.inputs.batch_size',
    text: '7.inputs.text',
    filename_prefix: '9.inputs.filename_prefix',
    positive: '6.inputs.text',
    negative: '7.inputs.text',
  })
  expect(promptBuilder.prompt).toEqual(workflowRaw)
})

/**
 * Error handling
 */

// TODO: More corrupted workflows
const workflowRawWithCycles = {
  a: {
    inputs: {
      text: ['b', 0],
    },
  },
  b: {
    inputs: {
      text: ['a', 0],
    },
  },
}

test('should fail if workflow has cycles', () => {
  expect(() => {
    new ComfyUIWorkflowApiUtils(workflowRawWithCycles)
  }).toThrow(
    'The provided workflow has cycles, impossible to get the output node.'
  )
})
