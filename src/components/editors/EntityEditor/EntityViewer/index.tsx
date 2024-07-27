import { useEffect } from 'react'
import { ClapEntity, ClapSegmentCategory } from '@aitube/clap'
import { useTimeline } from '@aitube/timeline'

import { FormFile } from '@/components/forms/FormFile'
import { FormInput } from '@/components/forms/FormInput'
import { FormSection } from '@/components/forms/FormSection'
import { FormSelect } from '@/components/forms/FormSelect'
import { Button } from '@/components/ui/button'
import { useEntityEditor, useIO } from '@/services'
import { cn } from '@/lib/utils'

import { EntityList } from './EntityList'

export function EntityViewer({
  className = '',
}: {
  className?: string
} = {}) {
  const entities = useTimeline((s) => s.entities)
  const updateEntities = useTimeline((s) => s.updateEntities)

  const saveEntitiesToClap = useIO((s) => s.saveEntitiesToClap)
  const openEntitiesFromClap = useIO((s) => s.openEntitiesFromClap)

  const current = useEntityEditor((s) => s.current)
  const setCurrent = useEntityEditor((s) => s.setCurrent)

  const draft = useEntityEditor((s) => s.draft)
  const setDraft = useEntityEditor((s) => s.setDraft)

  const showEntityList = useEntityEditor((s) => s.showEntityList)
  const setShowEntityList = useEntityEditor((s) => s.setShowEntityList)

  useEffect(() => {
    setCurrent(entities.at(0))
  }, [entities, setCurrent])

  useEffect(() => {
    setDraft(current)
  }, [current, setDraft])

  const handleInputChange = (
    field: keyof ClapEntity,
    value: string | number | undefined
  ) => {
    if (!draft) {
      return
    }
    let updatedValue = value
    if (field === 'age') {
      updatedValue = value === '' ? undefined : parseInt(value as string)
    }
    if (field === 'label') {
      updatedValue = value?.toString().toUpperCase()
    }

    setDraft({ ...draft, [field]: updatedValue })
  }

  const handleSave = () => {
    if (!draft) {
      return
    }
    updateEntities([draft])
  }

  const handleFileUpload = async (field: 'imageId' | 'audioId', file: File) => {
    if (!draft) {
      return
    }
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
    setDraft({ ...draft, [field]: dataUrl })
  }

  const handleExport = async () => {
    if (!draft) {
      return
    }
    await saveEntitiesToClap([draft])
  }

  const handleImport = async (file: File) => {
    await openEntitiesFromClap(file)
  }

  const handleBack = () => {
    setShowEntityList(true)
  }

  const handleSelectEntity = (entityId: string) => {
    setShowEntityList(false)
  }

  return (
    <div
      className={cn(`flex h-full w-full flex-col overflow-x-auto`, className)}
    >
      {showEntityList ? (
        <div className="mb-4">
          <EntityList onSelectEntity={handleSelectEntity} />
        </div>
      ) : (
        <div className="flex">
          {draft && (
            <FormSection className="px-2">
              <Button onClick={handleBack}>Back</Button>
              <FormInput
                label="Identifier (UPPERCASE)"
                value={draft.label || ''}
                onChange={(value) => handleInputChange('label', value)}
              />
              <FormSelect<ClapSegmentCategory>
                label="Category"
                selectedItemId={draft.category}
                items={Object.values(ClapSegmentCategory).map(
                  (category: ClapSegmentCategory) => ({
                    id: category,
                    label: category,
                    value: category,
                  })
                )}
                onSelect={(value) => handleInputChange('category', value)}
              />
              {/* ... form fields ... */}
              <FormFile
                label="Visual Identity"
                onChange={(files) =>
                  files[0] && handleFileUpload('imageId', files[0])
                }
              />
              {draft.imageId && (
                <div className="mt-2">
                  <img
                    src={draft.imageId}
                    alt="Entity Preview"
                    className="h-auto max-w-full"
                  />
                </div>
              )}
              <FormFile
                label="Audio Identity"
                onChange={(files) =>
                  files[0] && handleFileUpload('audioId', files[0])
                }
              />
              {draft.audioId && (
                <div className="mt-2">
                  <audio controls src={draft.audioId} />
                </div>
              )}
              <FormInput
                label="Description"
                value={draft.description || ''}
                onChange={(value) => handleInputChange('description', value)}
              />
              <FormInput
                label="Appearance"
                value={draft.appearance || ''}
                onChange={(value) => handleInputChange('appearance', value)}
              />
              <FormInput
                label="Age"
                value={draft.age?.toString() || ''}
                onChange={(value) => handleInputChange('age', value)}
              />
              <FormInput
                label="Gender"
                value={draft.gender || ''}
                onChange={(value) => handleInputChange('gender', value)}
              />
              <div className="mt-4 flex space-x-2">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleExport}>Export</Button>
              </div>
              <div className="mt-4 flex space-x-2">
                <FormFile
                  label="Import"
                  onChange={(files) => files[0] && handleImport(files[0])}
                />
              </div>
            </FormSection>
          )}
        </div>
      )}
    </div>
  )
}
