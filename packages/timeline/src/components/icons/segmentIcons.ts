// one issue with icons is that they need to be downloaded from somewhere
// so we assume to host application will put them in /images/icons
// but maybe there is a way to put them here, in this project?

import { ClapSegmentCategory } from "@aitube/clap"

const path = `/images/icons/segments/`

// those icons are specially used for the segments

export const segmentCategoryToIconPath: Record<ClapSegmentCategory, string> = {
  [ClapSegmentCategory.SPLAT]: `${path}splat.svg`,
  [ClapSegmentCategory.MESH]: `${path}mesh.svg`,
  [ClapSegmentCategory.DEPTH]: `${path}depth.svg`,
  [ClapSegmentCategory.EVENT]: `${path}event.svg`,
  [ClapSegmentCategory.EFFECT]: `${path}effect.svg`,
  [ClapSegmentCategory.INTERFACE]: `${path}interface.svg`,
  [ClapSegmentCategory.PHENOMENON]: `${path}phenomenon.svg`,
  [ClapSegmentCategory.VIDEO]: `${path}video.svg`,
  [ClapSegmentCategory.STORYBOARD]: `${path}storyboard.svg`,
  [ClapSegmentCategory.TRANSITION]: `${path}transition.svg`,
  [ClapSegmentCategory.CHARACTER]: `${path}character.svg`,
  [ClapSegmentCategory.LOCATION]: `${path}location.svg`,
  [ClapSegmentCategory.TIME]: `${path}time.svg`,
  [ClapSegmentCategory.ERA]: `${path}era.svg`,
  [ClapSegmentCategory.LIGHTING]: `${path}lighting.svg`,
  [ClapSegmentCategory.WEATHER]: `${path}weather.svg`,
  [ClapSegmentCategory.ACTION]: `${path}action.svg`,
  [ClapSegmentCategory.MUSIC]: `${path}music.svg`,
  [ClapSegmentCategory.SOUND]: `${path}sound.svg`,
  [ClapSegmentCategory.DIALOGUE]: `${path}dialogue.svg`,
  [ClapSegmentCategory.STYLE]: `${path}style.svg`,
  [ClapSegmentCategory.CAMERA]: `${path}camera.svg`,
  [ClapSegmentCategory.GENERIC]: `${path}generic.svg`,
}
