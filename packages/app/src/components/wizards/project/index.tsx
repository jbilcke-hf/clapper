import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useUI } from '@/services'
import { ProjectCreationWizardStep } from '@aitube/clapper-services'

export function StepChooseCategory() {
  return (
    <>
      <p>Choose a category:</p>
    </>
  )
}

export function StepCreateFromPrompt() {
  return (
    <>
      <p>Type a prompt:</p>
    </>
  )
}

const stepPanels: Record<ProjectCreationWizardStep, JSX.Element> = {
  [ProjectCreationWizardStep.NONE]: <></>,
  [ProjectCreationWizardStep.CHOOSE_CATEGORY]: <StepChooseCategory />,
  [ProjectCreationWizardStep.CREATE_FROM_PROMPT]: <StepCreateFromPrompt />,
}

const stepLabels = {
  [ProjectCreationWizardStep.NONE]: '',
  [ProjectCreationWizardStep.CHOOSE_CATEGORY]: 'Choose category',
  [ProjectCreationWizardStep.CREATE_FROM_PROMPT]: 'Create from prompt',
} as any

export function ProjectCreationWizard() {
  const projectCreationWizardStep = useUI((s) => s.projectCreationWizardStep)
  const setProjectCreationWizardStep = useUI(
    (s) => s.setProjectCreationWizardStep
  )

  return (
    <Dialog
      open={projectCreationWizardStep !== ProjectCreationWizardStep.NONE}
      onOpenChange={(open) =>
        setProjectCreationWizardStep(
          open
            ? ProjectCreationWizardStep.CHOOSE_CATEGORY
            : ProjectCreationWizardStep.NONE
        )
      }
    >
      <DialogContent
        className={cn(
          `select-none`,
          // DialogContent comes with some hardcoded values so we need to override them
          `h-[70%] w-[95w] max-w-8xl md:w-[70vw]`,
          `flex flex-row`
        )}
      >
        <ScrollArea className="flex h-full w-44 flex-col">
          <div className="flex flex-col items-end">
            {Object.keys(stepPanels).map((key) => (
              <Button
                key={key}
                variant="ghost"
                className="flex w-full flex-col items-end text-right text-lg font-thin capitalize text-neutral-300"
                onClick={() =>
                  setProjectCreationWizardStep(key as ProjectCreationWizardStep)
                }
              >
                {stepLabels[key]}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex h-full max-w-[calc(100%-150px)] flex-grow select-none flex-col justify-between border-l border-neutral-800 pl-8">
          <ScrollArea className="flex h-full flex-row">
            {stepPanels[projectCreationWizardStep]}
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-sm font-light dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
              onClick={() => {
                setProjectCreationWizardStep(ProjectCreationWizardStep.NONE)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
