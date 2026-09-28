// @vitest-environment jsdom
import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, act } from '@testing-library/react'
import { ClapWorkflowCategory } from '@aitube/clap'
import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'
import { FormComfyUIWorkflowSettings } from './FormComfyUIWorkflowSettings'
import { ComfyWorkflowPreview } from './ComfyWorkflowPreview'
vi.mock('./FormArea', () => ({
  FormArea: ({ value, onChange, error, label }: any) => (
    <>
      <textarea
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  ),
}))
vi.mock('./FormInput', () => ({
  FormInput: ({ value, onChange, label }: any) => (
    <input
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))
vi.mock('./FormSelect', () => ({
  FormSelect: ({ label }: any) => <span>{label}</span>,
}))
vi.mock('./FormField', () => ({
  FormField: ({ children }: any) => <div>{children}</div>,
}))
vi.mock('../ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <>{children}</>,
  TooltipTrigger: ({ children }: any) => <>{children}</>,
  TooltipContent: ({ children }: any) => <>{children}</>,
}))
const raw = {
  '1': { class_type: 'Text', inputs: { text: 'say hello' } },
  '2': { class_type: 'SaveAudio', inputs: { audio: ['1', 0] } },
}
const workflow = convertComfyUiWorkflowApiToClapWorkflow(
  JSON.stringify(raw),
  ClapWorkflowCategory.VOICE_GENERATION
)
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
it('previews actual graph nodes and their connection without executing code', () => {
  render(<ComfyWorkflowPreview json={JSON.stringify(raw)} />)
  expect(
    screen.getByRole('img', { hidden: true }).getAttribute('aria-label')
  ).toContain('2 nodes')
  expect(screen.getByText('#1 → audio (output 0)')).toBeTruthy()
})
it('keeps the last saved workflow when malformed JSON replaces a pending valid draft', () => {
  vi.useFakeTimers()
  const onChange = vi.fn()
  render(
    <FormComfyUIWorkflowSettings
      label="Workflow"
      clapWorkflow={workflow}
      defaultClapWorkflow={workflow}
      className=""
      onChange={onChange}
    />
  )
  fireEvent.change(screen.getByLabelText('Workflow'), {
    target: { value: JSON.stringify(raw) },
  })
  fireEvent.change(screen.getByLabelText('Workflow'), {
    target: { value: '{bad json' },
  })
  act(() => {
    vi.advanceTimersByTime(400)
  })
  expect(onChange).not.toHaveBeenCalled()
  expect(screen.getByRole('alert').textContent).toContain('API-format')
})
it('imports dropped API JSON and preserves the caller object while editing', async () => {
  vi.useFakeTimers()
  const onChange = vi.fn()
  render(
    <FormComfyUIWorkflowSettings
      label="Workflow"
      clapWorkflow={workflow}
      defaultClapWorkflow={workflow}
      className=""
      onChange={onChange}
    />
  )
  const imported = structuredClone(raw)
  imported['1'].inputs.text = 'new imported text'
  const input = screen.getByLabelText('Import Workflow')
  await act(async () =>
    fireEvent.change(input, {
      target: {
        files: [{ size: 200, text: async () => JSON.stringify(imported) }],
      },
    })
  )
  act(() => {
    vi.advanceTimersByTime(400)
  })
  expect(onChange).toHaveBeenCalledOnce()
  expect(JSON.parse(onChange.mock.calls[0][0].data)['1'].inputs.text).toBe(
    'new imported text'
  )
  expect(JSON.parse(workflow.data)['1'].inputs.text).toBe('say hello')
})
it('rejects oversized imports', async () => {
  const onChange = vi.fn()
  render(
    <FormComfyUIWorkflowSettings
      label="Workflow"
      clapWorkflow={workflow}
      defaultClapWorkflow={workflow}
      className=""
      onChange={onChange}
    />
  )
  await act(async () =>
    fireEvent.change(screen.getByLabelText('Import Workflow'), {
      target: { files: [{ size: 3 * 1024 * 1024 }] },
    })
  )
  expect(screen.getByRole('alert').textContent).toContain('2 MB')
  expect(onChange).not.toHaveBeenCalled()
})
