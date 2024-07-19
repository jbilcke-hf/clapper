import { cn } from '@aitube/timeline'

import { ComputeProvider } from '@aitube/clapper-services'
import { formatProvider } from '@/components/toolbars/top-menu/lists/formatProvider'

import { computeProvidersLogos } from './logos'

export function ComputeProviderLogo({
  provider = ComputeProvider.NONE,
  height = 28,
  className = '',
}: {
  provider?: ComputeProvider
  height?: number | string
  className?: string
}) {
  const src =
    computeProvidersLogos[provider || ComputeProvider.NONE] ||
    computeProvidersLogos.NONE

  return (
    <img
      src={src}
      height={height as any}
      alt={formatProvider(provider)}
      className={cn(className)}
    />
  )
}
