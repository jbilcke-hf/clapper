import { ClapEntity, ClapSegmentCategory, newEntity } from '@aitube/clap'
import { useTimeline } from '@aitube/timeline'

import { Button } from '@/components/ui/button'
import { useEntityEditor, useIO } from '@/services'

export function EntityList({
  onSelectEntity,
}: {
  onSelectEntity: (entityId: string) => void
}) {
  const entities = useTimeline((s) => s.entities)
  const setCurrent = useEntityEditor((s) => s.setCurrent)
  const addEntity = useEntityEditor((s) => s.addEntity)
  const removeEntity = useEntityEditor((s) => s.removeEntity)

  const handleAddEntity = () => {
    const entity: ClapEntity = newEntity({
      id: Date.now().toString(),
      label: 'NEW_ENTITY',
      category: ClapSegmentCategory.CHARACTER,
      description: '',
      appearance: '',
    }) // ignoring some fields for now
    addEntity(entity)
  }

  return (
    <div className="pt-4">
      <div className="mb-2">
        <h1 className="mb-4 inline px-4 text-xl font-bold">Entities</h1>
        <Button
          onClick={handleAddEntity}
          className="absolute right-2 top-2"
          variant="secondary"
        >
          New +
        </Button>
      </div>
      <ul>
        {entities.map((entity: ClapEntity) => (
          <li key={entity.id} className={`flex px-2 py-1`}>
            <Button
              onClick={() => {
                setCurrent(entity)
                onSelectEntity(entity.id)
              }}
              variant="ghost"
            >
              {entity.label} ({entity.category})
            </Button>
            <Button
              onClick={() => removeEntity(entity.id)}
              className={`ml-2 ml-auto`}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
