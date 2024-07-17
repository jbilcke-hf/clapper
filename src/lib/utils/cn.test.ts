import { expect, test } from 'vitest'

import { cn } from './cn'

test('cn', () => {
  expect(cn("p-4 m-4", true ? "m-4 p-2" : "p-4 m-2")).toBe("m-4 p-2")
})

