import { FormFile } from "@/components/forms/FormFile"
import { FormInput } from "@/components/forms/FormInput"
import { FormSection } from "@/components/forms/FormSection"
import { useEntityEditor } from "@/services"

export function EntityEditor() {
  const current = useEntityEditor(s => s.current)
  const setCurrent = useEntityEditor(s => s.setCurrent)
  const history = useEntityEditor(s => s.history)
  const undo = useEntityEditor(s => s.undo)
  const redo = useEntityEditor(s => s.redo)

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
          label={"Visual identity file"}
        />
        {/*
        <FormInput<string>
          label={"Audio identity"}
          value={current?.audioId.slice(0, 20)}
        />
        */}
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
