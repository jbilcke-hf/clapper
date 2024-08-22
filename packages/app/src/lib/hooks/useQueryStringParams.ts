import { useSearchParams } from 'next/navigation'
import { getValidNumber } from '../utils'
import { RenderingStrategy } from '@aitube/timeline'

export function useQueryStringParams({
  interactive: defaultInteractive = false,
  startAt: defaultStartAt = 0,
  prompt: defaultPrompt = '',
  clapUrl: defaultClapUrl = '',
  imageStrategy: defaultImageStrategy = RenderingStrategy.ON_DEMAND
}: {
  interactive?: boolean
  startAt?: number
  prompt?: string
  clapUrl?: string
  imageStrategy?: RenderingStrategy
} = {
  interactive: false,
  startAt: 0,
  prompt: '',
  clapUrl: '',
  imageStrategy: RenderingStrategy.ON_DEMAND
}) {
  const searchParams = useSearchParams()

  const prompt = (searchParams?.get('prompt') as string) || defaultPrompt

  const imageStrategy = (searchParams?.get('imageStrategy') as RenderingStrategy) || defaultImageStrategy

  const startAt = getValidNumber(`${(searchParams?.get('startAt') as string) || defaultStartAt}`.trim(), 0, Number.MAX_VALUE, 0)

  const interactive = `${(searchParams?.get('interactive') as string) || defaultInteractive}`.trim().toLowerCase() === 'true'

  const clapUrl = (searchParams?.get('clap') as string) || defaultClapUrl

  return { prompt, interactive, startAt, clapUrl, imageStrategy }
}
