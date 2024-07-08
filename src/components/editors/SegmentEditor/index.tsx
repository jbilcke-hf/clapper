import { FormInput } from "@/components/forms/FormInput"
import { FormSection } from "@/components/forms/FormSection"
import { useSegmentEditor } from "@/services"

export function SegmentEditor() {
  const current = useSegmentEditor(s => s.current)
  const setCurrent = useSegmentEditor(s => s.setCurrent)
  const history = useSegmentEditor(s => s.history)
  const undo = useSegmentEditor(s => s.undo)
  const redo = useSegmentEditor(s => s.redo)

  if (!current) {
    return <div>
      No segment selected
    </div>
  }

  return (
    <FormSection
      label={"Project Settings"}
      className="p-4">
        <FormInput<string>
          label={"Label"}
          value={current.label}
        />
        <FormInput<string>
          label={"Prompt"}
          value={current.prompt}
          onChange={(newValue: string) => {
            setCurrent({
              ...current,
              prompt: newValue
            })
          }}
        />
        <div>
          <div>Generation status</div>
          <div>{current.status || "N.A."}</div>
        </div>
        <div>
          <div>Created at</div>
          <div>{current.createdAt || "N.A."}</div>
        </div>
    </FormSection>
  )
}
