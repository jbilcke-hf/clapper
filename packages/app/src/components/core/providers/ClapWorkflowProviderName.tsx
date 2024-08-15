import { cn } from '@aitube/timeline'

import { formatProvider } from '@/components/toolbars/top-menu/lists/formatProvider'

import { ClapWorkflowProviderLogo } from './ClapWorkflowProviderLogo'
import { ClapWorkflowProvider } from '@aitube/clap'

export function ClapWorkflowProviderName({
  className = '',
  children = ClapWorkflowProvider.NONE,
}: {
  className?: string
  children?: ClapWorkflowProvider
}) {
  return (
    <div className={cn(`flex flex-row items-center space-x-2`, className)}>
      <ClapWorkflowProviderLogo
        provider={children}
        height={18}
        className={cn(`rounded-full`)}
      />
      <div>{formatProvider(children)}</div>
    </div>
  )
}
