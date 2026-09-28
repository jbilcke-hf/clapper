import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  generateSeed,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'

import { ClapperComfyUiInputIds } from './types'
import { ComfyUIWorkflowApiGraph } from './graph'
import { getMainInputsFromComfyUiWorkflow } from './getMainInputsFromComfyUiWorkflow'
import { runWorkflow } from './runWorkflow'
import { getSegmentWorkflowProviderAndEngine } from '@/services/editors/workflow-editor/getSegmentWorkflowProviderAndEngine'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  const { generationWorkflow: workflow } =
    getSegmentWorkflowProviderAndEngine(request)
  if (!workflow?.data)
    throw new Error(
      'Select a ComfyUI API workflow before generating this clip.'
    )
  const graph = ComfyUIWorkflowApiGraph.fromString(workflow.data)
  const { inputValues: detected } = getMainInputsFromComfyUiWorkflow(
    workflow.data,
    workflow.category
  )
  const inputValues = { ...detected, ...workflow.inputValues }
  // Preserve configured literal fields without ever replacing connected node inputs.
  for (const [key, value] of Object.entries(inputValues)) {
    if (!key.startsWith('@clapper/'))
      graph.setInputValue(key, value, { ignoreErrors: true })
  }
  const category = request.segment.category
  const prompts =
    category === ClapSegmentCategory.DIALOGUE
      ? request.prompts.voice
      : category === ClapSegmentCategory.SOUND
        ? request.prompts.audio
        : category === ClapSegmentCategory.MUSIC
          ? request.prompts.music
          : request.prompts.image
  const replacements: [ClapperComfyUiInputIds, unknown][] = [
    [ClapperComfyUiInputIds.PROMPT, prompts.positive],
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT, prompts.negative],
    [ClapperComfyUiInputIds.WIDTH, request.meta.width],
    [ClapperComfyUiInputIds.HEIGHT, request.meta.height],
    [ClapperComfyUiInputIds.SEED, generateSeed()],
  ]
  for (const [key, value] of replacements) {
    const mapping = inputValues[key] as { id?: string } | undefined
    if (
      mapping?.id &&
      mapping.id !== ClapperComfyUiInputIds.NULL &&
      value !== undefined
    ) {
      graph.setInputValue(mapping.id, value)
    }
  }
  const imageInput = inputValues[ClapperComfyUiInputIds.IMAGE] as
    | { id?: string }
    | undefined
  if (
    category === ClapSegmentCategory.VIDEO &&
    imageInput?.id &&
    imageInput.id !== ClapperComfyUiInputIds.NULL
  ) {
    const input = graph.getInputs()[imageInput.id]
    const image = request.prompts.video.image
    if (!image)
      throw new Error('The selected video workflow needs a source image.')
    // Standard LoadImage is uploaded by runWorkflow; custom base64 nodes use the raw payload.
    graph.setInputValue(
      imageInput.id,
      input?.node.type === 'LoadImage'
        ? image
        : image.split(';base64,')[1] || image
    )
  }
  const outputNode = (
    inputValues[ClapperComfyUiInputIds.OUTPUT] as { id?: string } | undefined
  )?.id
  if (!outputNode || !Object.hasOwn(graph.toJson(), outputNode))
    throw new Error(
      'Select an existing output node in the ComfyUI workflow settings.'
    )
  const kind =
    category === ClapSegmentCategory.IMAGE
      ? 'image'
      : category === ClapSegmentCategory.VIDEO
        ? 'video'
        : 'audio'
  const assetUrl = await runWorkflow({
    baseUrl: request.settings.comfyUiApiUrl || 'http://localhost:8188',
    clientId: request.settings.comfyUiClientId || crypto.randomUUID(),
    username: request.settings.comfyUiHttpAuthLogin,
    password: request.settings.comfyUiHttpAuthPassword,
    prompt: graph.toJson(),
    outputNode,
    kind,
  })
  return { ...request.segment, assetUrl, assetSourceType: ClapAssetSource.DATA }
}
