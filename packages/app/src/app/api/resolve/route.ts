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
import { TimelineSegment } from '@aitube/timeline'

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
  resolveSegmentUsingLumaLabs,
  resolveSegmentUsingBigModel,
  resolveSegmentUsingPiApi,
  resolveSegmentUsingHotshot,
  resolveSegmentUsingCivitai,
} from './providers'

import { ResolveRequest } from '@aitube/clapper-services'
import { decodeOutput } from '@/lib/utils/decodeOutput'
import { getTypeAndExtension } from '@/lib/utils/getTypeAndExtension'
import { getMediaInfo } from '@/lib/ffmpeg/getMediaInfo'
import { getSegmentWorkflowProviderAndEngine } from '@/services/editors/workflow-editor/getSegmentWorkflowProviderAndEngine'
import { runFaceSwap as runFaceswapWithFalAi } from './providers/falai/runFaceSwap'
import { runFaceSwap as runFaceswapWithReplicate } from './providers/replicate/runFaceSwap'
import { runLipSync as runLipSyncWithReplicate } from './providers/replicate/runLipSync'

type ProviderFn = (request: ResolveRequest) => Promise<TimelineSegment>

export async function POST(req: NextRequest) {
  // do we really need to secure it?
  // I mean.. in the end, the user is using their own credentials,
  // so they cannot siphon free OpenAI, HF, Replicate tokens
  // console.log(`TODO Julian: secure the endpoint`)
  // await throwIfInvalidToken(req.headers.get("Authorization"))
  const request = (await req.json()) as ResolveRequest

  const {
    generationWorkflow,
    generationProvider,
    generationEngine,
    faceswapWorkflow,
    faceswapProvider,
    faceswapEngine,
    lipsyncWorkflow,
    lipsyncProvider,
    lipsyncEngine,
  } = getSegmentWorkflowProviderAndEngine(request)

  /*
  console.log(`Resolving a ${request.segment.category} segment using:`, {
    workflow,
    provider,
    engine,
  })
    */

  if (!generationWorkflow) {
    throw new Error(`cannot resolve a segment without a valid workflow`)
  }

  if (!generationProvider || generationProvider === ClapWorkflowProvider.NONE) {
    throw new Error(`cannot resolve a segment without a valid provider`)
  }

  if (!generationEngine) {
    throw new Error(`cannot resolve a segment without a valid engine`)
  }

  const comfyProviders: Partial<Record<ClapWorkflowProvider, ProviderFn>> = {
    [ClapWorkflowProvider.REPLICATE]: resolveSegmentUsingComfyReplicate,
    [ClapWorkflowProvider.COMFYUI]: resolveSegmentUsingComfyUI,
    [ClapWorkflowProvider.COMFYICU]: resolveSegmentUsingComfyIcu,
    [ClapWorkflowProvider.COMFYDEPLOY]: resolveSegmentUsingComfyDeploy,
  }

  const providers: Partial<Record<ClapWorkflowProvider, ProviderFn>> = {
    [ClapWorkflowProvider.HUGGINGFACE]: resolveSegmentUsingHuggingFace,
    [ClapWorkflowProvider.REPLICATE]: resolveSegmentUsingReplicate,
    [ClapWorkflowProvider.STABILITYAI]: resolveSegmentUsingStabilityAi,
    [ClapWorkflowProvider.FALAI]: resolveSegmentUsingFalAi,
    [ClapWorkflowProvider.MODELSLAB]: resolveSegmentUsingModelsLab,
    // [ClapWorkflowProvider.ELEVENLABS]: resolveSegmentUsingElevenLabs,
    [ClapWorkflowProvider.LETZAI]: resolveSegmentUsingLetzAi,
    [ClapWorkflowProvider.LUMALABS]: resolveSegmentUsingLumaLabs,
    [ClapWorkflowProvider.HOTSHOT]: resolveSegmentUsingHotshot,
    [ClapWorkflowProvider.CIVITAI]: resolveSegmentUsingCivitai,
    [ClapWorkflowProvider.BIGMODEL]: resolveSegmentUsingBigModel,
    [ClapWorkflowProvider.PIAPI]: resolveSegmentUsingPiApi,
    [ClapWorkflowProvider.AITUBE]: resolveSegmentUsingAiTube,
  }

  const resolveSegment: ProviderFn | undefined =
    generationEngine === ClapWorkflowEngine.COMFYUI_WORKFLOW
      ? comfyProviders[generationProvider] || undefined
      : providers[generationProvider] || undefined

  if (!resolveSegment || typeof resolveSegment !== 'function') {
    // console.log('invalid resolveSegment:', request)
    throw new Error(
      `Engine "${generationEngine}" is not supported by "${generationProvider}" yet. If you believe this is a mistake, please open a Pull Request (with working code) to fix it. Thank you!`
    )
  }

  let segment = request.segment

  try {
    // console.log('calling resolveSegment', request)
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
    if (typeof err?.['message'] === 'string') {
      console.error(`failed to generate a segment: ${err?.['message']}`)
    } else {
      console.error(`failed to generate a segment:`, err)
    }
    segment.assetUrl = ''
    segment.assetSourceType = ClapAssetSource.EMPTY
    segment.assetDurationInMs = 0
    segment.outputGain = 0
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  // extra step: face swap
  if (
    faceswapProvider &&
    request.settings.imageFaceswapWorkflow.data &&
    segment.assetUrl &&
    request.prompts.image.identity
  ) {
    const faceswapProviders: Partial<Record<ClapWorkflowProvider, ProviderFn>> =
      {
        [ClapWorkflowProvider.FALAI]: runFaceswapWithFalAi,
        [ClapWorkflowProvider.REPLICATE]: runFaceswapWithReplicate,
      }

    const faceSwap: ProviderFn | undefined =
      faceswapProviders[faceswapProvider] || undefined

    if (faceSwap) {
      try {
        await faceSwap(request)

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
      } catch (err) {
        console.error(`failed to run the faceswap (${err})`)
      }
    }
  }

  // extra step: lip sync
  // for this we need to have a valid video
  // (or we could use a simple image + audio model)

  const hasValidVideo =
    segment.category === ClapSegmentCategory.VIDEO && segment.assetUrl

  const firstDialogue = request.segments.find(
    (s) => s.category === ClapSegmentCategory.DIALOGUE
  )
  const hasValidAudio = firstDialogue?.assetUrl

  if (
    lipsyncProvider &&
    request.settings.videoLipsyncWorkflow.data &&
    hasValidVideo &&
    hasValidAudio
  ) {
    const lipsyncProviders: Partial<Record<ClapWorkflowProvider, ProviderFn>> =
      {
        // TODO use Fal.ai? I think they only have SadTalker?
        [ClapWorkflowProvider.REPLICATE]: runLipSyncWithReplicate,
      }

    const lipsync: ProviderFn | undefined =
      lipsyncProviders[lipsyncProvider] || undefined

    if (lipsync) {
      try {
        await lipsync(request)

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
      } catch (err) {
        console.error(`failed to run the lipsync (${err})`)
      }
    }
  }

  return NextResponse.json(segment)
}
