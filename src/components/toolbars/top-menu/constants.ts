import { RenderingStrategy } from '@aitube/timeline'

export const strategyLabels = {
  [RenderingStrategy.ON_DEMAND]: 'Render on click',
  [RenderingStrategy.ON_SCREEN_ONLY]: 'Render visible items',
  [RenderingStrategy.ON_SCREEN_THEN_SURROUNDING]: 'Also render surrounding',
  [RenderingStrategy.ON_SCREEN_THEN_ALL]: 'Render all (for GPU-rich people)',
}
