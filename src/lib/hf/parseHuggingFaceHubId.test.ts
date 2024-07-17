import { expect, test } from 'vitest'

import { parseHuggingFaceHubId } from './parseHuggingFaceHubId'

test('parseHuggingFaceHubId', () => {
  expect(parseHuggingFaceHubId('stabilityai/stable-cascade')).toStrictEqual({
    category: 'models',
    categoryAndOwnerAndId: 'models/stabilityai/stable-cascade',
    id: 'stable-cascade',
    owner: 'stabilityai',
    ownerAndId: 'stabilityai/stable-cascade',
  })
  expect(
    parseHuggingFaceHubId('spaces/jbilcke-hf/ai-comic-factory')
  ).toStrictEqual({
    category: 'spaces',
    categoryAndOwnerAndId: 'spaces/jbilcke-hf/ai-comic-factory',
    id: 'ai-comic-factory',
    owner: 'jbilcke-hf',
    ownerAndId: 'jbilcke-hf/ai-comic-factory',
  })
})
