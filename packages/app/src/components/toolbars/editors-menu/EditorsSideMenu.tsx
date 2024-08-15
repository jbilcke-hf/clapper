'use client'

import { LiaCogSolid, LiaTheaterMasksSolid } from 'react-icons/lia'
import {
  MdAccountCircle,
  MdMovieEdit,
  MdLocalMovies,
  MdOutlineAccountTree,
  MdOutlineHistoryEdu,
  MdOutlineNaturePeople,
} from 'react-icons/md'
import { FaPersonShelter } from 'react-icons/fa6'
import { LuClapperboard } from 'react-icons/lu'
import {
  PiTreeViewLight,
  PiTreeStructureLight,
  PiBookOpenTextLight,
} from 'react-icons/pi'
import { IoFilmOutline } from 'react-icons/io5'
import { CiViewTimeline } from 'react-icons/ci'
import { EditorView } from '@aitube/clapper-services'

import { useTheme } from '@/services/ui/useTheme'
import { EditorsSideMenuItem } from './EditorsSideMenuItem'
import { NatureIcon } from './NatureIcon'

export function EditorsSideMenu() {
  const theme = useTheme()
  return (
    <div
      className="flex h-full w-[3.25rem] flex-col items-center justify-between border-r"
      style={{
        backgroundColor:
          theme.editorMenuBgColor || theme.defaultBgColor || '#eeeeee',
        borderRightColor:
          theme.editorBorderColor || theme.defaultBorderColor || '#eeeeee',
      }}
    >
      <div className="flex h-full w-full flex-col items-center">
        <EditorsSideMenuItem view={EditorView.PROJECT} label="Project settings">
          <MdMovieEdit />
        </EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.SCRIPT} label="Story">
          <PiBookOpenTextLight />
        </EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.ENTITY} label="Entities">
          <NatureIcon />
        </EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.SEGMENT} label="Segment editor">
          <CiViewTimeline />
        </EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.WORKFLOW} label="Workflows">
          <PiTreeStructureLight />
        </EditorsSideMenuItem>
      </div>
    </div>
  )
}
