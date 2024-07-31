import { AutocompleteState } from './types'

export function getDefaultAutocompleteState(): AutocompleteState {
  const state: AutocompleteState = {
    isRunning: false,
  }
  return state
}
