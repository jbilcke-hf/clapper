import { describe, expect, test, vi } from 'vitest'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  ClapSegmentStatus,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import {
  findHeightInputsFromWorkflow,
  findImageInputsFromWorkflow,
  findNegativePromptInputsFromWorkflow,
  findPromptInputsFromWorkflow,
  findSeedInputsFromWorkflow,
  findWidthInputsFromWorkflow,
  validateComfyUiApiUrl,
} from './utils'
import { ComfyUIWorkflowApiGraph, convertComfyUiGuiToApiFormat } from './graph'
import {
  createPromptBuilder,
  populateComfyUiWorkflow,
} from './createPromptBuilder'
import { ClapperComfyUiInputIds } from './types'
import { convertComfyUiWorkflowApiToClapWorkflow } from './convertComfyUiWorkflowApiToClapWorkflow'
import { getMainInputIdsByClapWorkflowCategory } from './getMainInputIdsByClapWorkflowCategory'
import {
  extractAssetPathsFromComfyUiOutput,
  resolveClapWorkflowForSegment,
  resolveSegment as resolveSegmentComfyUi,
} from './index'
import { resolveSegment as resolveSegmentComfyIcu } from '../comfy-comfyicu'
import { resolveSegment as resolveSegmentComfyDeploy } from '../comfy-comfydeploy'
import { comfyUiToReactWorkflow } from '@/components/editors/WorkflowEditor/WorkflowViewer/ReactFlowCanvas/formats/comfyui/comfyUiToReactWorkflow'
import { clapWorkflowToReactWorkflow } from '@/components/editors/WorkflowEditor/WorkflowViewer/ReactFlowCanvas/clapWorkflowToReactWorkflow'
import { defaultWorkflowForImages } from '@/services/settings/workflows/image'
import { defaultWorkflowForVideos } from '@/services/settings/workflows/video'
import {
  defaultComfyWorkflowForVoiceJson,
  defaultWorkflowForVoice,
} from '@/services/settings/workflows/voice'
import {
  defaultComfyWorkflowForSoundJson,
  defaultWorkflowForSound,
} from '@/services/settings/workflows/sound'
import {
  defaultComfyWorkflowForMusicJson,
  defaultWorkflowForMusic,
} from '@/services/settings/workflows/music'
import { fluxSchnellWorkflowJson } from '@/services/editors/workflow-editor/workflows/comfyui'

const baseTestSettings = {
  comfyUiClientId: 'clapper',
  comfyUiHttpAuthLogin: '',
  comfyUiHttpAuthPassword: '',
  comfyUiApiUrl: 'http://localhost:8188',
  comfyIcuApiKey: '',
  comfyIcuAccelerator: 'L4',
  comfyDeployApiKey: '',
  replicateApiKey: '',
  comfyClapWorkflowForImage: defaultWorkflowForImages,
  comfyClapWorkflowForVideo: defaultWorkflowForVideos,
  comfyWorkflowForVoice: defaultComfyWorkflowForVoiceJson,
  comfyWorkflowForSound: defaultComfyWorkflowForSoundJson,
  comfyWorkflowForMusic: defaultComfyWorkflowForMusicJson,
}

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
  const expectedRaw = structuredClone(workflowRaw)
  const workflow = new ComfyUIWorkflowApiGraph(workflowRaw)
  workflow.setInputValue('3.inputs.seed', 1121)
  expectedRaw['3'].inputs.seed = 1111
  expect(workflow.toJson()).not.toEqual(expectedRaw)
  workflow.setInputValue('3.inputs.seed', 3333)
  expectedRaw['3'].inputs.seed = 3333
  expect(workflow.toJson()).toEqual(expectedRaw)
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

describe('ComfyUIWorkflowApiGraph hardening & output node prioritization', () => {
  test('getOutputNode should be idempotent across multiple invocations', () => {
    const graph = new ComfyUIWorkflowApiGraph(workflowRaw)
    const first = graph.getOutputNode()
    const second = graph.getOutputNode()
    const third = graph.getOutputNode()

    expect(first?.id).toBe('9')
    expect(second).toEqual(first)
    expect(third).toEqual(first)
  })

  test('getOutputNode should prioritize terminal output nodes over trailing Note or unconnected nodes', () => {
    const workflowWithNote = {
      ...structuredClone(workflowRaw),
      '99': {
        inputs: {
          text: 'User note inside workflow',
        },
        class_type: 'Note',
        _meta: {
          title: 'Note',
        },
      },
    }

    const graph = new ComfyUIWorkflowApiGraph(workflowWithNote)
    expect(graph.getOutputNode()?.id).toBe('9')
    expect(graph.getOutputNode()?.class_type).toBe('SaveImage')
  })

  test('should ignore dangling edge references without crashing', () => {
    const workflowWithDanglingEdge = {
      '1': {
        inputs: {
          images: ['999', 0],
          filename_prefix: 'ComfyUI',
        },
        class_type: 'SaveImage',
        _meta: { title: 'Save Image' },
      },
    }

    const graph = new ComfyUIWorkflowApiGraph(workflowWithDanglingEdge)
    expect(graph.getOutputNode()?.id).toBe('1')
  })

  test('should strip prototype pollution keys (__proto__, constructor, prototype)', () => {
    const maliciousJson =
      '{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},"1":{"inputs":{"filename_prefix":"safe","__proto__":{"polluted":true}},"class_type":"SaveImage","_meta":{"title":"Save"}}}'

    const graph = ComfyUIWorkflowApiGraph.fromString(maliciousJson)
    expect(({} as any).polluted).toBeUndefined()
    expect(graph.getOutputNode()?.id).toBe('1')
  })

  test('should enforce maximum JSON size and nesting depth limits', () => {
    const oversizedJson = '{"1": "' + 'x'.repeat(5 * 1024 * 1024 + 10) + '"}'
    expect(() => ComfyUIWorkflowApiGraph.fromString(oversizedJson)).toThrow(
      /exceeds maximum allowed size/
    )

    let deeplyNested: any = { value: 'leaf' }
    for (let i = 0; i < 70; i++) {
      deeplyNested = { child: deeplyNested }
    }
    expect(() =>
      ComfyUIWorkflowApiGraph.fromString(JSON.stringify(deeplyNested))
    ).toThrow(/exceeds maximum nesting depth/)
  })

  test('should extract boolean inputs alongside string and number inputs', () => {
    const graph = ComfyUIWorkflowApiGraph.fromString(
      defaultWorkflowForVideos.data
    )
    const videoCombineInputs = graph.getInputsByNodeId('25')
    expect(videoCombineInputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'save_output',
          type: 'boolean',
          value: true,
        }),
        expect.objectContaining({
          name: 'pingpong',
          type: 'boolean',
          value: false,
        }),
      ])
    )
  })

  test('should convert ComfyUI GUI-format workflows to API format automatically', () => {
    const guiWorkflow = {
      last_node_id: 3,
      last_link_id: 2,
      nodes: [
        {
          id: 1,
          type: 'CheckpointLoaderSimple',
          title: 'Load Checkpoint',
          pos: [50, 100],
          widgets_values: ['sdxl.safetensors'],
          outputs: [{ name: 'MODEL', type: 'MODEL', links: [1] }],
        },
        {
          id: 2,
          type: 'CLIPTextEncode',
          title: 'Positive Prompt',
          pos: [300, 100],
          widgets_values: ['a cinematic sunset'],
          outputs: [{ name: 'CONDITIONING', type: 'CONDITIONING', links: [2] }],
        },
        {
          id: 3,
          type: 'SaveImage',
          title: 'Save Image',
          pos: [600, 100],
          inputs: [{ name: 'images', type: 'IMAGE', link: 2 }],
          widgets_values: ['ComfyUI_Out'],
        },
      ],
      links: [
        [1, 1, 0, 2, 0, 'CLIP'],
        [2, 2, 0, 3, 0, 'IMAGE'],
      ],
    }

    const apiJson = convertComfyUiGuiToApiFormat(guiWorkflow)
    expect(apiJson['1'].inputs?.ckpt_name).toBe('sdxl.safetensors')
    expect(apiJson['2'].inputs?.text).toBe('a cinematic sunset')
    expect(apiJson['3'].inputs?.filename_prefix).toBe('ComfyUI_Out')
    expect(apiJson['3'].inputs?.images).toEqual(['2', 0])

    const graph = ComfyUIWorkflowApiGraph.fromString(
      JSON.stringify(guiWorkflow)
    )
    expect(graph.getOutputNode()?.id).toBe('3')
  })
})

describe('URL validation & SSRF protection (validateComfyUiApiUrl)', () => {
  test('allows valid http and https ComfyUI endpoints', () => {
    expect(validateComfyUiApiUrl('http://localhost:8188/')).toBe(
      'http://localhost:8188'
    )
    expect(validateComfyUiApiUrl('http://127.0.0.1:8188')).toBe(
      'http://127.0.0.1:8188'
    )
    expect(validateComfyUiApiUrl('https://comfy.my-studio.internal:8443')).toBe(
      'https://comfy.my-studio.internal:8443'
    )
  })

  test('rejects non-HTTP protocols, embedded credentials, and cloud metadata SSRF endpoints', () => {
    expect(() => validateComfyUiApiUrl('')).toThrow()
    expect(() => validateComfyUiApiUrl('file:///etc/passwd')).toThrow(
      /Unsupported protocol/
    )
    expect(() => validateComfyUiApiUrl('javascript:alert(1)')).toThrow(
      /Unsupported protocol/
    )
    expect(() =>
      validateComfyUiApiUrl('http://admin:secret@localhost:8188')
    ).toThrow(/Embedded credentials/)
    expect(() =>
      validateComfyUiApiUrl('http://169.254.169.254/latest/meta-data/')
    ).toThrow(/Blocked ComfyUI API URL host/)
    expect(() =>
      validateComfyUiApiUrl('http://metadata.google.internal/computeMetadata')
    ).toThrow(/Blocked ComfyUI API URL host/)
  })
})

describe('Expanded input detection & multi-category workflow conversion', () => {
  test('detects Flux RandomNoise noise_seed and BasicGuider conditioning prompt', () => {
    const fluxGraph = ComfyUIWorkflowApiGraph.fromString(
      fluxSchnellWorkflowJson
    )
    const promptInputs = findPromptInputsFromWorkflow(fluxGraph)
    const seedInputs = findSeedInputsFromWorkflow(fluxGraph)
    const widthInputs = findWidthInputsFromWorkflow(fluxGraph)
    const heightInputs = findHeightInputsFromWorkflow(fluxGraph)

    expect(promptInputs[0]?.id).toBe('6.inputs.text')
    expect(seedInputs[0]?.id).toBe('25.inputs.noise_seed')
    expect(widthInputs[0]?.id).toBe('5.inputs.width')
    expect(heightInputs[0]?.id).toBe('5.inputs.height')
  })

  test('detects LoadImageFromBase64 image input in video workflow', () => {
    const videoGraph = ComfyUIWorkflowApiGraph.fromString(
      defaultWorkflowForVideos.data
    )
    const imageInputs = findImageInputsFromWorkflow(videoGraph)
    expect(imageInputs.map((i) => i.id)).toContain('24.inputs.data')
  })

  test('supports all 5 workflow categories in getMainInputIdsByClapWorkflowCategory and convertComfyUiWorkflowApiToClapWorkflow', () => {
    expect(
      getMainInputIdsByClapWorkflowCategory(
        ClapWorkflowCategory.IMAGE_GENERATION
      )
    ).toContain(ClapperComfyUiInputIds.PROMPT)
    expect(
      getMainInputIdsByClapWorkflowCategory(
        ClapWorkflowCategory.VIDEO_GENERATION
      )
    ).toEqual(
      expect.arrayContaining([
        ClapperComfyUiInputIds.PROMPT,
        ClapperComfyUiInputIds.IMAGE,
        ClapperComfyUiInputIds.OUTPUT,
      ])
    )
    expect(
      getMainInputIdsByClapWorkflowCategory(
        ClapWorkflowCategory.VOICE_GENERATION
      )
    ).toEqual([
      ClapperComfyUiInputIds.PROMPT,
      ClapperComfyUiInputIds.SEED,
      ClapperComfyUiInputIds.OUTPUT,
    ])
    expect(
      getMainInputIdsByClapWorkflowCategory(
        ClapWorkflowCategory.SOUND_GENERATION
      )
    ).toEqual([
      ClapperComfyUiInputIds.PROMPT,
      ClapperComfyUiInputIds.SEED,
      ClapperComfyUiInputIds.OUTPUT,
    ])
    expect(
      getMainInputIdsByClapWorkflowCategory(
        ClapWorkflowCategory.MUSIC_GENERATION
      )
    ).toEqual([
      ClapperComfyUiInputIds.PROMPT,
      ClapperComfyUiInputIds.SEED,
      ClapperComfyUiInputIds.OUTPUT,
    ])

    expect(defaultWorkflowForVoice.category).toBe(
      ClapWorkflowCategory.VOICE_GENERATION
    )
    expect(defaultWorkflowForSound.category).toBe(
      ClapWorkflowCategory.SOUND_GENERATION
    )
    expect(defaultWorkflowForMusic.category).toBe(
      ClapWorkflowCategory.MUSIC_GENERATION
    )
  })
})

describe('populateComfyUiWorkflow (immutable PromptBuilder.input() fix & multi-modal injection)', () => {
  const basePrompts = {
    image: {
      positive: 'masterpiece cyberpunk street in rain',
      negative: 'blurry, lowres, watermark',
      identity: '',
    },
    video: {
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
      voice: '',
    },
    voice: {
      identity: '',
      positive: 'Welcome to the future of cinema.',
      negative: '',
    },
    audio: {
      positive: 'heavy thunder and rain sound effect',
      negative: 'speech, music',
    },
    music: {
      positive: 'synthwave analog bassline 110 bpm',
      negative: 'vocals, noise',
    },
  }

  test('injects positive prompt, negative prompt, width, height, seed, and node setting overrides into IMAGE workflow', () => {
    const customImageWorkflow = structuredClone(defaultWorkflowForImages)
    customImageWorkflow.inputValues['3.inputs.steps'] = 15
    customImageWorkflow.inputValues['3.inputs.cfg'] = 4.5

    const { promptBuilder, workflowJson, outputNodeId } =
      populateComfyUiWorkflow({
        clapWorkflow: customImageWorkflow,
        prompts: basePrompts,
        segment: {
          category: ClapSegmentCategory.IMAGE,
          prompt: 'fallback prompt',
        } as any,
        meta: { width: 1280, height: 720 } as any,
        seed: 987654321,
      })

    expect(outputNodeId).toBe('9')
    expect((workflowJson['6'].inputs as any).text).toBe(
      'masterpiece cyberpunk street in rain'
    )
    expect((workflowJson['7'].inputs as any).text).toBe(
      'blurry, lowres, watermark'
    )
    expect((workflowJson['5'].inputs as any).width).toBe(1280)
    expect((workflowJson['5'].inputs as any).height).toBe(720)
    expect((workflowJson['3'].inputs as any).seed).toBe(987654321)
    expect((workflowJson['3'].inputs as any).steps).toBe(15)
    expect((workflowJson['3'].inputs as any).cfg).toBe(4.5)

    // Verify PromptBuilder.prompt also received the mutations
    expect(promptBuilder.prompt['6'].inputs.text).toBe(
      'masterpiece cyberpunk street in rain'
    )
    expect(promptBuilder.prompt['5'].inputs.width).toBe(1280)
    expect(promptBuilder.prompt['3'].inputs.seed).toBe(987654321)
  })

  test('injects base64 image data, dimensions, and seed into VIDEO workflow', () => {
    const { workflowJson, outputNodeId } = populateComfyUiWorkflow({
      clapWorkflow: defaultWorkflowForVideos,
      prompts: basePrompts,
      segment: {
        category: ClapSegmentCategory.VIDEO,
        prompt: 'camera pans slowly',
      } as any,
      meta: { width: 1024, height: 576 } as any,
      seed: 123456,
    })

    expect(outputNodeId).toBe('25')
    expect((workflowJson['24'].inputs as any).data).toBe(
      'iVBORw0KGgoAAAANSUhEUgAAAAUA'
    )
    expect((workflowJson['12'].inputs as any).width).toBe(1024)
    expect((workflowJson['12'].inputs as any).height).toBe(576)
    expect((workflowJson['3'].inputs as any).seed).toBe(123456)
  })

  test('injects voice, sound, and music prompts into DIALOGUE, SOUND, and MUSIC workflows', () => {
    const voicePopulated = populateComfyUiWorkflow({
      clapWorkflow: defaultWorkflowForVoice,
      prompts: basePrompts,
      segment: {
        category: ClapSegmentCategory.DIALOGUE,
        prompt: 'Welcome to the future of cinema.',
      } as any,
      seed: 111,
    })
    expect((voicePopulated.workflowJson['1'].inputs as any).text).toBe(
      'Welcome to the future of cinema.'
    )
    expect((voicePopulated.workflowJson['1'].inputs as any).seed).toBe(111)
    expect(voicePopulated.outputNodeId).toBe('2')

    const soundPopulated = populateComfyUiWorkflow({
      clapWorkflow: defaultWorkflowForSound,
      prompts: basePrompts,
      segment: {
        category: ClapSegmentCategory.SOUND,
        prompt: 'heavy thunder and rain sound effect',
      } as any,
      seed: 222,
    })
    expect((soundPopulated.workflowJson['2'].inputs as any).text).toBe(
      'heavy thunder and rain sound effect'
    )
    expect((soundPopulated.workflowJson['5'].inputs as any).seed).toBe(222)
    expect(soundPopulated.outputNodeId).toBe('7')

    const musicPopulated = populateComfyUiWorkflow({
      clapWorkflow: defaultWorkflowForMusic,
      prompts: basePrompts,
      segment: {
        category: ClapSegmentCategory.MUSIC,
        prompt: 'synthwave analog bassline 110 bpm',
      } as any,
      seed: 333,
    })
    expect((musicPopulated.workflowJson['2'].inputs as any).text).toBe(
      'synthwave analog bassline 110 bpm'
    )
    expect((musicPopulated.workflowJson['5'].inputs as any).seed).toBe(333)
    expect(musicPopulated.outputNodeId).toBe('7')
  })
})

describe('End-to-end provider resolution & ReactFlow conversion', () => {
  test('extractAssetPathsFromComfyUiOutput extracts images, videos, gifs, and audio URLs', () => {
    const imgPaths = extractAssetPathsFromComfyUiOutput({
      rawOutput: {
        [ClapperComfyUiInputIds.OUTPUT]: {
          images: [
            { filename: 'shot_01.png', subfolder: 'renders', type: 'output' },
          ],
        },
      },
      outputNodeId: '9',
      category: ClapWorkflowCategory.IMAGE_GENERATION,
      baseUrl: 'http://localhost:8188',
    })
    expect(imgPaths).toEqual([
      'http://localhost:8188/view?filename=shot_01.png&subfolder=renders&type=output',
    ])

    const audioPaths = extractAssetPathsFromComfyUiOutput({
      rawOutput: {
        [ClapperComfyUiInputIds.OUTPUT]: {
          audio: [{ filename: 'voice_01.mp3', subfolder: '', type: 'output' }],
        },
      },
      outputNodeId: '2',
      category: ClapWorkflowCategory.VOICE_GENERATION,
      baseUrl: 'http://localhost:8188',
    })
    expect(audioPaths).toEqual([
      'http://localhost:8188/view?filename=voice_01.mp3&subfolder=&type=output',
    ])
  })

  test('resolveSegment (ComfyUI local HTTP fallback) resolves DIALOGUE/Voice segment', async () => {
    const defaultSettings = baseTestSettings
    let submittedBody: any = null

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (input: any, init?: any) => {
        const url = String(input)
        if (url.endsWith('/prompt')) {
          submittedBody = JSON.parse(init.body)
          return new Response(JSON.stringify({ prompt_id: 'prompt-voice-1' }), {
            status: 200,
          })
        }
        if (url.includes('/history/prompt-voice-1')) {
          return new Response(
            JSON.stringify({
              'prompt-voice-1': {
                status: { status_str: 'success' },
                outputs: {
                  '2': {
                    audio: ['data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAP'],
                  },
                },
              },
            }),
            { status: 200 }
          )
        }
        return new Response('Not found', { status: 404 })
      })

    try {
      const request: any = {
        settings: {
          ...defaultSettings,
          comfyUiClientId: 'clapper-test',
          comfyUiApiUrl: 'http://localhost:8188',
          voiceGenerationWorkflow: defaultWorkflowForVoice,
        },
        segment: {
          id: 'seg-voice-1',
          category: ClapSegmentCategory.DIALOGUE,
          prompt: 'Hello from Clapper!',
          status: ClapSegmentStatus.TO_GENERATE,
        },
        prompts: {
          image: { positive: '', negative: '', identity: '' },
          video: { image: '', voice: '' },
          voice: {
            positive: 'Hello from Clapper!',
            negative: '',
            identity: '',
          },
          audio: { positive: '', negative: '' },
          music: { positive: '', negative: '' },
        },
        meta: { width: 1024, height: 576 },
      }

      const resolved = await resolveSegmentComfyUi(request)
      expect(submittedBody.prompt['1'].inputs.text).toBe('Hello from Clapper!')
      expect(resolved.assetUrl).toBe(
        'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAP'
      )
      expect(resolved.assetSourceType).toBe(ClapAssetSource.DATA)
    } finally {
      fetchSpy.mockRestore()
    }
  })

  test('resolveSegment (Comfy.icu) injects workflow parameters, polls status, and extracts output URL', async () => {
    const defaultSettings = baseTestSettings
    let postedPayload: any = null

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (input: any, init?: any) => {
        const url = String(input)
        if (
          url === 'https://comfy.icu/api/v1/workflows/wf-123/runs' &&
          init?.method === 'POST'
        ) {
          postedPayload = JSON.parse(init.body)
          return new Response(
            JSON.stringify({ id: 'run-456', status: 'IN_PROGRESS' }),
            { status: 200 }
          )
        }
        if (url === 'https://comfy.icu/api/v1/workflows/wf-123/runs/run-456') {
          return new Response(
            JSON.stringify({
              id: 'run-456',
              status: 'COMPLETED',
              output: [
                {
                  filename: 'out.png',
                  url: 'https://cdn.comfy.icu/runs/run-456/out.png',
                },
              ],
            }),
            { status: 200 }
          )
        }
        return new Response('Not found', { status: 404 })
      })

    try {
      const request: any = {
        settings: {
          ...defaultSettings,
          comfyIcuApiKey: 'icu-test-key',
          imageGenerationWorkflow: {
            ...defaultWorkflowForImages,
            id: 'comfyicu://wf-123',
            provider: ClapWorkflowProvider.COMFYICU,
          },
        },
        segment: {
          id: 'seg-img-1',
          category: ClapSegmentCategory.IMAGE,
          prompt: 'neon samurai in Tokyo',
          status: ClapSegmentStatus.TO_GENERATE,
        },
        prompts: {
          image: {
            positive: 'neon samurai in Tokyo',
            negative: 'watermark',
            identity: '',
          },
          video: { image: '', voice: '' },
          voice: { positive: '', negative: '', identity: '' },
          audio: { positive: '', negative: '' },
          music: { positive: '', negative: '' },
        },
        meta: { width: 1024, height: 576 },
      }

      const resolved = await resolveSegmentComfyIcu(request)
      expect(postedPayload.workflow_id).toBe('wf-123')
      expect(postedPayload.prompt['6'].inputs.text).toBe(
        'neon samurai in Tokyo'
      )
      expect(resolved.assetUrl).toBe(
        'https://cdn.comfy.icu/runs/run-456/out.png'
      )
      expect(resolved.status).toBe(ClapSegmentStatus.COMPLETED)
    } finally {
      fetchSpy.mockRestore()
    }
  })

  test('resolveSegment (ComfyDeploy) submits workflow, polls run_id, and extracts output URL', async () => {
    const defaultSettings = baseTestSettings
    let postedPayload: any = null

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (input: any, init?: any) => {
        const url = String(input)
        if (
          url === 'https://api.comfydeploy.com/api/run' &&
          init?.method === 'POST'
        ) {
          postedPayload = JSON.parse(init.body)
          return new Response(
            JSON.stringify({ run_id: 'cd-run-1', status: 'running' }),
            { status: 200 }
          )
        }
        if (url === 'https://api.comfydeploy.com/api/run?run_id=cd-run-1') {
          return new Response(
            JSON.stringify({
              run_id: 'cd-run-1',
              status: 'success',
              outputs: [
                {
                  data: {
                    images: [
                      {
                        url: 'https://cdn.comfydeploy.com/cd-run-1/render.png',
                      },
                    ],
                  },
                },
              ],
            }),
            { status: 200 }
          )
        }
        return new Response('Not found', { status: 404 })
      })

    try {
      const request: any = {
        settings: {
          ...defaultSettings,
          comfyDeployApiKey: 'cd-test-key',
          imageGenerationWorkflow: {
            ...defaultWorkflowForImages,
            id: 'comfydeploy://dep-789',
            provider: ClapWorkflowProvider.COMFYDEPLOY,
          },
        },
        segment: {
          id: 'seg-cd-1',
          category: ClapSegmentCategory.IMAGE,
          prompt: 'spaceship landing on Mars',
          status: ClapSegmentStatus.TO_GENERATE,
        },
        prompts: {
          image: {
            positive: 'spaceship landing on Mars',
            negative: 'blurry',
            identity: '',
          },
          video: { image: '', voice: '' },
          voice: { positive: '', negative: '', identity: '' },
          audio: { positive: '', negative: '' },
          music: { positive: '', negative: '' },
        },
        meta: { width: 1024, height: 576 },
      }

      const resolved = await resolveSegmentComfyDeploy(request)
      expect(postedPayload.deployment_id).toBe('dep-789')
      expect(postedPayload.workflow_api['6'].inputs.text).toBe(
        'spaceship landing on Mars'
      )
      expect(resolved.assetUrl).toBe(
        'https://cdn.comfydeploy.com/cd-run-1/render.png'
      )
      expect(resolved.status).toBe(ClapSegmentStatus.COMPLETED)
    } finally {
      fetchSpy.mockRestore()
    }
  })

  test('comfyUiToReactWorkflow and clapWorkflowToReactWorkflow convert API and GUI workflows to ReactFlow nodes and edges', () => {
    const reactWorkflow = clapWorkflowToReactWorkflow(defaultWorkflowForImages)
    expect(reactWorkflow.nodes).toHaveLength(7)
    expect(reactWorkflow.edges.length).toBeGreaterThanOrEqual(8)
    expect(reactWorkflow.nodes.map((n) => n.data?.classType)).toEqual(
      expect.arrayContaining([
        'KSampler',
        'CLIPTextEncode',
        'EmptyLatentImage',
        'SaveImage',
      ])
    )

    const guiReactWorkflow = comfyUiToReactWorkflow({
      nodes: [
        { id: 10, type: 'CLIPTextEncode', title: 'Prompt', pos: [100, 200] },
        { id: 20, type: 'SaveImage', title: 'Save', pos: [400, 200] },
      ],
      links: [[1, 10, 0, 20, 0, 'IMAGE']],
    } as any)
    expect(guiReactWorkflow.nodes).toHaveLength(2)
    expect(guiReactWorkflow.edges).toHaveLength(1)
    expect(guiReactWorkflow.edges[0]).toMatchObject({
      source: '10',
      target: '20',
    })
  })

  test('resolveClapWorkflowForSegment resolves fallback settings for IMAGE, VIDEO, DIALOGUE, SOUND, and MUSIC', () => {
    const categories: [ClapSegmentCategory, ClapWorkflowCategory][] = [
      [ClapSegmentCategory.IMAGE, ClapWorkflowCategory.IMAGE_GENERATION],
      [ClapSegmentCategory.VIDEO, ClapWorkflowCategory.VIDEO_GENERATION],
      [ClapSegmentCategory.DIALOGUE, ClapWorkflowCategory.VOICE_GENERATION],
      [ClapSegmentCategory.SOUND, ClapWorkflowCategory.SOUND_GENERATION],
      [ClapSegmentCategory.MUSIC, ClapWorkflowCategory.MUSIC_GENERATION],
    ]

    for (const [segCat, expectedWfCat] of categories) {
      const wf = resolveClapWorkflowForSegment({
        settings: baseTestSettings as any,
        segment: { category: segCat } as any,
      } as any)
      expect(wf.category).toBe(expectedWfCat)
      expect(wf.engine).toBe(ClapWorkflowEngine.COMFYUI_WORKFLOW)
      expect(wf.inputValues[ClapperComfyUiInputIds.OUTPUT]).toBeDefined()
    }

    expect(() =>
      resolveClapWorkflowForSegment({
        settings: baseTestSettings as any,
        segment: { category: ClapSegmentCategory.CAMERA } as any,
      } as any)
    ).toThrow(/doesn't support/)
  })
})
