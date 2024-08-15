export type AutocompleteState = {
  isRunning: boolean
}
export type AutocompleteControls = {
  /**
   * Take a range of storyboards and infer the corresponding story
   *
   * This will directly update the screenplay and timeline,
   * creating the appropriate segments, line coordinates etc
   *
   *
   * @param params
   * @returns
   */
  storyboardsToStory: (params?: {
    startTimeInMs?: number
    endTimeInMs?: number
  }) => Promise<void>
}
export type AutocompleteStore = AutocompleteState & AutocompleteControls
