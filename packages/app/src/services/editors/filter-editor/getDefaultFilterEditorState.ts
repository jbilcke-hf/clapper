import { FilterEditorState } from '@aitube/clapper-services'

import { cinematic, filters } from './filters'

export function getDefaultFilterEditorState(): FilterEditorState {
  const state: FilterEditorState = {
    before: [],
    current: undefined,
    after: [],
    version: 0,

    isEnabled: true,

    availableFilters: [...filters],

    activeFilters: [
      {
        filter: cinematic,
        parameters: {
          preset: 'Blade Runner',
          intensity: 0.6,
          contrast: 1.3,
        },
      },
    ],
  }

  return state
}
