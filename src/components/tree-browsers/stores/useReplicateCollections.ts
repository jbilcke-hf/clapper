'use client'

import { useEffect, useState, useTransition } from 'react'
import { ReplicateCollection } from '../types'

export function useReplicateCollections(): ReplicateCollection[] {
  const [_pending, startTransition] = useTransition()
  const [collections, setCollections] = useState<ReplicateCollection[]>([])
  // const [models, setModels] = useState<ReplicateModel[]>([])

  useEffect(() => {
    startTransition(async () => {
      // TODO @Julian: this was something we did in the ligacy
      // Clapper, but I'm not sure we want to support Replicate
      // again just yet, we probably require other arch changes
      // const collections = await listCollections()
      const collections: ReplicateCollection[] = []
      setCollections(collections)
      //  setModels(models)
    })
  }, [])

  return collections
}
