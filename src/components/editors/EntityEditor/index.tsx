import { useEffect } from "react";
import { ClapEntity, ClapSegmentCategory, newEntity } from "@aitube/clap";
import { useTimeline } from "@aitube/timeline";

import { FormFile } from "@/components/forms/FormFile";
import { FormInput } from "@/components/forms/FormInput";
import { FormSection } from "@/components/forms/FormSection";
import { FormSelect } from "@/components/forms/FormSelect";
import { Button } from "@/components/ui/button";
import { useEntityEditor, useIO } from "@/services";

function EntityList({ onSelectEntity }: {
  onSelectEntity: (entityId: string) => void;
}) {
  const entities = useTimeline(s => s.entities);
  const setCurrent = useEntityEditor(s => s.setCurrent);
  const addEntity = useEntityEditor(s => s.addEntity);
  const removeEntity = useEntityEditor(s => s.removeEntity);

  const handleAddEntity = () => {
    const entity: ClapEntity = newEntity({
      id: Date.now().toString(),
      label: "NEW_ENTITY",
      category: ClapSegmentCategory.CHARACTER,
      description: "",
      appearance: "",
    }); // ignoring some fields for now
    addEntity(entity);
  };

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
                setCurrent(entity);
                onSelectEntity(entity.id);
              }}
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
  const entities = useTimeline(s => s.entities);
  const updateEntities = useTimeline(s => s.updateEntities);

  const saveEntitiesToClap = useIO(s => s.saveEntitiesToClap);
  const openEntitiesFromClap = useIO(s => s.openEntitiesFromClap);

  const current = useEntityEditor(s => s.current);
  const setCurrent = useEntityEditor(s => s.setCurrent);

  const draft = useEntityEditor(s => s.draft);
  const setDraft = useEntityEditor(s => s.setDraft);

  const showEntityList = useEntityEditor(s => s.showEntityList);
  const setShowEntityList = useEntityEditor(s => s.setShowEntityList);

  useEffect(() => {
    setCurrent(entities.at(0));
  }, [entities, setCurrent]);

  useEffect(() => {
    setDraft(current);
  }, [current, setDraft]);

  const handleInputChange = (field: keyof ClapEntity, value: string | number | undefined) => {
    if (!draft) { return }
    let updatedValue = value;
    if (field === "age") {
      updatedValue = value === "" ? undefined : parseInt(value as string);
    }
    if (field === "label") {
      updatedValue = value?.toString().toUpperCase();
    }
    
    setDraft({ ...draft, [field]: updatedValue })
  };

  const handleSave = () => {
    if (!draft) { return }
    updateEntities([ draft ]);
  };

  const handleFileUpload = async (field: "imageId" | "audioId", file: File) => {
    if (!draft) { return }
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
    setDraft({ ...draft, [field]: dataUrl });
  };

  const handleExport = async () => {
    if (!draft) { return }
    await saveEntitiesToClap([ draft ]);
  };

  const handleImport = async (file: File) => {
    await openEntitiesFromClap(file);
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
          {draft && (
            <FormSection className="px-2">
              <Button onClick={handleBack}>Back</Button>
              <FormInput
                label="Identifier (UPPERCASE)"
                value={draft.label || ""}
                onChange={(value) => handleInputChange("label", value)}
              />
              <FormSelect<ClapSegmentCategory>
                label="Category"
                selectedItemId={draft.category}
                items={Object.values(ClapSegmentCategory).map((category: ClapSegmentCategory) => ({
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
              {draft.imageId && (
                <div className="mt-2">
                  <img src={draft.imageId} alt="Entity Preview" className="max-w-full h-auto" />
                </div>
              )}
              <FormFile
                label="Audio Identity"
                onChange={(files) => files[0] && handleFileUpload("audioId", files[0])}
              />
              {draft.audioId && (
                <div className="mt-2">
                  <audio controls src={draft.audioId} />
                </div>
              )}
              <FormInput
                label="Description"
                value={draft.description || ""}
                onChange={(value) => handleInputChange("description", value)}
              />
              <FormInput
                label="Appearance"
                value={draft.appearance || ""}
                onChange={(value) => handleInputChange("appearance", value)}
              />
              <FormInput
                label="Age"
                value={draft.age?.toString() || ""}
                onChange={(value) => handleInputChange("age", value)}
              />
              <FormInput
                label="Gender"
                value={draft.gender || ""}
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
