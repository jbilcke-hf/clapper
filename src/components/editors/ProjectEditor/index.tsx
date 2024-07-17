import { FormFile } from "@/components/forms/FormFile"
import { FormInput } from "@/components/forms/FormInput"
import { FormSection } from "@/components/forms/FormSection"
import { FormSwitch } from "@/components/forms/FormSwitch"
import { useProjectEditor } from "@/services"
import { ClapProject } from "@aitube/clap"
import { useTimeline } from "@aitube/timeline"
import { useEffect } from "react"

export function ProjectEditor() {
  const clap: ClapProject | undefined = useTimeline(s => s.clap)

  const current = useProjectEditor(s => s.current)
  const setCurrent = useProjectEditor(s => s.setCurrent)
  const history = useProjectEditor(s => s.history)
  const undo = useProjectEditor(s => s.undo)
  const redo = useProjectEditor(s => s.redo)

  useEffect(() => {
    setCurrent(clap?.meta)
  }, [clap?.meta, setCurrent])
  
  if (!current) {
    return <div>
      Loading..
    </div>
  }

  // TODO: adapt the editor based on the kind of
  // entity (character, location..)
  //
  // I think we can use UI elements of our legacy character editor
  // that I did in a Hugging Face space
  return (
    <FormSection
      label={"Project Settings"}
      className="p-4">
      <FormInput<string>
        label={"title"}
        value={current.title || ""}
        defaultValue=""
        onChange={title => {
          setCurrent({ ...current, title })
        }}
      />
      <FormInput<string>
        label={"Description"}
        value={current.description || ""}
        defaultValue=""
        onChange={description => {
          setCurrent({ ...current, description })
        }}
      />
      <FormInput<string>
        label={"Synopsis"}
        value={current.synopsis || ""}
        defaultValue=""
        onChange={synopsis => {
          setCurrent({ ...current, synopsis })
        }}
      />
      <FormInput<number>
        label={"Default media width"}
        value={current.width || 1024}
        defaultValue={1024}
        // 4k is 3840×2160
        // but we can't do that yet obviously
        minValue={256}
        maxValue={1024}
      />
      <FormInput<number>
        label={"Default media height"}
        value={current.height || 576}
        defaultValue={576}
        // 4k is 3840×2160
        // but we can't do that yet obviously
        minValue={256}
        maxValue={1024}
      />
      {/*
      for this one we will need some kind of draft mode
      */}
      <FormInput<string>
        label={"Global prompt keywords (\"3D render, comical\"..)"}
        value={Array.isArray(current.extraPositivePrompt) ? (current.extraPositivePrompt.join(", ")) : ""}
        onChange={newKeywords => {
          // const keywords = newKeywords.split(",").map(x => x.trim())
        }}
      />
      <FormInput<string>
        label={"Licence (commercial, public domain...)"}
        value={current.licence || ""}
        onChange={licence => {
          setCurrent({ ...current, licence })
        }}
      />
      <FormSwitch
        label={"Is interactive? (WIP feature)"}
        checked={typeof current.isInteractive === "boolean" ? current.isInteractive : false}
        onCheckedChange={(isInteractive) => {
          setCurrent({ ...current, isInteractive: !isInteractive })
        }}
      />
      <FormSwitch
        label={"Is a loop? (WIP feature)"}
        checked={typeof current.isLoop === "boolean" ? current.isLoop : false}
        onCheckedChange={(isLoop) => {
          setCurrent({ ...current, isLoop: !isLoop })
        }}
      />
    </FormSection>
  )
}
