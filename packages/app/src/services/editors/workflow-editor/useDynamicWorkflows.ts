import { useEffect } from 'react'

import { useSettings } from '@/services/settings'

import { useWorkflowEditor } from './useWorkflowEditor'

/**
 * Synchronize the workflow config with the list of available workflows
 *
 * This hook should only be installed in one place of the app,
 * ideally at the root
 */
export function useDynamicWorkflows() {
  const comfyClapWorkflowForImage = useSettings(
    (s) => s.comfyClapWorkflowForImage
  )
  const comfyClapWorkflowForVideo = useSettings(
    (s) => s.comfyClapWorkflowForVideo
  )
  const comfyWorkflowForMusic = useSettings((s) => s.comfyWorkflowForMusic)
  const comfyWorkflowForSound = useSettings((s) => s.comfyWorkflowForSound)
  const comfyWorkflowForVoice = useSettings((s) => s.comfyWorkflowForVoice)

  const updateAvailableWorkflows = useWorkflowEditor(
    (s) => s.updateAvailableWorkflows
  )

  useEffect(() => {
    updateAvailableWorkflows()
  }, [
    comfyClapWorkflowForImage,
    comfyClapWorkflowForVideo,
    comfyWorkflowForMusic,
    comfyWorkflowForSound,
    comfyWorkflowForVoice,
    updateAvailableWorkflows,
  ])
}
