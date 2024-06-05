import { NextResponse, NextRequest } from "next/server"

import { renderSegment as renderSegmentUsingHuggingFace } from "./providers/huggingface"
import { renderSegment as renderSegmentUsingComfyReplicate } from "./providers/comfy-replicate"
import { renderSegment as renderSegmentUsingReplicate } from "./providers/replicate"
import { renderSegment as renderSegmentUsingComfyComfyIcu } from "./providers/comfy-comfyicu"
import { renderSegment as renderSegmentUsingFalAi } from "./providers/falai"
import { renderSegment as renderSegmentUsingModelsLab } from "./providers/modelslab"

import { ComputeProvider, RenderRequest } from "@/types"
import { ClapSegmentCategory } from "@aitube/clap"

export async function POST(req: NextRequest) {
  // do we really need to secure it?
  // I mean.. in the end, the user is using their own credentials,
  // so they cannot siphon free OpenAI, HF, Replicate tokens
  console.log(`TODO Julian: secure the endpoint`)
  // await throwIfInvalidToken(req.headers.get("Authorization"))
  const request = (await req.json()) as RenderRequest
  
  const provider =
    request.segment.category === ClapSegmentCategory.STORYBOARD
    ? request.settings.storyboardProvider
    : request.segment.category === ClapSegmentCategory.VIDEO
    ? request.settings.videoProvider
    : request.segment.category === ClapSegmentCategory.DIALOGUE
    ? request.settings.speechProvider
    : request.segment.category === ClapSegmentCategory.SOUND
    ? request.settings.soundProvider
    : request.segment.category === ClapSegmentCategory.MUSIC
    ? request.settings.musicProvider
    : null

  if (!provider) { throw new Error(`Segments of category ${request.segment.category} are not supported yet`)}

  const renderSegment =
    provider === ComputeProvider.HUGGINGFACE
    ? renderSegmentUsingHuggingFace
    : provider === ComputeProvider.COMFY_HUGGINGFACE
    ? renderSegmentUsingComfyReplicate
    : provider === ComputeProvider.REPLICATE
    ? renderSegmentUsingReplicate
    : provider === ComputeProvider.COMFY_COMFYICU
    ? renderSegmentUsingComfyComfyIcu
    : provider === ComputeProvider.FALAI
    ? renderSegmentUsingFalAi
    : provider === ComputeProvider.MODELSLAB
    ? renderSegmentUsingModelsLab
    : null

  if (!renderSegment) { throw new Error(`Provider ${provider} is not supported yet`)}
 
  const segment = await renderSegment(request)

  return NextResponse.json(segment)
}
