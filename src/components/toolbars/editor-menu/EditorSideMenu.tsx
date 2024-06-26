"use client"

import { LiaCogSolid, LiaTheaterMasksSolid } from "react-icons/lia"
import { MdAccountCircle, MdOutlineAccountTree, MdOutlineHistoryEdu } from "react-icons/md"
import { LuClapperboard } from "react-icons/lu"

import { useEditor } from "@/services/editor/useEditor"
import { EditorSideMenuItem } from "./EditorSideMenuItem"
import { EditorView } from "@aitube/clapper-services"

export default function EditorMenu() {
  return (

    <div className="flex flex-col w-14 h-full items-center justify-between border-r border-gray-800">
      <div className="flex flex-col w-full items-center">

        <EditorSideMenuItem view={EditorView.PROJECT}><LuClapperboard /></EditorSideMenuItem>
        <EditorSideMenuItem view={EditorView.SCRIPT} label="Script editor"><MdOutlineHistoryEdu /></EditorSideMenuItem>

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