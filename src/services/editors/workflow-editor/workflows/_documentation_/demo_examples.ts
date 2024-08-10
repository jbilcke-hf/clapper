/*


  This file is just a documented example, so that you can understand
  the purpose of the workflow format.


*/

// a workflow is a core concept within the OpenClap format itself
// (a .clap file can contain a workflow)
import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

// some parameters keep reappering from one workflow to another
// for this purpose I've put some common params in defaultValues.ts
import { genericPrompt } from '../common/defaultValues'

// always use ClapWorkflow to validate your types,
// it will save you headaches
const justAnExample_DoNotUseThis: ClapWorkflow[] = [
  {
    // a workflow ID must be unique across ALL the workflow database
    // if you want to be safe, you can generate a UUID, but this has to be
    // done once and for all (ie. you cannot do `id: generateUUID()` or else
    // the user will lose their settings each time they restart the app)
    id: '<something globally unique>',

    // this is a human-readable label, shown in the UI
    label: 'My Workflow',

    // this is a longer description. We don't show it yet,
    // but it could be in a tooltip eg. when hover a small (i) icon
    description: 'It does this and that',

    // tags useable to search and filter.
    // this will be used once we pull workflows from a communit database
    tags: ['image', 'character', 'realistic'],

    // the author(s) - might be long if there is the original research team,
    // the person who adapted the model etc
    author: 'Weyland Yutani',

    // a screenshot preview of the thumbnail
    thumbnailUrl: '',

    // the engine used for this workflow
    engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,

    // platform and/or cloud service provider
    provider: ClapWorkflowProvider.COMFY_COMFYICU,

    // type of workflow (this is important)
    category: ClapWorkflowCategory.IMAGE_GENERATION,

    // if this is a REST_API engine this can be any kind of identifier,
    // like an ID or a URL path eg. "fal-ai/something"
    //
    // if this is a workflow engine this will typically be a JSON
    // containing the workflow, serialized so it can fit in a string
    data: '{"5":{"inputs":{"width":1024,"height":1024,"batch_size":1},"class_type":"EmptyLatentImage"},"6":{"inputs":{"clip":["11",0],"text":"detailed cinematic dof render of an old dusty detailed CRT monitor on a wooden desk in a dim room with items around, messy dirty room. On the screen are the letters "FLUX Schnell" glowing softly. High detail hard surface render"},"class_type":"CLIPTextEncode"},"8":{"inputs":{"vae":["10",0],"samples":["13",0]},"class_type":"VAEDecode"},"9":{"inputs":{"images":["8",0],"filename_prefix":"ComfyUI"},"class_type":"SaveImage"},"10":{"inputs":{"vae_name":"flux1-ae.safetensors"},"class_type":"VAELoader"},"11":{"inputs":{"type":"flux","clip_name1":"t5xxl_fp16.safetensors","clip_name2":"clip_l.safetensors"},"class_type":"DualCLIPLoader"},"12":{"inputs":{"unet_name":"flux1-schnell.safetensors","weight_dtype":"default"},"class_type":"UNETLoader"},"13":{"inputs":{"noise":["25",0],"guider":["22",0],"sigmas":["17",0],"sampler":["16",0],"latent_image":["5",0]},"class_type":"SamplerCustomAdvanced"},"16":{"inputs":{"sampler_name":"euler"},"class_type":"KSamplerSelect"},"17":{"inputs":{"model":["12",0],"steps":4,"denoise":1,"scheduler":"simple"},"class_type":"BasicScheduler"},"22":{"inputs":{"model":["12",0],"conditioning":["6",0]},"class_type":"BasicGuider"},"25":{"inputs":{"noise_seed":24016052484185},"class_type":"RandomNoise"}}',

    // this describe the parameters of the workflow
    // this should be as close as possible to the actual parameters
    // of the workflow (eg. this could come from some kind of registry, community website API etc)
    inputFields: [
      genericPrompt,
      {
        id: 'custom_field',
        label: 'Custom field',
        description: 'A field unique to this workflow',
        type: 'number',
        minValue: 0,
        maxValue: 1,

        // this is the original default value, as recommended by the author
        // it is not supposed to be changed (ideally, it would come from an API etc)
        // so please do not touch this as there is a dedicated way to override values
        // (see below, in "inputValues: {}")
        defaultValue: 0.03,
      },
    ],

    // this is where we can get creative and override the recommende default values,
    // using values suggested by the Clapper teap
    inputValues: {
      // if you are fine with the original default value,
      // you don't actually need to do this
      //
      // if you see me doing this in the code, that is just
      // as a placeholder, in case we want to tweak the value
      // [genericPrompt.id]: genericPrompt.defaultValue,

      custom_field: 0.042, // <-- a value curated/suggested by Clapper
    },
  },
]
