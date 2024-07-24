'use client'

import { LiaCogSolid, LiaTheaterMasksSolid } from 'react-icons/lia'
import {
  MdAccountCircle,
  MdLocalMovies,
  MdOutlineAccountTree,
  MdOutlineHistoryEdu,
} from 'react-icons/md'
import { LuClapperboard } from 'react-icons/lu'
import { PiTreeStructureBold } from 'react-icons/pi'
import { IoFilmOutline } from 'react-icons/io5'
import { EditorView } from '@aitube/clapper-services'

import { useTheme } from '@/services/ui/useTheme'
import { EditorsSideMenuItem } from './EditorsSideMenuItem'

export function EditorsSideMenu() {
  const theme = useTheme()
  return (
    <div
      className="flex h-full w-14 flex-col items-center justify-between border-r"
      style={{
        backgroundColor:
          theme.editorMenuBgColor || theme.defaultBgColor || '#eeeeee',
        borderRightColor:
          theme.editorBorderColor || theme.defaultBorderColor || '#eeeeee',
      }}
    >
      <div className="flex h-full w-full flex-col items-center">
        <EditorsSideMenuItem view={EditorView.PROJECT}>
          <MdLocalMovies />
        </EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.SCRIPT} label="Script editor">
          <MdOutlineHistoryEdu />
        </EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.ENTITY} label="Entity editor">
          <LiaTheaterMasksSolid />
        </EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.SEGMENT} label="Segment editor">
          <IoFilmOutline />
        </EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.WORKFLOW} label="Workflow editor">
          <PiTreeStructureBold />
        </EditorsSideMenuItem>
      </div>
    </div>
  )
}
