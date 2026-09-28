import { beforeEach, expect, it, vi } from 'vitest'
import {
  ClapSegmentCategory as Segment,
  ClapWorkflowCategory as Category,
} from '@aitube/clap'
import type { ResolveRequest } from '@aitube/clapper-services'
import { convertComfyUiWorkflowApiToClapWorkflow } from './convertComfyUiWorkflowApiToClapWorkflow'
import { resolveSegment } from './index'
import { runWorkflow } from './runWorkflow'
vi.mock('./runWorkflow', () => ({
  runWorkflow: vi.fn(async () => 'data:audio/wav;base64,eA=='),
}))
const graph = {
  '1': { class_type: 'Text', inputs: { text: 'original' } },
  '2': { class_type: 'SaveAudio', inputs: { audio: ['1', 0] } },
}
beforeEach(() => {
  vi.clearAllMocks()
})
it.each([
  [
    Segment.IMAGE,
    Category.IMAGE_GENERATION,
    'imageGenerationWorkflow',
    'image',
    'image prompt',
  ],
  [
    Segment.VIDEO,
    Category.VIDEO_GENERATION,
    'videoGenerationWorkflow',
    'video',
    'image prompt',
  ],
  [
    Segment.DIALOGUE,
    Category.VOICE_GENERATION,
    'voiceGenerationWorkflow',
    'audio',
    'spoken words',
  ],
  [
    Segment.SOUND,
    Category.SOUND_GENERATION,
    'soundGenerationWorkflow',
    'audio',
    'sound prompt',
  ],
  [
    Segment.MUSIC,
    Category.MUSIC_GENERATION,
    'musicGenerationWorkflow',
    'audio',
    'music prompt',
  ],
] as const)(
  'routes %s through its workflow and prompt',
  async (category, workflowCategory, setting, kind, prompt) => {
    const workflow = convertComfyUiWorkflowApiToClapWorkflow(
      JSON.stringify(graph),
      workflowCategory
    )
    const request = {
      settings: {
        [setting]: workflow,
        comfyUiApiUrl: 'http://localhost:8188',
        comfyUiClientId: 'client',
      },
      segment: { id: 'segment', category },
      meta: { width: 512, height: 512 },
      prompts: {
        image: { positive: 'image prompt', negative: '' },
        video: { image: '' },
        voice: { positive: 'spoken words', negative: '' },
        audio: { positive: 'sound prompt', negative: '' },
        music: { positive: 'music prompt', negative: '' },
      },
    } as unknown as ResolveRequest
    expect((await resolveSegment(request)).assetUrl).toContain('data:audio')
    expect(vi.mocked(runWorkflow).mock.calls[0][0]).toMatchObject({
      kind,
      outputNode: '2',
      prompt: { '1': { inputs: { text: prompt } } },
    })
    expect(JSON.parse(workflow.data)['1'].inputs.text).toBe('original')
  }
)
it('validates workflow before queuing generation', async () => {
  await expect(
    resolveSegment({
      settings: {},
      segment: { category: Segment.IMAGE },
    } as ResolveRequest)
  ).rejects.toThrow('Select a ComfyUI')
  expect(runWorkflow).not.toHaveBeenCalled()
})
