import { expect, test } from 'vitest'
import { createPromptBuilder } from './createPromptBuilder'

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
  const nodesWithInputs = new ComfyUIWorkflowApiGraph(
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
  const outputNode = new ComfyUIWorkflowApiGraph(workflowRaw).getOutputNode()

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
  const { adjList, dependencyList, inDegree } = new ComfyUIWorkflowApiGraph(
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
  const workflow = new ComfyUIWorkflowApiGraph(workflowRaw)

  expect(workflow.getInputsByNodeId('3')).toEqual([
    {
      type: 'number',
      name: 'seed',
      value: 156680208700286,
      id: '3.inputs.seed',
      node: {
        id: '3',
        name: 'KSampler',
        type: 'KSampler',
      },
    },
    {
      type: 'number',
      name: 'steps',
      value: 20,
      id: '3.inputs.steps',
      node: {
        id: '3',
        name: 'KSampler',
        type: 'KSampler',
      },
    },
    {
      type: 'number',
      name: 'cfg',
      value: 8,
      id: '3.inputs.cfg',
      node: {
        id: '3',
        name: 'KSampler',
        type: 'KSampler',
      },
    },
    {
      type: 'string',
      name: 'sampler_name',
      value: 'euler',
      id: '3.inputs.sampler_name',
      node: {
        id: '3',
        name: 'KSampler',
        type: 'KSampler',
      },
    },
    {
      type: 'string',
      name: 'scheduler',
      value: 'normal',
      id: '3.inputs.scheduler',
      node: {
        id: '3',
        name: 'KSampler',
        type: 'KSampler',
      },
    },
    {
      type: 'number',
      name: 'denoise',
      value: 1,
      id: '3.inputs.denoise',
      node: {
        id: '3',
        name: 'KSampler',
        type: 'KSampler',
      },
    },
  ])

  expect(workflow.getInputsByNodeId('4')).toEqual([
    {
      type: 'string',
      name: 'ckpt_name',
      value: 'v1-5-pruned-emaonly.ckpt',
      id: '4.inputs.ckpt_name',
      node: {
        id: '4',
        name: 'Load Checkpoint',
        type: 'CheckpointLoaderSimple',
      },
    },
  ])

  expect(workflow.getInputsByNodeId('5')).toEqual([
    {
      type: 'number',
      name: 'width',
      value: 512,
      id: '5.inputs.width',
      node: {
        id: '5',
        name: 'Empty Latent Image',
        type: 'EmptyLatentImage',
      },
    },
    {
      type: 'number',
      name: 'height',
      value: 512,
      id: '5.inputs.height',
      node: {
        id: '5',
        name: 'Empty Latent Image',
        type: 'EmptyLatentImage',
      },
    },
    {
      type: 'number',
      name: 'batch_size',
      value: 1,
      id: '5.inputs.batch_size',
      node: {
        id: '5',
        name: 'Empty Latent Image',
        type: 'EmptyLatentImage',
      },
    },
  ])

  expect(workflow.getInputsByNodeId('6')).toEqual([
    {
      type: 'string',
      name: 'text',
      value:
        'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
      id: '6.inputs.text',
      node: {
        id: '6',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
    },
  ])

  const nonExistentNodeInputs = workflow.getInputsByNodeId('99')
  expect(nonExistentNodeInputs).toBeNull()
})

test('should detect the correct positive and negative prompt inputs', () => {
  const workflow = new ComfyUIWorkflowApiGraph(workflowRaw)
  const positivePromptInput = findPromptInputsFromWorkflow(workflow)
  const negativePromptInput = findNegativePromptInputsFromWorkflow(workflow)

  expect(positivePromptInput).toEqual([
    {
      id: '6.inputs.text',
      node: {
        id: '6',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
      name: 'text',
      type: 'string',
      value:
        'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
    },
  ])

  expect(negativePromptInput).toEqual([
    {
      id: '7.inputs.text',
      node: {
        id: '7',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
      name: 'text',
      type: 'string',
      value: 'text, watermark',
    },
  ])

  expect(positivePromptInput).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'steps' })])
  )

  expect(negativePromptInput).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'cfg' })])
  )
})

test('should detect the correct positive and negative prompt inputs using clapper tokens', () => {
  const workflow = new ComfyUIWorkflowApiGraph(workflowRawWithTokens)
  const positivePromptInput = findPromptInputsFromWorkflow(workflow)
  const negativePromptInput = findNegativePromptInputsFromWorkflow(workflow)

  expect(positivePromptInput).toEqual([
    {
      id: '6.inputs.text',
      node: {
        id: '6',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
      type: 'string',
      name: 'text',
      value: '@clapper/prompt',
    },
  ])

  expect(negativePromptInput).toEqual([
    {
      id: '7.inputs.text',
      node: {
        id: '7',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
      type: 'string',
      name: 'text',
      value: '@clapper/negative',
    },
  ])

  expect(positivePromptInput).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'steps' })])
  )
  expect(negativePromptInput).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'cfg' })])
  )
})

test('should correctly search workflow inputs', () => {
  const workflow = new ComfyUIWorkflowApiGraph(workflowRaw)
  expect(
    workflow.findInput({
      name: 'text',
    })
  ).toEqual([
    {
      id: '6.inputs.text',
      node: {
        id: '6',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
      name: 'text',
      type: 'string',
      value:
        'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
    },
    {
      id: '7.inputs.text',
      node: {
        id: '7',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
      name: 'text',
      type: 'string',
      value: 'text, watermark',
    },
  ])
  expect(
    workflow.findInput({
      name: 'text',
      type: 'string',
      nodeOutputToNodeInput: 'positive',
    })
  ).toEqual([
    {
      id: '6.inputs.text',
      node: {
        id: '6',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
      name: 'text',
      type: 'string',
      value:
        'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
    },
  ])
  expect(
    workflow.findInput({
      name: /tex.*/,
      type: /str.*/,
      nodeOutputToNodeInput: /posi.*/,
    })
  ).toEqual([
    {
      id: '6.inputs.text',
      node: {
        id: '6',
        name: 'CLIP Text Encode (Prompt)',
        type: 'CLIPTextEncode',
      },
      name: 'text',
      type: 'string',
      value:
        'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
    },
  ])
})

test('should create the PromptBuilder', () => {
  const promptBuilder = createPromptBuilder(
    new ComfyUIWorkflowApiGraph(workflowRaw)
  )
  expect(promptBuilder.mapOutputKeys).toEqual({
    [ClapperComfyUiInputIds.OUTPUT]: '9',
  })
  expect(promptBuilder.mapInputKeys).toEqual({
    '3.inputs.seed': '3.inputs.seed',
    '3.inputs.steps': '3.inputs.steps',
    '3.inputs.cfg': '3.inputs.cfg',
    '3.inputs.sampler_name': '3.inputs.sampler_name',
    '3.inputs.scheduler': '3.inputs.scheduler',
    '3.inputs.denoise': '3.inputs.denoise',
    '4.inputs.ckpt_name': '4.inputs.ckpt_name',
    '5.inputs.width': '5.inputs.width',
    '5.inputs.height': '5.inputs.height',
    '5.inputs.batch_size': '5.inputs.batch_size',
    '7.inputs.text': '7.inputs.text',
    '9.inputs.filename_prefix': '9.inputs.filename_prefix',
    '6.inputs.text': '6.inputs.text',
    [ClapperComfyUiInputIds.PROMPT]: ClapperComfyUiInputIds.PROMPT,
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT]:
      ClapperComfyUiInputIds.NEGATIVE_PROMPT,
    [ClapperComfyUiInputIds.WIDTH]: ClapperComfyUiInputIds.WIDTH,
    [ClapperComfyUiInputIds.HEIGHT]: ClapperComfyUiInputIds.HEIGHT,
    [ClapperComfyUiInputIds.SEED]: ClapperComfyUiInputIds.SEED,
  })
  expect(promptBuilder.prompt).toEqual(workflowRaw)
})

test('should convert correctly the workflow to string', () => {
  const workflow = new ComfyUIWorkflowApiGraph(workflowRaw)
  expect(workflow.toJson()).toEqual(workflowRaw)
})

test('should edit correctly an input of the workflow', () => {
  const workflow = new ComfyUIWorkflowApiGraph(workflowRaw)
  workflow.setInputValue('3.inputs.seed', 1121)
  workflowRaw['3'].inputs.seed = 1111
  expect(workflow.toJson()).not.toEqual(workflowRaw)
  workflow.setInputValue('3.inputs.seed', 3333)
  workflowRaw['3'].inputs.seed = 3333
  expect(workflow.toJson()).toEqual(workflowRaw)
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
    new ComfyUIWorkflowApiGraph(workflowRawWithCycles)
  }).toThrow(
    'The provided workflow has cycles, impossible to get the output node.'
  )
})
