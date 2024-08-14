import { TagCategory, TagColor } from './types'

export const tagCategoryToTagColor: Record<TagCategory, TagColor> = {
  [TagCategory.MISC]: TagColor.STONE,
  [TagCategory.IMAGE]: TagColor.SKY,
  [TagCategory.VIDEO]: TagColor.VIOLET,
  [TagCategory.VOICE]: TagColor.ORANGE,
  [TagCategory.SOUND]: TagColor.YELLOW,
  [TagCategory.MUSIC]: TagColor.GREEN,
}

export const tagColorToTailwindClass: Record<TagColor, string> = {
  [TagColor.SLATE]: `bg-slate-800 border-slate-600 text-slate-300`,
  [TagColor.GRAY]: `bg-gray-800 border-gray-600 text-gray-300`,
  [TagColor.ZINC]: `bg-zinc-800 border-zinc-600 text-zinc-300`,
  [TagColor.NEUTRAL]: `bg-neutral-800 border-neutral-600 text-neutral-300`,
  [TagColor.STONE]: `bg-neutral-800 border-neutral-600 text-neutral-300`,
  [TagColor.RED]: `bg-red-800 border-red-600 text-red-300`,
  [TagColor.ORANGE]: `bg-orange-800 border-orange-600 text-orange-300`,
  [TagColor.AMBER]: `bg-amber-800 border-amber-600 text-amber-300`,
  [TagColor.YELLOW]: `bg-yellow-800 border-yellow-600 text-yellow-300`,
  [TagColor.LIME]: `bg-lime-800 border-lime-600 text-lime-300`,
  [TagColor.GREEN]: `bg-green-800 border-green-600 text-green-300`,
  [TagColor.EMERALD]: `bg-emerald-800 border-emerald-600 text-emerald-300`,
  [TagColor.TEAL]: `bg-teal-800 border-teal-600 text-teal-300`,
  [TagColor.CYAN]: `bg-cyan-800 border-cyan-600 text-cyan-300`,
  [TagColor.SKY]: `bg-sky-800 border-sky-600 text-sky-300`,
  [TagColor.BLUE]: `bg-blue-800 border-blue-600 text-blue-300`,
  [TagColor.INDIGO]: `bg-indigo-800 border-indigo-600 text-indigo-300`,
  [TagColor.VIOLET]: `bg-violet-800 border-violet-600 text-violet-300`,
  [TagColor.FUCHSIA]: `bg-fuchsia-800 border-fuchsia-600 text-fuchsia-300`,
  [TagColor.PINK]: `bg-pink-800 border-pink-600 text-pink-300`,
  [TagColor.PURPLE]: `bg-purple-800 border-purple-600 text-purple-300`,
  [TagColor.ROSE]: `bg-rose-800 border-rose-600 text-rose-300`,
}
