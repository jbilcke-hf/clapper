import { TimelineSegment, useTimeline } from "@aitube/timeline"

import { FormFile } from "@/components/forms/FormFile"
import { FormInput } from "@/components/forms/FormInput"
import { FormSection } from "@/components/forms/FormSection"
import { useEntityEditor, useRenderer } from "@/services"
import { useEffect } from "react"
import { ClapEntity, ClapProject } from "@aitube/clap"

export function EntityEditor() {
  const clap: ClapProject = useTimeline(s => s.clap)

  const segmentsChanged: number = useTimeline(s => s.segmentsChanged)
  const selectedSegments: TimelineSegment[] = useTimeline(s => s.selectedSegments)
  const { activeSegments } = useRenderer(s => s.bufferedSegments)

  const current = useEntityEditor(s => s.current)
  const setCurrent = useEntityEditor(s => s.setCurrent)
  const history = useEntityEditor(s => s.history)
  const undo = useEntityEditor(s => s.undo)
  const redo = useEntityEditor(s => s.redo)

  let segment = selectedSegments.at(-1)
  let entity: ClapEntity | undefined = clap.entityIndex[segment?.entityId as any]
 
  if (!entity) {
    segment = activeSegments.find(s => clap.entityIndex[s?.entityId as any])
    entity = clap.entityIndex[segment?.entityId as any]
  }

  useEffect(() => {
    setCurrent(entity)
  }, [clap, entity, segmentsChanged])

  if (!current) {
    return <div>
      No Entity selected
    </div>
  }

  // TODO: adapt the editor based on the kind of
  // entity (character, location..)
  //
  // I think we can use UI elements of our legacy character editor
  // that I did in a Hugging Face space
  return (
    <FormSection
      label={"Entity editor"}
      className="p-4">
        <label>Visual identity</label>
        {current?.imageId
          ? <img src={current?.imageId}></img>
          : null}
        <FormFile
          label={"Visual identity file (TODO)"}
        />
        {/*
        <FormInput<string>
          label={"Audio identity"}
          value={current?.audioId.slice(0, 20)}
        />
        */}
        <FormFile
          label={"Audio identity file (TODO)"}
        />
        <FormInput<string>
          label={"Label"}
          value={current.label}
        />
        <FormInput<string>
          label={"Description"}
          value={current.description}
        />
        <FormInput<number>
          label={"Age"}
          value={current.age}
        />
        <FormInput<string>
          label={"Gender"}
          value={current.gender}
        />
        <FormInput<string>
          label={"Appearance"}
          value={current.appearance}
        />
      </FormSection>
  )
}
