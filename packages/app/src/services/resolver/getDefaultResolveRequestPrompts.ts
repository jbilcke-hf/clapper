import { ResolveRequestPrompts } from '@aitube/clapper-services'

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export function getDefaultResolveRequestPrompts(
  partials: DeepPartial<ResolveRequestPrompts> = {}
): ResolveRequestPrompts {
  const defaultPrompts: ResolveRequestPrompts = {
    image: {
      identity: `${partials?.image?.identity || ''}`,
      positive: `${partials?.image?.positive || ''}`,
      negative: `${partials?.image?.negative || ''}`,
    },
    video: {
      image: `${partials?.video?.image || ''}`,
      voice: `${partials?.video?.voice || ''}`,
    },
    voice: {
      identity: `${partials?.voice?.identity || ''}`,
      positive: `${partials?.voice?.positive || ''}`,
      negative: `${partials?.voice?.negative || ''}`,
    },
    audio: {
      positive: `${partials?.audio?.positive || ''}`,
      negative: `${partials?.audio?.negative || ''}`,
    },
    music: {
      positive: `${partials?.music?.positive || ''}`,
      negative: `${partials?.music?.negative || ''}`,
    },
  }
  return defaultPrompts
}
