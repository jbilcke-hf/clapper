import { ClapWorkflowProvider } from '@aitube/clap'

import { ClapWorkflowProviderShortNames } from '@/components/settings/constants'

export function formatProvider(
  ClapWorkflowProvider?: ClapWorkflowProvider
): string {
  return `${
    (ClapWorkflowProviderShortNames as any)[ClapWorkflowProvider || ''] ||
    'None'
  }`
}
