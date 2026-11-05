import { expect, test } from 'vitest'
import {
  ClapSegmentCategory,
  ClapWorkflow,
  ClapWorkflowCategory,
} from '@aitube/clap'
import { ResolveRequest } from '@aitube/clapper-services'

import { getClapperInputs, getMainInputs } from './getClapperInputs'
import { getOutputFiles } from './getOutputFiles'
import { ClapperComfyUiInputIds } from './types'
import { ComfyUIWorkflowApiGraph } from './graph'
import { createPromptBuilder } from './createPromptBuilder'

const makeRequest = (category: ClapSegmentCategory, video = { image: '' }) =>
  ({
    segment: { category },
    meta: { width: 1024, height: 576 },
    prompts: {
      image: { identity: '', positive: 'a cat', negative: 'blurry' },
      video: { ...video, voice: '' },
      voice: { identity: '', positive: 'hello world', negative: '' },
      audio: { positive: 'rain on a roof', negative: '' },
      music: { positive: 'slow jazz', negative: '' },
    },
  }) as unknown as ResolveRequest

const input = (id: string) => ({ id, label: id })

const allMainInputs = {
  [ClapperComfyUiInputIds.PROMPT]: input('6.inputs.text'),
  [ClapperComfyUiInputIds.NEGATIVE_PROMPT]: input('7.inputs.text'),
  [ClapperComfyUiInputIds.WIDTH]: input('5.inputs.width'),
  [ClapperComfyUiInputIds.HEIGHT]: input('5.inputs.height'),
  [ClapperComfyUiInputIds.SEED]: input('3.inputs.seed'),
  [ClapperComfyUiInputIds.IMAGE]: input('10.inputs.image'),
  [ClapperComfyUiInputIds.OUTPUT]: input('9'),
}

const asObject = (pairs: [string, string | number][]) =>
  Object.fromEntries(pairs)

test('image: sends prompts, size and a seed', () => {
  const inputs = asObject(
    getClapperInputs(makeRequest(ClapSegmentCategory.IMAGE), allMainInputs)
  )

  expect(inputs['6.inputs.text']).toBe('a cat')
  expect(inputs['7.inputs.text']).toBe('blurry')
  expect(inputs['5.inputs.width']).toBe(1024)
  expect(inputs['5.inputs.height']).toBe(576)
  expect(typeof inputs['3.inputs.seed']).toBe('number')
  expect(inputs['10.inputs.image']).toBeUndefined()
})

test('video: also sends the image to animate, without its header', () => {
  const inputs = asObject(
    getClapperInputs(
      makeRequest(ClapSegmentCategory.VIDEO, {
        image: 'data:image/jpeg;base64,QUJD',
      }),
      allMainInputs
    )
  )

  expect(inputs['10.inputs.image']).toBe('QUJD')
  expect(inputs['5.inputs.width']).toBe(1024)
})

test.each([
  [ClapSegmentCategory.DIALOGUE, 'hello world'],
  [ClapSegmentCategory.SOUND, 'rain on a roof'],
  [ClapSegmentCategory.MUSIC, 'slow jazz'],
])('%s: uses its own prompt and ignores the image size', (category, prompt) => {
  const inputs = asObject(
    getClapperInputs(makeRequest(category), allMainInputs)
  )

  expect(inputs['6.inputs.text']).toBe(prompt)
  expect(inputs['5.inputs.width']).toBeUndefined()
  expect(inputs['5.inputs.height']).toBeUndefined()
})

test('skips inputs the workflow does not have or that are unset', () => {
  const inputs = getClapperInputs(makeRequest(ClapSegmentCategory.IMAGE), {
    [ClapperComfyUiInputIds.PROMPT]: input('6.inputs.text'),
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT]: input(
      ClapperComfyUiInputIds.NULL
    ),
    [ClapperComfyUiInputIds.OUTPUT]: input('9'),
  })

  const ids = inputs.map(([id]) => id)
  expect(ids).toEqual(['6.inputs.text'])
})

// a raw workflow, as pasted by a user in the voice settings
const rawVoiceWorkflow = JSON.stringify({
  '1': {
    inputs: { text: '@clapper/prompt', voice: 'default' },
    class_type: 'TextToSpeech',
    _meta: { title: 'Text to speech' },
  },
  '2': {
    inputs: { audio: ['1', 0], filename_prefix: 'audio/clapper' },
    class_type: 'SaveAudio',
    _meta: { title: 'Save Audio' },
  },
})

const makeWorkflow = (inputValues: any): ClapWorkflow =>
  ({
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: rawVoiceWorkflow,
    inputValues,
  }) as unknown as ClapWorkflow

test('getMainInputs: finds the prompt and output nodes of a raw workflow', () => {
  const mainInputs = getMainInputs(makeWorkflow({}))

  expect((mainInputs[ClapperComfyUiInputIds.PROMPT] as any)?.id).toBe(
    '1.inputs.text'
  )
  expect((mainInputs[ClapperComfyUiInputIds.OUTPUT] as any)?.id).toBe('2')
})

test('getMainInputs: trusts the inputs saved with the workflow', () => {
  const saved = { [ClapperComfyUiInputIds.OUTPUT]: input('42') }

  expect(getMainInputs(makeWorkflow(saved))).toBe(saved)
})

test('getOutputFiles: finds files whatever the output node is', () => {
  const file = { filename: 'a.bin', subfolder: '', type: 'output' }

  expect(getOutputFiles({ images: [file] })).toEqual([file])
  expect(getOutputFiles({ gifs: [file] })).toEqual([file])
  expect(getOutputFiles({ audio: [file] })).toEqual([file])
  expect(getOutputFiles({ images: [], gifs: [file] })).toEqual([file])
  expect(getOutputFiles({})).toEqual([])
  expect(getOutputFiles(undefined)).toEqual([])
})

test('a pasted voice workflow gets the spoken text in the right node', () => {
  const workflow = makeWorkflow({})
  const mainInputs = getMainInputs(workflow)
  // a PromptBuilder is immutable: each input() call returns a new builder
  const promptBuilder = getClapperInputs(
    makeRequest(ClapSegmentCategory.DIALOGUE),
    mainInputs
  ).reduce(
    (builder, [inputId, value]) => builder.input(inputId, value),
    createPromptBuilder(ComfyUIWorkflowApiGraph.fromString(workflow.data))
  )

  expect(promptBuilder.prompt['1'].inputs.text).toBe('hello world')
  // the rest of the workflow is left alone
  expect(promptBuilder.prompt['1'].inputs.voice).toBe('default')
})
