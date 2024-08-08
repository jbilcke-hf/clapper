import { ClapWorkflow, ClapWorkflowProvider } from '@aitube/clap'

export function hasNoPublicAPI({ provider }: ClapWorkflow) {
  const providerStr = provider.toLowerCase()
  if (
    provider === ClapWorkflowProvider.SUNO ||
    provider === ClapWorkflowProvider.KUAISHOU ||
    provider === ClapWorkflowProvider.RUNWAYML ||
    provider === ClapWorkflowProvider.LUMALABS ||
    provider === ClapWorkflowProvider.HEDRA ||
    provider === ClapWorkflowProvider.UDIO ||
    providerStr.includes('no public api') ||
    providerStr.includes('no api') ||
    providerStr.includes('not available') ||
    providerStr.includes('no image api') ||
    providerStr.includes('no video api') ||
    providerStr.includes('no music api') ||
    providerStr.includes('no sound api') ||
    providerStr.includes('no voice api') ||
    providerStr.includes('unavailable')
  ) {
    return true
  }
  return false
}
