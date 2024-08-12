import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  ClapSegmentStatus,
  generateSeed,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import {
  CallWrapper,
  ComfyApi,
  PromptBuilder,
  TSamplerName,
  TSchedulerName,
} from '@saintno/comfyui-sdk'

import { getWorkflowInputValues } from '../getWorkflowInputValues'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyUiClientId) {
    throw new Error(`Missing client id for "ComfyUI"`)
  }

  const segment: TimelineSegment = { ...request.segment }

  // for API doc please see:
  // https://github.com/tctien342/comfyui-sdk/blob/main/examples/example-t2i.ts
  const api = new ComfyApi(
    request.settings.comfyUiApiUrl || 'http://localhost:8189'
  ).init()

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {

    const comfyApiWorkflow = JSON.parse(
      request.settings.imageGenerationWorkflow.data
    )

    const txt2ImgPrompt = new PromptBuilder(
      comfyApiWorkflow,
      // TODO: this list should be detect/filled automatically (see line 86)
      [
        'positive',
        'negative',
        'checkpoint',
        'seed',
        'batch',
        'step',
        'cfg',
        'sampler',
        'sheduler',
        'width',
        'height',
      ],
      // TODO: this list should be detect/filled automatically (see line 86)
      ['images']
    )
      // TODO: those input sets should be detect/filled automatically (see line 86)
      .setInputNode('checkpoint', '4.inputs.ckpt_name')
      .setInputNode('seed', '3.inputs.seed')
      .setInputNode('batch', '5.inputs.batch_size')
      .setInputNode('negative', '7.inputs.text')
      .setInputNode('positive', '6.inputs.text')
      .setInputNode('cfg', '3.inputs.cfg')
      .setInputNode('sampler', '3.inputs.sampler_name')
      .setInputNode('sheduler', '3.inputs.scheduler')
      .setInputNode('step', '3.inputs.steps')
      .setInputNode('width', '5.inputs.width')
      .setInputNode('height', '5.inputs.height')
      .setOutputNode('images', '9')

    const workflow = txt2ImgPrompt
      // TODO: this mapping should be detect/filled automatically (see line 86)
      .input('checkpoint', 'SDXL/realvisxlV40_v40LightningBakedvae.safetensors')
      .input('seed', generateSeed())
      .input('step', 6)
      .input('cfg', 1)
      .input<TSamplerName>('sampler', 'dpmpp_2m_sde_gpu')
      .input<TSchedulerName>('sheduler', 'sgm_uniform')
      .input('width', request.meta.width)
      .input('height', request.meta.height)
      .input('batch', 1)
      .input('positive', request.prompts.image.positive)

    // for the moment we only have non-working "mock" sample code,
    // to fully implement the comfyui client, we need to work on a system
    // to automatically detect the architecture of the workflow, its parameters,
    // the default values, and fill them
    //
    // to make things easier, we are going to assume that the ClapWorkflow object
    // is 100% correctly defined, and that we can rely on `inputFields` and `inputValues`
    //
    // that way, the responsibility of automatically identifying the inputs from a raw JSON workflow 
    // (eg. coming from OpenArt.ai) will be done by a separate pre-processing code

    const inputFields =
    request.settings.imageGenerationWorkflow.inputFields || []

  // since this is a random "wild" workflow, it is possible
  // that the field name is a bit different
  // we try to look into the workflow input fields
  // to find the best match
  const promptFields = [
    inputFields.find((f) => f.id === 'prompt'), // exactMatch,
    inputFields.find((f) => f.id.includes('prompt')), // similarName,
    inputFields.find((f) => f.type === 'string'), // similarType
  ].filter((x) => typeof x !== 'undefined')

  const promptField = promptFields[0]
  if (!promptField) {
    throw new Error(
      `this workflow doesn't seem to have a parameter called "prompt"`
    )
  }

    // TODO: modify the serialized workflow payload
    // to inject our params:
    // ...getWorkflowInputValues(request.settings.imageGenerationWorkflow),
    // [promptField.id]: request.prompts.image.positive,

    const pipeline = new CallWrapper<typeof workflow>(api, workflow)
      .onPending(() => console.log('Task is pending'))
      .onStart(() => console.log('Task is started'))
      .onPreview((blob) => console.log(blob))
      .onFinished((data) => {
        console.log(
          data.images?.images.map((img: any) => api.getPathImage(img))
        )
      })
      .onProgress((info) =>
        console.log('Processing node', info.node, `${info.value}/${info.max}`)
      )
      .onFailed((err) => console.log('Task is failed', err))

    const result = await pipeline.run()

    console.log(`result:`, result)
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "ComfyUI". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
