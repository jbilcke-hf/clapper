import Image from 'next/image'
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
  const staticImageData =
    computeProvidersLogos[provider || ComputeProvider.NONE] ||
    computeProvidersLogos.NONE

  return (
    <Image
      src={staticImageData}
      height={height as any}
      alt={formatProvider(provider)}
      className={cn(className)}

      // there is currently a bug when we build on GitHub Actions
      // the .png files are not recognized:
      //
      //   Creating an optimized production build ...
      //   Failed to compile.
      //   ./logos:2
      //   Error: Image import "./anthropic.png" is not a valid image file. The image may be corrupted or an unsupported format.
      //
      // So as a workaround, we do this:
      unoptimized
    />
  )
}
