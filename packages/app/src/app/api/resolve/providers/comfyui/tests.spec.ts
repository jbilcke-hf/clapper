import { afterEach, expect, test, vi } from 'vitest'
import {
  findNegativePromptInputsFromWorkflow,
  findPromptInputsFromWorkflow,
} from './utils'
import { ComfyUIWorkflowApiGraph } from './graph'
import { createPromptBuilder } from './createPromptBuilder'
import { ClapperComfyUiInputIds } from './types'
import {
  configureComfyWorkflow,
  getComfyOutputAssetPaths,
  getComfyWorkflowCategoryForSegment,
} from './runtime'
import {
  ClapSegmentCategory,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { resolveSegment as resolveComfyIcuSegment } from '../comfy-comfyicu'
import { resolveSegment as resolveComfyDeploySegment } from '../comfy-comfydeploy'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

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

test('should return the same output node across repeated reads', () => {
  const workflow = new ComfyUIWorkflowApiGraph(workflowRaw)

  expect(workflow.getOutputNode()?.id).toBe('9')
  expect(workflow.getOutputNode()?.id).toBe('9')
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

test('should map ComfyUI segment categories to workflow categories', () => {
  expect(getComfyWorkflowCategoryForSegment(ClapSegmentCategory.IMAGE)).toBe(
    ClapWorkflowCategory.IMAGE_GENERATION
  )
  expect(getComfyWorkflowCategoryForSegment(ClapSegmentCategory.VIDEO)).toBe(
    ClapWorkflowCategory.VIDEO_GENERATION
  )
  expect(getComfyWorkflowCategoryForSegment(ClapSegmentCategory.SOUND)).toBe(
    ClapWorkflowCategory.SOUND_GENERATION
  )
  expect(getComfyWorkflowCategoryForSegment(ClapSegmentCategory.MUSIC)).toBe(
    ClapWorkflowCategory.MUSIC_GENERATION
  )
  expect(getComfyWorkflowCategoryForSegment(ClapSegmentCategory.DIALOGUE)).toBe(
    ClapWorkflowCategory.VOICE_GENERATION
  )
})

test('should inject category-specific audio prompts into ComfyUI workflows', () => {
  const audioWorkflow = {
    '1': {
      inputs: {
        prompt: 'old prompt',
        negative_prompt: 'old negative',
        seed: 1,
      },
      class_type: 'AudioPrompt',
      _meta: {
        title: 'Audio Prompt',
      },
    },
    '2': {
      inputs: {
        audio: ['1', 0],
        filename_prefix: 'Clapper',
      },
      class_type: 'SaveAudio',
      _meta: {
        title: 'Save Audio',
      },
    },
  }

  const configured = configureComfyWorkflow({
    segment: {
      category: ClapSegmentCategory.SOUND,
      prompt: 'fallback sound prompt',
    },
    meta: {},
    prompts: {
      image: { positive: '', negative: '', identity: '' },
      video: { image: '', voice: '' },
      voice: { positive: '', negative: '', identity: '' },
      audio: {
        positive: 'waves in a cave',
        negative: 'distortion',
      },
      music: { positive: '', negative: '' },
    },
    settings: {
      soundGenerationWorkflow: {
        id: 'comfyui://settings.comfyWorkflowForSound',
        label: 'Custom Sound Workflow',
        description: '',
        tags: [],
        author: '',
        thumbnailUrl: '',
        nonCommercial: false,
        engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
        provider: ClapWorkflowProvider.COMFYUI,
        category: ClapWorkflowCategory.SOUND_GENERATION,
        data: JSON.stringify(audioWorkflow),
        schema: '',
        inputFields: [],
        inputValues: {},
      },
    },
  } as any)

  const workflowJson = configured.workflowGraph.toJson()

  expect(workflowJson['1'].inputs.prompt).toBe('waves in a cave')
  expect(workflowJson['1'].inputs.negative_prompt).toBe('distortion')
  expect(typeof workflowJson['1'].inputs.seed).toBe('number')
  expect(configured.outputNodeId).toBe('2')
})

test('should extract image, video, audio, and generic file outputs', () => {
  const outputPaths = getComfyOutputAssetPaths(
    {
      '@clapper/output': {
        images: [{ filename: 'image.png', subfolder: '', type: 'output' }],
        videos: [{ filename: 'clip.mp4', subfolder: '', type: 'output' }],
        audio: [{ filename: 'voice.wav', subfolder: '', type: 'output' }],
        files: [{ url: 'https://example.com/result.bin' }],
      },
    },
    {
      toLocalPath: (asset) => `/view/${asset.filename}`,
    }
  )

  expect(outputPaths).toEqual([
    '/view/image.png',
    '/view/clip.mp4',
    '/view/voice.wav',
    'https://example.com/result.bin',
  ])
})

test('should surface invalid workflow data with ComfyUI context', () => {
  expect(() =>
    configureComfyWorkflow(
      createImageResolveRequest({
        imageGenerationWorkflow: createComfyWorkflow({
          data: '{invalid json',
        }),
      })
    )
  ).toThrow(/Invalid ComfyUI workflow data/)
})

test('should submit and poll Comfy.icu runs with a configured prompt', async () => {
  vi.useFakeTimers()

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      jsonResponse({
        run_id: 'run-1',
        status: 'queued',
      })
    )
    .mockResolvedValueOnce(
      jsonResponse({
        id: 'run-1',
        status: 'completed',
        output: [
          {
            filename: 'result.png',
            url: 'https://cdn.example.com/result.png',
            thumbnail_url: 'https://cdn.example.com/result-thumb.png',
          },
        ],
      })
    )
  vi.stubGlobal('fetch', fetchMock)

  const segmentPromise = resolveComfyIcuSegment(
    createImageResolveRequest({
      comfyIcuApiKey: 'test-api-key',
      imageGenerationWorkflow: createComfyWorkflow({
        id: 'comfyicu://workflow-1',
      }),
    })
  )

  await Promise.resolve()
  await Promise.resolve()
  await vi.runOnlyPendingTimersAsync()

  await expect(segmentPromise).resolves.toMatchObject({
    assetUrl: 'https://cdn.example.com/result.png',
  })

  expect(fetchMock).toHaveBeenCalledTimes(2)
  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    'https://comfy.icu/api/v1/workflows/workflow-1/runs',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        authorization: 'Bearer test-api-key',
      }),
    })
  )
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    'https://comfy.icu/api/v1/workflows/workflow-1/runs/run-1',
    expect.objectContaining({
      method: 'GET',
    })
  )

  const body = JSON.parse(fetchMock.mock.calls[0][1].body)
  const prompt = JSON.parse(body.prompt)
  expect(prompt['6'].inputs.text).toBe('a neon lighthouse')
  expect(prompt['7'].inputs.text).toBe('low quality')
})

test('should submit and poll ComfyDeploy runs with mapped inputs', async () => {
  vi.useFakeTimers()

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      jsonResponse({
        run_id: 'run-1',
        live_status: 'queued',
      })
    )
    .mockResolvedValueOnce(
      jsonResponse({
        run_id: 'run-1',
        live_status: 'success',
        outputs: [
          {
            url: 'https://cdn.example.com/deploy-result.mp4',
          },
        ],
      })
    )
  vi.stubGlobal('fetch', fetchMock)

  const segmentPromise = resolveComfyDeploySegment(
    createImageResolveRequest({
      comfyDeployApiKey: 'deploy-api-key',
      imageGenerationWorkflow: createComfyWorkflow({
        id: 'comfydeploy://deployment-1',
        inputValues: {
          style: 'cinematic',
        },
      }),
    })
  )

  await Promise.resolve()
  await Promise.resolve()
  await vi.runOnlyPendingTimersAsync()

  await expect(segmentPromise).resolves.toMatchObject({
    assetUrl: 'https://cdn.example.com/deploy-result.mp4',
  })

  expect(fetchMock).toHaveBeenCalledTimes(2)
  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    'https://api.comfydeploy.com/api/run/deployment/queue',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        authorization: 'Bearer deploy-api-key',
      }),
    })
  )
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    'https://api.comfydeploy.com/api/run/run-1',
    expect.objectContaining({
      method: 'GET',
    })
  )

  const body = JSON.parse(fetchMock.mock.calls[0][1].body)
  expect(body).toEqual({
    deployment_id: 'deployment-1',
    inputs: expect.objectContaining({
      prompt: 'a neon lighthouse',
      negative_prompt: 'low quality',
      width: 640,
      height: 360,
      seed: expect.any(Number),
      style: 'cinematic',
    }),
  })
})

function createImageResolveRequest(settings: Record<string, any> = {}) {
  return {
    segment: {
      category: ClapSegmentCategory.IMAGE,
      prompt: 'fallback prompt',
    },
    meta: {
      width: 640,
      height: 360,
    },
    prompts: {
      image: {
        positive: 'a neon lighthouse',
        negative: 'low quality',
        identity: '',
      },
      video: {
        image: '',
        voice: '',
      },
      voice: {
        positive: '',
        negative: '',
        identity: '',
      },
      audio: {
        positive: '',
        negative: '',
      },
      music: {
        positive: '',
        negative: '',
      },
    },
    settings: {
      imageGenerationWorkflow: createComfyWorkflow(),
      ...settings,
    },
  } as any
}

function createComfyWorkflow(overrides: Record<string, any> = {}) {
  return {
    id: 'comfyui://settings.comfyWorkflowForImage',
    label: 'Custom Image Workflow',
    description: '',
    tags: [],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
    provider: ClapWorkflowProvider.COMFYUI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: JSON.stringify(workflowRaw),
    schema: '',
    inputFields: [],
    inputValues: {},
    ...overrides,
  }
}

function jsonResponse(json: unknown, ok = true) {
  return {
    ok,
    json: async () => json,
  } as Response
}
