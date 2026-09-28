import { expect, it } from 'vitest'
import { ComfyUIWorkflowApiGraph } from './graph'
import { readConfiguredComfyWorkflow } from './convertComfyUiWorkflowApiToClapWorkflow'
import { ClapWorkflowCategory } from '@aitube/clap'
const workflow = {
  '1': { class_type: 'Text', inputs: { text: 'voice text', enabled: true } },
  '2': { class_type: 'SaveAudio', inputs: { audio: ['1', 0] } },
}
it.each([
  '{}',
  '[]',
  'null',
  '{"nodes":[]}',
  '{"1":{"class_type":"SaveAudio","inputs":{"audio":["missing",0]}}}',
])('rejects invalid/API-incompatible JSON %s', (value) => {
  expect(ComfyUIWorkflowApiGraph.isValidWorkflow(value)).toBe(false)
})
it('allows repeated graph queries without corrupting indegrees', () => {
  const graph = new ComfyUIWorkflowApiGraph(workflow)
  expect(graph.getOutputNode()?.id).toBe('2')
  expect(graph.getOutputNode()?.id).toBe('2')
  expect(graph.getGraphData().inDegree['2']).toBe(1)
})
it('constructs edge relationships and combines search predicates', () => {
  const graph = new ComfyUIWorkflowApiGraph(workflow)
  expect(
    graph.findInput({ nodeOutputToNodeInput: 'audio', name: 'text' })[0]?.id
  ).toBe('1.inputs.text')
  expect(
    graph.findInput({ name: 'does-not-exist', value: () => true })
  ).toEqual([])
  expect(graph.getInputs()['1.inputs.enabled'].type).toBe('boolean')
})
it('supports legacy audio graphs and preserves selected input/output mappings', () => {
  const converted = readConfiguredComfyWorkflow(
    JSON.stringify(workflow),
    ClapWorkflowCategory.VOICE_GENERATION
  )!
  expect(converted.label).toBe('Custom Voice Workflow')
  expect(converted.inputValues['@clapper/prompt']).toMatchObject({
    id: '1.inputs.text',
  })
  converted.inputValues['@clapper/prompt'] = {
    id: '@clapper/null',
    label: 'Unset',
  }
  expect(
    readConfiguredComfyWorkflow(
      JSON.stringify(converted),
      ClapWorkflowCategory.VOICE_GENERATION
    )?.inputValues['@clapper/prompt']
  ).toMatchObject({ id: '@clapper/null' })
})

it.each([42, {}, [], null])(
  'rejects malformed graph metadata before preview rendering: %s',
  (title) => {
    const invalid = {
      '1': { class_type: 'SaveImage', inputs: {}, _meta: { title } },
    }
    expect(
      ComfyUIWorkflowApiGraph.isValidWorkflow(JSON.stringify(invalid))
    ).toBe(false)
  }
)
