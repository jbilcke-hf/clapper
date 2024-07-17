import { IconType } from 'react-icons/lib'

import { CgClapperBoard } from 'react-icons/cg'
import {
  LuFileAudio2,
  LuFileImage,
  LuFileText,
  LuFileVideo2,
  LuScrollText,
  LuTextCursorInput,
} from 'react-icons/lu'
import { IoIosColorFilter, IoMdCloudOutline } from 'react-icons/io'
import { MdOutlineVideoSettings } from 'react-icons/md'
import { MdOutlineCorporateFare } from 'react-icons/md'
import { MdQueueMusic } from 'react-icons/md'
import { BsPersonVideo2 } from 'react-icons/bs'
import {
  RiComputerLine,
  RiFileVideoLine,
  RiScissors2Line,
} from 'react-icons/ri'
import { PiFileVideo } from 'react-icons/pi'
import { RiFolderVideoLine } from 'react-icons/ri'
import { MdGroup } from 'react-icons/md'
import { HiOutlineGlobeAlt } from 'react-icons/hi2'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { MdOutlineLocationOn } from 'react-icons/md'
import { FaPersonFallingBurst } from 'react-icons/fa6'
import { FaPeoplePulling } from 'react-icons/fa6'
import { MdNaturePeople } from 'react-icons/md'
import { BsSoundwave } from 'react-icons/bs'
import { HiOutlineFilm } from 'react-icons/hi'
import { BiUserVoice } from 'react-icons/bi'
import { BiImage } from 'react-icons/bi'
import { MdOutlineHighQuality } from 'react-icons/md'
import { MdOutlineAutoAwesomeMotion } from 'react-icons/md'
import { BiTransfer } from 'react-icons/bi'
import { LiaFileDownloadSolid } from 'react-icons/lia'

// icons used for our various model types
export const icons: Record<string, IconType> = {
  project: CgClapperBoard,
  team: MdGroup,
  computer: RiComputerLine,
  cloud: IoMdCloudOutline,
  downloads: LiaFileDownloadSolid,
  soundfile: LuFileAudio2,
  imagefile: LuFileImage,
  videofile: LuFileVideo2,
  textfile: LuFileText,
  screenplay: LuScrollText,
  community: HiOutlineGlobeAlt,
  vendor: HiOutlineShoppingCart,
  prompt: LuTextCursorInput,
  characters: FaPersonFallingBurst,
  character: BsPersonVideo2,
  transition: RiScissors2Line,
  location: MdOutlineLocationOn,
  misc: MdNaturePeople,
  lora: BsPersonVideo2,
  sound: BsSoundwave,
  film: HiOutlineFilm,
  speech: BiUserVoice,
  image: BiImage,
  transfer: BiTransfer,
  interpolate: MdOutlineAutoAwesomeMotion,
  upscale: MdOutlineHighQuality,
  textToVideo: MdOutlineVideoSettings,
  videoToVideo: IoIosColorFilter,
  textToMusic: MdQueueMusic,
  referenceVideoFolder: RiFolderVideoLine,
  referenceVideoFile: PiFileVideo,
}
