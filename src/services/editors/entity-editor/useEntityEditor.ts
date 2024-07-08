"use client"

import { create } from "zustand"
import { ClapEntity } from "@aitube/clap"
import { EntityEditorStore } from "@aitube/clapper-services"

import { getDefaultEntityEditorState } from "./getDefaultEntityEditorState"

export const useEntityEditor = create<EntityEditorStore>((set, get) => ({
  ...getDefaultEntityEditorState(),
  setCurrent: (current?: ClapEntity) => { set({ current }) },
  undo: () => {},
  redo: () => {},
}))


if (typeof window !== "undefined") {
  (window as any).useEntityEditor = useEntityEditor
}