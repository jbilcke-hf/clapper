"use client"

import { create } from "zustand"

import { AudioStore } from "./types"
import { getDefaultAudioState } from "./getDefaultAudioState"

export const useAudio = create<AudioStore>((set, get) => ({
  ...getDefaultAudioState(),
}))