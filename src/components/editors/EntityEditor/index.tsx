import { FormFile } from "@/components/forms/FormFile";
import { FormInput } from "@/components/forms/FormInput";
import { FormSection } from "@/components/forms/FormSection";
import { FormSelect } from "@/components/forms/FormSelect";
import { Button } from "@/components/ui/button";
import { useEntityEditor, useIO } from "@/services";
import { ClapEntity, ClapSegmentCategory } from "@aitube/clap";
import { useTimeline } from "@aitube/timeline";
import { useEffect, useState } from "react";

function EntityList({ onSelectEntity }: {
  onSelectEntity: (entityId: string) => void;
}) {
  const { entities, selectEntity, addEntity, removeEntity, current } = useEntityEditor();

  const handleAddEntity = () => {
    const newEntity: ClapEntity = {
      id: Date.now().toString(),
      label: "NEW_ENTITY",
      category: ClapSegmentCategory.CHARACTER,
      description: "",
      appearance: "",
    } as ClapEntity; // ignoring some fields for now
    addEntity(newEntity);
  };

  useEffect(() => {
    if (entities.length > 0 && !current) {
      selectEntity(entities[0].id);
    }
  }, [entities, current, selectEntity]);

  return (
    <div className="pt-4">
      <div className="mb-2">
        <h1 className="px-4 mb-4 text-xl font-bold inline">Entities</h1>
        <Button onClick={handleAddEntity} className="absolute top-2 right-2" variant="secondary">
          New +
        </Button>
      </div>
      <ul>
        {entities.map((entity: ClapEntity) => (
          <li key={entity.id} className={`flex py-1 px-2`}>
            <Button
              onClick={() => {
                selectEntity(entity.id);
                onSelectEntity(entity.id);
              }}
              className={`${current && current?.id === entity.id ? "border" : ""}`}
              variant="ghost"
            >
              {entity.label} ({entity.category})
            </Button>
            <Button onClick={() => removeEntity(entity.id)} className={`ml-2 ml-auto`} variant="destructive" size="sm">
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EntityEditor() {
  const { current, updateEntity } = useEntityEditor();
  const { exportEntity, importEntity } = useIO();
  const [localEntity, setLocalEntity] = useState<ClapEntity | null>(null);
  const [showEntityList, setShowEntityList] = useState(true);

  const { loadEntities } = useEntityEditor();
  const clap = useTimeline((s) => s.clap);

  useEffect(() => {
    if (clap && clap.entities) {
      loadEntities(clap.entities);
    }
  }, [clap, loadEntities]);

  useEffect(() => {
    if (current) {
      setLocalEntity(current);
    }
  }, [current]);

  const handleInputChange = (field: keyof ClapEntity, value: string | number | undefined) => {
    if (localEntity) {
      let updatedValue = value;
      if (field === "age") {
        updatedValue = value === "" ? undefined : parseInt(value as string);
      }
      if (field === "label") {
        updatedValue = value?.toString().toUpperCase();
      }
      setLocalEntity((prevEntity) => ({
        ...prevEntity,
        [field]: updatedValue,
      } as ClapEntity));
    }
  };

  const handleSave = () => {
    if (localEntity) {
      updateEntity(localEntity);
    }
  };

  const handleFileUpload = async (field: "imageId" | "audioId", file: File) => {
    if (localEntity) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      setLocalEntity((prevEntity) => ({
        ...prevEntity,
        [field]: dataUrl,
      } as ClapEntity));
    }
  };

  const handleExport = async () => {
    if (localEntity) {
      await exportEntity(localEntity);
    }
  };

  const handleImport = async (file: File) => {
    const entity = await importEntity(file);
    if (entity) {
      setLocalEntity(entity);
    }
  };

  const handleBack = () => {
    setShowEntityList(true);
  };

  const handleSelectEntity = (entityId: string) => {
    setShowEntityList(false);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-x-auto">
      {showEntityList ? (
        <div className="mb-4">
          <EntityList onSelectEntity={handleSelectEntity} />
        </div>
      ) : (
        <div className="flex">
          {localEntity && (
            <FormSection className="px-2">
              <Button onClick={handleBack}>Back</Button>
              <FormInput
                label="Identifier (UPPERCASE)"
                value={localEntity.label || ""}
                onChange={(value) => handleInputChange("label", value)}
              />
              <FormSelect
                label="Category"
                selectedItemId={localEntity.category}
                items={Object.values(ClapSegmentCategory).map((category) => ({
                  id: category,
                  label: category,
                  value: category,
                }))}
                onSelect={(value) => handleInputChange("category", value)}
              />
              {/* ... form fields ... */}
              <FormFile
                label="Visual Identity"
                onChange={(files) => files[0] && handleFileUpload("imageId", files[0])}
              />
              {localEntity.imageId && (
                <div className="mt-2">
                  <img src={localEntity.imageId} alt="Entity Preview" className="max-w-full h-auto" />
                </div>
              )}
              <FormFile
                label="Audio Identity"
                onChange={(files) => files[0] && handleFileUpload("audioId", files[0])}
              />
              {localEntity.audioId && (
                <div className="mt-2">
                  <audio controls src={localEntity.audioId} />
                </div>
              )}
              <FormInput
                label="Description"
                value={localEntity.description || ""}
                onChange={(value) => handleInputChange("description", value)}
              />
              <FormInput
                label="Appearance"
                value={localEntity.appearance || ""}
                onChange={(value) => handleInputChange("appearance", value)}
              />
              <FormInput
                label="Age"
                value={localEntity.age?.toString() || ""}
                onChange={(value) => handleInputChange("age", value)}
              />
              <FormInput
                label="Gender"
                value={localEntity.gender || ""}
                onChange={(value) => handleInputChange("gender", value)}
              />
              <div className="mt-4 flex space-x-2">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleExport}>Export</Button>
              </div>
              <div className="mt-4 flex space-x-2">
                <FormFile label="Import" onChange={(files) => files[0] && handleImport(files[0])} />
              </div>
            </FormSection>
          )}
        </div>
      )}
    </div>
  );
}
