import { FormFile } from '@/components/forms/FormFile'
import { FormInput } from '@/components/forms/FormInput'
import { FormSection } from '@/components/forms/FormSection'
import { FormSwitch } from '@/components/forms/FormSwitch'
import { useProjectEditor } from '@/services'
import { ClapProject } from '@aitube/clap'
import { useTimeline } from '@aitube/timeline'
import { useEffect } from 'react'

export function ProjectEditor() {
  const clap: ClapProject | undefined = useTimeline((s) => s.clap)

  const current = useProjectEditor((s) => s.current)
  const setCurrent = useProjectEditor((s) => s.setCurrent)
  const undo = useProjectEditor((s) => s.undo)
  const redo = useProjectEditor((s) => s.redo)

  useEffect(() => {
    setCurrent(clap?.meta)
  }, [clap?.meta, setCurrent])

  if (!current) {
    return (
      <FormSection label={'Project Settings'} className="p-4">
        Loading project..
      </FormSection>
    )
  }

  // TODO: adapt the editor based on the kind of
  // entity (character, location..)
  //
  // I think we can use UI elements of our legacy character editor
  // that I did in a Hugging Face space
  return (
    <FormSection label={'Project Settings'} className="p-4">
      <FormInput<string>
        label={'Title'}
        value={current.title || ''}
        defaultValue=""
        onChange={(title) => {
          setCurrent({ ...current, title })
        }}
      />
      <FormInput<string>
        label={'Description'}
        value={current.description || ''}
        defaultValue=""
        onChange={(description) => {
          setCurrent({ ...current, description })
        }}
      />
      <FormInput<string>
        label={'Synopsis'}
        value={current.synopsis || ''}
        defaultValue=""
        onChange={(synopsis) => {
          setCurrent({ ...current, synopsis })
        }}
      />
      <FormInput<number>
        label={'Default media width ⚠️'}
        value={current.width || 1024}
        defaultValue={1024}
        // 4k is 3840×2160
        // but we can't do that yet obviously
        minValue={256}
        maxValue={1024}
      />
      <FormInput<number>
        label={'Default media height ⚠️'}
        value={current.height || 576}
        defaultValue={576}
        // 4k is 3840×2160
        // but we can't do that yet obviously
        minValue={256}
        maxValue={1024}
      />
      <FormInput<number>
        label={'BPM (Beats Per Minute) (WIP)'}
        value={current.bpm || 110}
        defaultValue={110}
        minValue={1}
        maxValue={500}
      />
      <FormInput<number>
        label={'Frame rate (WIP)'}
        value={current.frameRate || 24}
        defaultValue={24}
        minValue={1}
        maxValue={1000}
      />
      <FormInput<string>
        label={'Global image/video prompt ("3D render, 1970 style..")'}
        value={current.imagePrompt || ''}
        onChange={(imagePrompt) => {
          setCurrent({ ...current, imagePrompt })
        }}
      />
      <FormInput<string>
        label={'Global assistant prompt ("don\'t use swear words..")'}
        value={current.systemPrompt || ''}
        onChange={(systemPrompt) => {
          setCurrent({ ...current, systemPrompt })
        }}
      />
      <FormInput<string>
        label={'Licence (commercial, public domain...)'}
        value={current.licence || ''}
        onChange={(licence) => {
          setCurrent({ ...current, licence })
        }}
      />
      <FormSwitch
        label={'Is interactive? (WIP feature)'}
        checked={
          typeof current.isInteractive === 'boolean'
            ? current.isInteractive
            : false
        }
        onCheckedChange={(isInteractive) => {
          setCurrent({ ...current, isInteractive: !isInteractive })
        }}
      />
      <FormSwitch
        label={'Is a loop? (WIP feature)'}
        checked={typeof current.isLoop === 'boolean' ? current.isLoop : false}
        onCheckedChange={(isLoop) => {
          setCurrent({ ...current, isLoop: !isLoop })
        }}
      />
    </FormSection>
  )
}
