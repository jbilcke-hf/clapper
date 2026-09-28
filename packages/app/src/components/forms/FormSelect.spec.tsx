// @vitest-environment jsdom
import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { FormSelect } from './FormSelect'
vi.mock('@/services', () => ({ useTheme: () => ({ formInputRadius: '8px' }) }))
vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}))
afterEach(cleanup)
it('updates Radix selected state when an imported workflow changes its mapping', async () => {
  Element.prototype.scrollIntoView = vi.fn()
  const items = [
    { id: 'first', label: 'First node', value: 1 },
    { id: 'second', label: 'Second node', value: 2 },
  ]
  const { rerender } = render(
    <FormSelect
      label="Output"
      selectedItemId="first"
      selectedItemLabel="First node"
      items={items}
    />
  )
  rerender(
    <FormSelect
      label="Output"
      selectedItemId="second"
      selectedItemLabel="Second node"
      items={items}
    />
  )
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
  const selected = await screen.findByRole('option', { name: 'Second node' })
  expect(selected.getAttribute('data-state')).toBe('checked')
  expect(
    screen
      .getByRole('option', { name: 'First node' })
      .getAttribute('data-state')
  ).toBe('unchecked')
})
