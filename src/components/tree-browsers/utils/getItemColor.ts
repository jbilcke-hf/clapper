export function getItemColor(rawText: string, defaultColor?: string): string {
  const text = `${rawText || ''}`.trim().toLowerCase()

  if (text.includes('transfer') || text.includes('transform')) {
    return 'text-pink-200/70 stroke-pink-200/70'
  }

  if (
    text.includes('interpolator') ||
    text.includes('interpolate') ||
    text.includes('interpolation')
  ) {
    return 'text-purple-200/70 stroke-purple-200/70'
  }

  if (
    text.includes('superresolution') ||
    text.includes('resolution') ||
    text.includes('upscaling') ||
    text.includes('upscaler') ||
    text.includes('upscale')
  ) {
    return 'text-sky-200/70 stroke-sky-200/70'
  }

  if (
    text.includes('tts') ||
    text.includes('speech') ||
    text.includes('voice')
  ) {
    return 'text-emerald-200/70 stroke-emerald-200/70'
  }

  if (text.includes('video') || text.includes('movie')) {
    return 'text-yellow-200/70 stroke-yellow-200/70'
  }

  if (
    text.includes('audio') ||
    text.includes('sound') ||
    text.includes('music')
  ) {
    return 'text-lime-200/70 stroke-lime-200/70'
  }

  if (text.includes('image') || text.includes('photo')) {
    return 'text-cyan-200/70 stroke-cyan-200/70'
  }

  return defaultColor || 'text-gray-200/70 stroke-gray-200/70'
}
