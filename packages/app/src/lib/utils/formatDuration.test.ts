import { expect, test } from 'vitest'

import { formatDuration } from './formatDuration'

test('formatDuration', () => {
  expect(formatDuration(0)).toBe('00:00:00:000')
  expect(formatDuration(1050)).toBe('00:00:01:050')
  expect(formatDuration(60500)).toBe('00:01:00:500')
  expect(formatDuration(3600999)).toBe('01:00:00:999')
})
