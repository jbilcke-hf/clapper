import { NextResponse, NextRequest } from 'next/server'
import {
  ClapOutputType,
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
  ClapWorkflowProvider,
  ClapWorkflow,
  ClapAssetSource,
  ClapWorkflowEngine,
} from '@aitube/clap'

import {
  resolveSegmentUsingHuggingFace,
  resolveSegmentUsingComfyReplicate,
  resolveSegmentUsingReplicate,
  resolveSegmentUsingComfyIcu,
  resolveSegmentUsingComfyDeploy,
  resolveSegmentUsingFalAi,
  resolveSegmentUsingAiTube,
  resolveSegmentUsingModelsLab,
  resolveSegmentUsingStabilityAi,
  resolveSegmentUsingComfyUI,
  resolveSegmentUsingLetzAi,
  resolveSegmentUsingBigModel,
  resolveSegmentUsingPiApi,
} from './providers'

import { ResolveRequest } from '@aitube/clapper-services'
import { decodeOutput } from '@/lib/utils/decodeOutput'
import { getTypeAndExtension } from '@/lib/utils/getTypeAndExtension'
import { getMediaInfo } from '@/lib/ffmpeg/getMediaInfo'

export async function POST(req: NextRequest) {
  // do we really need to secure it?
  // I mean.. in the end, the user is using their own credentials,
  // so they cannot siphon free OpenAI, HF, Replicate tokens
  // console.log(`TODO Julian: secure the endpoint`)
  // await throwIfInvalidToken(req.headers.get("Authorization"))
  const request = (await req.json()) as ResolveRequest

  const workflow: ClapWorkflow | undefined =
    request.segment.category === ClapSegmentCategory.STORYBOARD
      ? request.settings.imageGenerationWorkflow
      : request.segment.category === ClapSegmentCategory.VIDEO
        ? request.settings.videoGenerationWorkflow
        : request.segment.category === ClapSegmentCategory.DIALOGUE
          ? request.settings.voiceGenerationWorkflow
          : request.segment.category === ClapSegmentCategory.SOUND
            ? request.settings.soundGenerationWorkflow
            : request.segment.category === ClapSegmentCategory.MUSIC
              ? request.settings.musicGenerationWorkflow
              : undefined

  if (!workflow) {
    throw new Error(`request to /api/resolve is missing the .workflow field`)
  }

  const provider: ClapWorkflowProvider | undefined =
    workflow.provider || undefined

  if (!provider) {
    throw new Error(`request to /api/resolve is missing the .provider field`)
  }

  const engine: ClapWorkflowEngine | undefined = workflow.engine || undefined

  if (!engine) {
    throw new Error(`request to /api/resolve is missing the .engine field`)
  }

  // console.log(`API ResolveRequest = `, request.settings)
  const resolveSegment =
    engine === ClapWorkflowEngine.COMFYUI_WORKFLOW
      ? provider === ClapWorkflowProvider.REPLICATE
        ? resolveSegmentUsingComfyReplicate
        : provider === ClapWorkflowProvider.COMFYUI
          ? resolveSegmentUsingComfyUI
          : provider === ClapWorkflowProvider.COMFYICU
            ? resolveSegmentUsingComfyIcu
            : provider === ClapWorkflowProvider.COMFYDEPLOY
              ? resolveSegmentUsingComfyDeploy
              : null
      : provider === ClapWorkflowProvider.HUGGINGFACE
        ? resolveSegmentUsingHuggingFace
        : provider === ClapWorkflowProvider.REPLICATE
          ? resolveSegmentUsingReplicate
          : provider === ClapWorkflowProvider.STABILITYAI
            ? resolveSegmentUsingStabilityAi
            : provider === ClapWorkflowProvider.FALAI
              ? resolveSegmentUsingFalAi
              : provider === ClapWorkflowProvider.MODELSLAB
                ? resolveSegmentUsingModelsLab
                : provider === ClapWorkflowProvider.LETZAI
                  ? resolveSegmentUsingLetzAi
                  : provider === ClapWorkflowProvider.BIGMODEL
                    ? resolveSegmentUsingBigModel
                    : provider === ClapWorkflowProvider.PIAPI
                      ? resolveSegmentUsingPiApi
                      : provider === ClapWorkflowProvider.AITUBE
                        ? resolveSegmentUsingAiTube
                        : null

  if (!resolveSegment) {
    throw new Error(
      `Engine "${engine}" is not supported by "${provider}" yet. If you believe this is a mistake, please open a Pull Request (with working code) to fix it. Thank you!`
    )
  }

  let segment = request.segment

  try {
    segment = await resolveSegment(request)

    // we clean-up and parse the output from all the resolvers:
    // this will download files hosted on CDNs, convert WAV files to MP3 etc

    segment.assetUrl = await decodeOutput(segment.assetUrl)

    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)

    segment.status = ClapSegmentStatus.COMPLETED

    const { assetFileFormat, outputType } = getTypeAndExtension(
      segment.assetUrl
    )

    segment.assetFileFormat = assetFileFormat
    segment.outputType = outputType

    if (
      segment.outputType === ClapOutputType.AUDIO ||
      segment.outputType === ClapOutputType.VIDEO
    ) {


      // TODO this should be down in the browser side, so that we can scale better
      const { durationInMs, hasAudio } = await getMediaInfo(segment.assetUrl)
      segment.assetDurationInMs = durationInMs

      // hasAudio doesn't work properly I think, with small samples
      segment.outputGain = hasAudio ? 1.0 : 0.0

      /*
      console.log(`DEBUG:`, {
        durationInMs,
        hasAudio,
        "segment.assetDurationInMs":  segment.assetDurationInMs,
        "segment.outputGain": segment.outputGain,
      })
        */
    }
  } catch (err) {
    console.error(`failed to generate a segment: ${err}`)
    segment.assetUrl = ''
    segment.assetSourceType = ClapAssetSource.EMPTY
    segment.assetDurationInMs = 0
    segment.outputGain = 0
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return NextResponse.json(segment)
}
