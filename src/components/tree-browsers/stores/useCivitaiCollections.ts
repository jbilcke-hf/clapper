"use client"

import { useEffect, useState, useTransition } from "react"
import { CivitaiCollection } from "../types"


export function useCivitaiCollections(): CivitaiCollection[] {
  const [_pending, startTransition] = useTransition()
  const [collections, setCollections] = useState<CivitaiCollection[]>([])
  // const [models, setModels] = useState<CivitaiModel[]>([])

  useEffect(() => {
    startTransition(async () => {
      // TODO @Julian: this was something we did in the ligacy
      // Clapper, but I'm not sure we want to support Civitai
      // again just yet, we probably require other arch changes
      // const collections = await listCollections()
      const collections: CivitaiCollection[] = []
      setCollections(collections)
     //  setModels(models)
    })
  }, [])

  return collections
}