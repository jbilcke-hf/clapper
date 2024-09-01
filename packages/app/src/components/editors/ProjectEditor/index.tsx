
import { FormInput } from '@/components/forms/FormInput'
import { FormSection } from '@/components/forms/FormSection'
import { FormSwitch } from '@/components/forms/FormSwitch'

import { ClapProject } from '@aitube/clap'
import { useTimeline } from '@aitube/timeline'


export function ProjectEditor() {
  const clap: ClapProject | undefined = useTimeline((s) => s.clap)

  /*
  // maybe we will use something like this to handle the sync
  // useSyncProjectEditor()

  const current = useProjectEditor((s) => s.current)
  const setCurrent = useProjectEditor((s) => s.setCurrent)
  const undo = useProjectEditor((s) => s.undo)
  const redo = useProjectEditor((s) => s.redo)

  useEffect(() => {
    setCurrent(clap?.meta)
  }, [clap?.meta, setCurrent])
  */

  const title = useTimeline(s => s.title)
  const description = useTimeline(s => s.description)
  const synopsis = useTimeline(s => s.synopsis)
  const width = useTimeline(s => s.width)
  const height = useTimeline(s => s.height)
  const bpm = useTimeline(s => s.bpm)
  const frameRate = useTimeline(s => s.frameRate)
  const imagePrompt = useTimeline(s => s.imagePrompt)
  const systemPrompt = useTimeline(s => s.systemPrompt)
  const licence = useTimeline(s => s.licence)
  const isInteractive = useTimeline(s => s.isInteractive)
  const isLoop = useTimeline(s => s.isLoop)

  /*
  if (!current) {
    return (
      <FormSection label={'Project Settings'} className="p-4">
        Loading project..
      </FormSection>
    )
  }
  */

  // TODO: adapt the editor based on the kind of
  // entity (character, location..)
  //
  // I think we can use UI elements of our legacy character editor
  // that I did in a Hugging Face space
  return (
    <FormSection label={'Project Settings'} className="p-4">
      <FormInput<string>
        label={'Title'}
        defaultValue=""
        // value={current.title || ''}
        // onChange={(title) => {
        //   setCurrent({ ...current, title })
        // }}
        value={title}
        onChange={(title) => {
          useTimeline.setState({ title })
        }}
      />
      <FormInput<string>
        label={'Description'}
        defaultValue=""
        // value={current.description || ''}
        // onChange={(description) => {
        //   setCurrent({ ...current, description })
        // }}
        value={description}
        onChange={(description) => {
          useTimeline.setState({ description })
        }}
      />
      <FormInput<string>
        label={'Synopsis'}
        defaultValue=""
        // value={current.synopsis || ''}
        // onChange={(synopsis) => {
        //   setCurrent({ ...current, synopsis })
        // }}
        value={synopsis}
        onChange={(synopsis) => {
          useTimeline.setState({ synopsis })
        }}
      />
      <FormInput<number>
        label={'Content width (⚠️ careful!)'}
        defaultValue={1024}
         
        // 4k is 3840×2160
        // but we can't do that yet obviously
        minValue={256}
        maxValue={1024}

        value={width || 1024}
        onChange={(width) => {
          useTimeline.setState({ width })
        }}
      />
      <FormInput<number>
        label={'Content height (⚠️ careful!)'}

        defaultValue={576}
        // 4k is 3840×2160
        // but we can't do that yet obviously
        minValue={256}
        maxValue={1024}

        value={height || 576}
        onChange={(height) => {
          useTimeline.setState({ height })
        }}
      />
      <FormInput<number>
        label={'BPM (Beats Per Minute) (WIP)'}
        value={bpm || 110}
        defaultValue={110}
        minValue={1}
        maxValue={500}
        onChange={(bpm) => {
          useTimeline.setState({ bpm })
        }}
      />
      <FormInput<number>
        label={'Frame rate (WIP)'}
        value={frameRate || 24}
        defaultValue={24}
        minValue={1}
        maxValue={1000}
        onChange={(frameRate) => {
          useTimeline.setState({ frameRate })
        }}
      />
      <FormInput<string>
        label={'Global image/video prompt ("3D render, 1970 style..")'}
        // value={current.imagePrompt || ''}
        // onChange={(imagePrompt) => {
        //   setCurrent({ ...current, imagePrompt })
        // }}
        defaultValue=""
        value={imagePrompt}
        onChange={(imagePrompt) => {
          useTimeline.setState({ imagePrompt })
        }}
      />
      <FormInput<string>
        label={'Global assistant prompt ("don\'t use swear words..")'}
        // value={current.systemPrompt || ''}
        // onChange={(systemPrompt) => {
        //   setCurrent({ ...current, systemPrompt })
        // }}
        value={systemPrompt}
        onChange={(systemPrompt) => {
          useTimeline.setState({ systemPrompt })
        }}
      />
      <FormInput<string>
        label={'Licence (commercial, public domain...)'}
        // value={current.licence || ''}
        // onChange={(licence) => {
        //   setCurrent({ ...current, licence })
        // }}
        value={licence}
        onChange={(licence) => {
          useTimeline.setState({ licence })
        }}
      />
      <FormSwitch
        label={'Is interactive? (WIP feature)'}
        // checked={
        //   typeof current.isInteractive === 'boolean'
        //     ? current.isInteractive
        //     : false
        // }
        // onCheckedChange={(isInteractive) => {
        //   setCurrent({ ...current, isInteractive: !isInteractive })
        // }}
        checked={
          typeof isInteractive === 'boolean'
            ? isInteractive
            : false
        }
        onCheckedChange={(isInteractive) => {
          useTimeline.setState({ isInteractive: !isInteractive })
        }}
      />
      <FormSwitch
        label={'Is a loop? (WIP feature)'}
        // checked={typeof current.isLoop === 'boolean' ? current.isLoop : false}
        // onCheckedChange={(isLoop) => {
        //   setCurrent({ ...current, isLoop: !isLoop })
        // }}
        
        checked={
          typeof isLoop === 'boolean'
            ? isLoop
            : false
        }
        onCheckedChange={(isLoop) => {
          useTimeline.setState({ isLoop: !isLoop })
        }}

      />
    </FormSection>
  )
}
