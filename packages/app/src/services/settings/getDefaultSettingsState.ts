import { RenderingStrategy } from '@aitube/timeline'
import { ComfyIcuAccelerator, SettingsState } from '@aitube/clapper-services'

import { defaultWorkflowForImages } from './workflows/image'
import { defaultWorkflowForVideos } from './workflows/video'

export function getDefaultSettingsState(): SettingsState {
  const state: SettingsState = {
    comfyUiClientId: 'clapper',
    comfyUiHttpAuthLogin: '',
    comfyUiHttpAuthPassword: '',
    replicateApiKey: '',
    comfyIcuApiKey: '',
    comfyIcuAccelerator: ComfyIcuAccelerator.L4,
    comfyDeployApiKey: '',
    huggingFaceApiKey: '',
    modelsLabApiKey: '',
    falAiApiKey: '',
    clapperApiKey: '',
    aiTubeApiKey: '',
    openaiApiKey: '',
    googleApiKey: '',
    groqApiKey: '',
    anthropicApiKey: '',
    elevenLabsApiKey: '',
    kitsAiApiKey: '',
    cohereApiKey: '',
    mistralAiApiKey: '',
    stabilityAiApiKey: '',
    fireworksAiApiKey: '',
    letzAiApiKey: '',
    bigModelApiKey: '',
    piApiApiKey: '',
    civitaiApiKey: '',
    hotshotApiKey: '',

    broadcastObsServerHost: '192.168.1.22',
    broadcastObsServerPort: 4455,
    broadcastObsServerPass: '',

    censorNotForAllAudiencesContent: false,

    imagePromptPrefix: 'screencap',
    imagePromptSuffix: 'high quality, beautiful, amazing, intricate details',
    imageNegativePrompt:
      'black banding, ugly, imperfect, cropped, low resolution',
    videoPromptPrefix: 'screencap',
    videoPromptSuffix: 'high quality, beautiful, amazing, intricate details',
    videoNegativePrompt:
      'black banding, ugly, imperfect, cropped, low resolution',

    assistantWorkflow: '',
    assistantTurboWorkflow: '',
    imageGenerationWorkflow: '',
    imageGenerationTurboWorkflow: '',
    imageFaceswapWorkflow: '',
    imageUpscalingWorkflow: '',
    imageDepthWorkflow: '',
    imageSegmentationWorkflow: '',
    videoGenerationWorkflow: '',
    videoFaceswapWorkflow: '',
    videoLipsyncWorkflow: '',
    videoUpscalingWorkflow: '',
    videoDepthWorkflow: '',
    videoSegmentationWorkflow: '',
    soundGenerationWorkflow: '',
    voiceGenerationWorkflow: '',
    musicGenerationWorkflow: '',

    imageRenderingStrategy: RenderingStrategy.ON_DEMAND,
    imageUpscalingRenderingStrategy: RenderingStrategy.ON_DEMAND,
    imageDepthRenderingStrategy: RenderingStrategy.ON_DEMAND,
    imageSegmentationRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoUpscalingRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoDepthRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoSegmentationRenderingStrategy: RenderingStrategy.ON_DEMAND,
    voiceRenderingStrategy: RenderingStrategy.ON_DEMAND,
    soundRenderingStrategy: RenderingStrategy.ON_DEMAND,
    musicRenderingStrategy: RenderingStrategy.ON_DEMAND,

    maxImagesToGenerateInParallel: 1,
    maxVideosToGenerateInParallel: 1,

    comfyClapWorkflowForImage: defaultWorkflowForImages,
    comfyClapWorkflowForVideo: defaultWorkflowForVideos,
    comfyWorkflowForVoice: '{}',
    comfyWorkflowForSound: '{}',
    comfyWorkflowForMusic: '{}',

    comfyUiApiUrl: 'http://localhost:8188',

    // those are not designed for Hugging Face specifically,
    // but to be compatible with any Gradio API URL that the
    // user would set manually (eg. running on localhost)
    gradioApiUrlForAssistant: '',
    gradioApiUrlForImage: '',
    gradioApiUrlForVideo: '',
    gradioApiUrlForVoice: '',
    gradioApiUrlForSound: '',
    gradioApiUrlForMusic: '',

    scriptEditorShowLineNumbers: true,
    scriptEditorShowMinimap: true,
    interfaceSnapWindowsToGrid: true,

    /******** should we deprecated all of those? or convert to defaults? ******
     * 
    // now how we prefix everything with "models"
    // that's because it will be possible at some point to also
    // call a space eg. spaces/openai/sora (this one is just a silly example, of course)
    // "models/HuggingFaceH4/zephyr-7b-beta"
    // "models/mistralai/Mixtral-8x7B-Instruct-v0.1",

    huggingFaceModelForAssistant: "models/mistralai/Mixtral-8x7B-Instruct-v0.1",
    huggingFaceModelForImage: "models/sd-community/sdxl-flash",
    huggingFaceModelForImageDepth: "",
    huggingFaceModelForImageSegmentation: "",
    huggingFaceModelForImageUpscaling: "",

    // huggingFaceModelForVideo: "spaces/jbilcke-hf/hallo-api",
    huggingFaceModelForVideo: "spaces/hpcai-tech/open-sora",
    huggingFaceModelForVideoDepth: "",
    huggingFaceModelForVideoSegmentation: "",
    huggingFaceModelForVideoUpscaling: "",

    huggingFaceModelForVoice: "",
    huggingFaceModelForSound: "",
    huggingFaceModelForMusic: "",
  
    replicateModelForImage: "chenxwh/sdxl-flash:001bb81139b01780380407b4106ac681df46108e002eafbeb9ccb2d8faca42e1",
    replicateModelForImageDepth: "",
    replicateModelForImageSegmentation: "",
    replicateModelForImageUpscaling: "",
    
    // note: this model doesn't support width and height parameters
    replicateModelForVideo: "camenduru/animatediff-lightning-4-step:be39c6d599942831314b770f03cfd062bfd0faa8cc52e9289bcce830b721fcb6",
    replicateModelForVideoDepth: "",
    replicateModelForVideoSegmentation: "",
    replicateModelForVideoUpscaling: "",
    
    replicateModelForVoice: "lucataco/xtts-v2",
    replicateModelForSound: "sepal/audiogen",
    replicateModelForMusic: "meta/musicgen",
  
    stabilityAiModelForImage: "",
    stabilityAiModelForVideo: "",
    stabilityAiModelForVoice: "",
    stabilityAiModelForSound: "",
    stabilityAiModelForMusic: "",
  
    fireworksAiModelForAssistant: "",
    fireworksAiModelForImage: "stability/sd3",
    fireworksAiModelForVideo: "",
    fireworksAiModelForVoice: "",
    fireworksAiModelForSound: "",
    fireworksAiModelForMusic: "",
  
    falAiModelForImage: "fal-ai/fast-sdxl", // "fal-ai/fast-lightning-sdxl",
    falAiModelForImageDepth: "",
    falAiModelForImageSegmentation: "",
    falAiModelForImageUpscaling: "",
    falAiModelForVideo: "fal-ai/stable-video",
    falAiModelForVoice: "fal-ai/metavoice-v1",
    falAiModelForSound: "fal-ai/stable-audio",
    falAiModelForMusic: "fal-ai/stable-audio",
  
    modelsLabModelForImage: "",
    modelsLabModelForVideo: "",
    modelsLabModelForVoice: "",
    modelsLabModelForSound: "",
    modelsLabModelForMusic: "",

    openaiModelForAssistant: "gpt-4o-mini",
    openaiModelForImage: "dall-e-3",
    openaiModelForVideo: "sora",
    openaiModelForVoice: "v1",

    groqModelForAssistant: "mixtral-8x7b-32768",
  
    googleModelForAssistant: "gemini-1.5-pro-001",
    googleModelForImage: "imagen",
    googleModelForVideo: "veo",
    googleModelForVoice: "v1",
    googleModelForMusic: "MusicLM",


    // Claud 3 stats:
    // Context window	200K*
    // *~150K words, ~680K unicode characters
    // Max output	4096 tokens
    anthropicModelForAssistant: "claude-3-5-sonnet-20240620",

    elevenLabsModelForVoice: "v1",
    elevenLabsModelForSound: "v1",

    kitsAiModelForVoice: "",
    cohereModelForAssistant: "command-r-plus",
    mistralAiModelForAssistant: "open-mixtral-8x22b"

    */
  }
  return state
}
