"use client"

import { LiaCogSolid, LiaTheaterMasksSolid } from "react-icons/lia"
import { MdAccountCircle, MdLocalMovies, MdOutlineAccountTree, MdOutlineHistoryEdu } from "react-icons/md"
import { LuClapperboard } from "react-icons/lu"
import { IoFilmOutline } from "react-icons/io5"
import { EditorView } from "@aitube/clapper-services"

import { useTheme } from "@/services/ui/useTheme"
import { EditorsSideMenuItem } from "./EditorsSideMenuItem"

export function EditorsSideMenu() {
  const theme = useTheme()
  return (

    <div className="flex flex-col w-14 h-full items-center justify-between border-r"
    style={{
      backgroundColor: theme.editorMenuBgColor || theme.defaultBgColor || "#eeeeee",
      borderRightColor: theme.editorBorderColor || theme.defaultBorderColor || "#eeeeee"
    }}
    >
      <div className="flex flex-col h-full w-full items-center">

        <EditorsSideMenuItem view={EditorView.PROJECT}><MdLocalMovies /></EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.SCRIPT} label="Script editor"><MdOutlineHistoryEdu /></EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.ENTITY} label="Entity editor"><LiaTheaterMasksSolid /></EditorsSideMenuItem>
        <EditorsSideMenuItem view={EditorView.SEGMENT} label="Segment editor"><IoFilmOutline /></EditorsSideMenuItem>

        {/*<EditorSideMenuItem name="Characters"><LiaTheaterMasksSolid /></EditorSideMenuItem>*/}
        {/*<EditorSideMenuItem name="Project"><MdLocalMovies /></EditorSideMenuItem>*/}
        {/*<EditorSideMenuItem name="Locations"><TbMapSearch /></EditorSideMenuItem> */}
   
        {/*<EditorSideMenuItem name="Assistant" label="Movie assistant"><MdAutoFixHigh /></EditorSideMenuItem>*}
        {/*<EditorSideMenuItem name="Rendering"><IoFilmOutline /></EditorSideMenuItem>*/}
        {/*<EditorSideMenuItem name="Export"><HiOutlineCloudArrowDown /></EditorSideMenuItem>*/}
        {/*<EditorSideMenuItem name="Broadcast"><BsBroadcastPin /></EditorSideMenuItem>*/}
            
      </div>
    </div>
  )
}