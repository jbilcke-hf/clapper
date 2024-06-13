import { NextResponse, NextRequest } from "next/server"
import { ClapSegmentCategory } from "@aitube/clap"

import { resolveSegment as resolveSegmentUsingHuggingFace } from "./providers/huggingface"
import { resolveSegment as resolveSegmentUsingComfyReplicate } from "./providers/comfy-replicate"
import { resolveSegment as resolveSegmentUsingReplicate } from "./providers/replicate"
import { resolveSegment as resolveSegmentUsingComfyComfyIcu } from "./providers/comfy-comfyicu"
import { resolveSegment as resolveSegmentUsingFalAi } from "./providers/falai"
import { resolveSegment as resolveSegmentUsingModelsLab } from "./providers/modelslab"
import { resolveSegment as resolveSegmentUsingStabilityAi } from "./providers/stabilityai"

import { ComputeProvider, ResolveRequest } from "@/types"

export async function POST(req: NextRequest) {
  // do we really need to secure it?
  // I mean.. in the end, the user is using their own credentials,
  // so they cannot siphon free OpenAI, HF, Replicate tokens
  // console.log(`TODO Julian: secure the endpoint`)
  // await throwIfInvalidToken(req.headers.get("Authorization"))
  const request = (await req.json()) as ResolveRequest
  
  const provider =
    request.segment.category === ClapSegmentCategory.STORYBOARD
    ? request.settings.imageProvider
    : request.segment.category === ClapSegmentCategory.VIDEO
    ? request.settings.videoProvider
    : request.segment.category === ClapSegmentCategory.DIALOGUE
    ? request.settings.voiceProvider
    : request.segment.category === ClapSegmentCategory.SOUND
    ? request.settings.soundProvider
    : request.segment.category === ClapSegmentCategory.MUSIC
    ? request.settings.musicProvider
    : null

  if (!provider) { throw new Error(`Segments of category ${request.segment.category} are not supported yet`)}

  // console.log(`API ResolveRequest = `, request.settings)
  const resolveSegment =
    provider === ComputeProvider.HUGGINGFACE
    ? resolveSegmentUsingHuggingFace
    : provider === ComputeProvider.COMFY_HUGGINGFACE
    ? resolveSegmentUsingComfyReplicate
    : provider === ComputeProvider.REPLICATE
    ? resolveSegmentUsingReplicate
    : provider === ComputeProvider.COMFY_COMFYICU
    ? resolveSegmentUsingComfyComfyIcu
    : provider === ComputeProvider.STABILITYAI
    ? resolveSegmentUsingStabilityAi
    : provider === ComputeProvider.FALAI
    ? resolveSegmentUsingFalAi
    : provider === ComputeProvider.MODELSLAB
    ? resolveSegmentUsingModelsLab
    : null

  if (!resolveSegment) { throw new Error(`Provider ${provider} is not supported yet`)}
 
  const segment = await resolveSegment(request)

  return NextResponse.json(segment)
}
