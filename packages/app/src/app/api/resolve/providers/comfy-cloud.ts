import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapInputValues,
  ClapSegmentCategory,
  ClapWorkflow,
} from '@aitube/clap'

export function getGenerationWorkflowForSegment(
  request: ResolveRequest
): ClapWorkflow {
  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      return request.settings.imageGenerationWorkflow
    case ClapSegmentCategory.VIDEO:
      return request.settings.videoGenerationWorkflow
    case ClapSegmentCategory.DIALOGUE:
      return request.settings.voiceGenerationWorkflow
    case ClapSegmentCategory.SOUND:
      return request.settings.soundGenerationWorkflow
    case ClapSegmentCategory.MUSIC:
      return request.settings.musicGenerationWorkflow
    default:
      throw new Error(
        `ComfyUI cloud workflows do not support ${request.segment.category} segments.`
      )
  }
}

export function getCloudWorkflowInputs(
  request: ResolveRequest,
  workflow: ClapWorkflow
): ClapInputValues {
  const values: ClapInputValues = {}

  workflow.inputFields.forEach((field) => {
    values[field.id] = workflow.inputValues?.[field.id] ?? field.defaultValue
  })

  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      values.prompt = request.prompts.image.positive
      values.negative_prompt = request.prompts.image.negative
      break
    case ClapSegmentCategory.VIDEO:
      values.prompt = request.prompts.image.positive
      values.negative_prompt = request.prompts.image.negative
      values.image = request.prompts.video.image
      break
    case ClapSegmentCategory.DIALOGUE:
      values.prompt = request.prompts.voice.positive
      values.negative_prompt = request.prompts.voice.negative
      break
    case ClapSegmentCategory.SOUND:
      values.prompt = request.prompts.audio.positive
      values.negative_prompt = request.prompts.audio.negative
      break
    case ClapSegmentCategory.MUSIC:
      values.prompt = request.prompts.music.positive
      values.negative_prompt = request.prompts.music.negative
      break
  }

  values.width = request.meta.width
  values.height = request.meta.height

  return values
}

export function extractCloudOutputUrl(response: any): string {
  const outputs = [
    response?.output,
    response?.outputs,
    response?.result,
    response?.results,
    response?.data?.output,
    response?.data?.outputs,
  ]

  for (const output of outputs) {
    const url = extractUrl(output)
    if (url) return url
  }

  return ''
}

export async function readCloudAssetAsDataUri(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Unable to fetch ComfyUI cloud output (${response.status}): ${await response.text()}`
    )
  }

  const contentType =
    response.headers.get('content-type') || inferMimeTypeFromUrl(url)
  const buffer = Buffer.from(await response.arrayBuffer())
  return `data:${contentType};base64,${buffer.toString('base64')}`
}

export function getRunId(response: any): string {
  return (
    response?.run_id ||
    response?.runId ||
    response?.id ||
    response?.data?.run_id ||
    response?.data?.runId ||
    response?.data?.id ||
    ''
  )
}

export function isTerminalSuccessStatus(status: string): boolean {
  return ['completed', 'complete', 'success', 'succeeded', 'finished'].includes(
    status.toLowerCase()
  )
}

export function isTerminalFailureStatus(status: string): boolean {
  return ['error', 'failed', 'failure', 'cancelled', 'canceled'].includes(
    status.toLowerCase()
  )
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractUrl(output: any): string {
  if (!output) return ''
  if (typeof output === 'string') return output.startsWith('http') ? output : ''

  if (Array.isArray(output)) {
    for (const item of output) {
      const url = extractUrl(item)
      if (url) return url
    }
    return ''
  }

  return (
    output.url ||
    output.uri ||
    output.src ||
    output.download_url ||
    output.thumbnail_url ||
    output.file_url ||
    ''
  )
}

function inferMimeTypeFromUrl(url: string): string {
  const pathname = new URL(url).pathname.toLowerCase()
  if (pathname.endsWith('.png')) return 'image/png'
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg'))
    return 'image/jpeg'
  if (pathname.endsWith('.webp')) return 'image/webp'
  if (pathname.endsWith('.gif')) return 'image/gif'
  if (pathname.endsWith('.mp4')) return 'video/mp4'
  if (pathname.endsWith('.webm')) return 'video/webm'
  if (pathname.endsWith('.mp3')) return 'audio/mpeg'
  if (pathname.endsWith('.wav')) return 'audio/wav'
  if (pathname.endsWith('.ogg')) return 'audio/ogg'
  return 'application/octet-stream'
}
