import { cn } from '@aitube/timeline'

import { formatProvider } from '@/components/toolbars/top-menu/lists/formatProvider'

import { ClapWorkflowProvidersLogos } from './logos'
import { ClapWorkflowProvider } from '@aitube/clap'

export function ClapWorkflowProviderLogo({
  provider = ClapWorkflowProvider.NONE,
  height = 28,
  className = '',
}: {
  provider?: ClapWorkflowProvider
  height?: number | string
  className?: string
}) {
  const src =
    ClapWorkflowProvidersLogos[provider || ClapWorkflowProvider.NONE] ||
    ClapWorkflowProvidersLogos.NONE

  return (
    <img
      src={src}
      height={height as any}
      alt={formatProvider(provider)}
      className={cn(className)}
    />
  )
}
