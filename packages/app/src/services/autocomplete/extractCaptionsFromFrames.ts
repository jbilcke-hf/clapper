// import {
//   AutoProcessor,
//   AutoTokenizer,
//   Florence2ForConditionalGeneration,
//   RawImage,
// } from '@xenova/transformers'

export const cache: {
  model?: Promise<any>
  processor?: Promise<any>
  tokenizer?: Promise<any>
} = {}

// export async function loadModel(
//   modelId: string,
//   onProgress: (progress: number) => void
// ) {
//   onProgress(0)
//   const model = await (cache.model
//     ? cache.model
//     : (cache.model = Florence2ForConditionalGeneration.from_pretrained(
//         modelId,
//         {
//           dtype: 'fp32',
//         }
//       )))

//   onProgress(33)

//   const processor = await (cache.processor
//     ? cache.processor
//     : (cache.processor = AutoProcessor.from_pretrained(modelId)))

//   onProgress(66)

//   const tokenizer = await (cache.tokenizer
//     ? cache.tokenizer
//     : (cache.tokenizer = AutoTokenizer.from_pretrained(modelId)))

//   onProgress(100)

//   return { model, processor, tokenizer }
// }

export function closeModel() {
  cache.model = undefined
  cache.processor = undefined
  cache.tokenizer = undefined
}

export async function extractCaptionsFromFrames(
  images: string[] = [],
  onProgress: (
    progress: number,
    storyboardIndex: number,
    nbStoryboards: number
  ) => any
) {
  return
}

// export async function extractCaptionsFromFrames(
//   images: string[] = [],
//   onProgress: (
//     progress: number,
//     storyboardIndex: number,
//     nbStoryboards: number
//   ) => void
// ): Promise<string[]> {
//   if (!(navigator as any).gpu) {
//     throw new Error(`Please enable WebGPU to analyze video frames:

// 1. You need a modern browser such as Google Chrome 113+, Microsoft Edge 113+, Safari 18 (macOS 15), Firefox Nightly

// 2. You need to enable WebGPU (depends on your browser, see below)

// 2.1 For Chrome: Perform the following operations in the Chrome / Microsoft Edge address bar
// The chrome://flags/#enable-unsafe-webgpu flag must be enabled (not enable-webgpu-developer-features).
// Linux experimental support also requires launching the browser with --enable-features=Vulkan.

// 2.2 For Safari 18 (macOS 15): WebGPU is enabled by default

// 2.3 For Firefox Nightly: Type about:config in the address bar and set 'dom.webgpu.enabled" to true
// `)
//   }

//   let progress = 0

//   // for code example, see:
//   // https://github.com/xenova/transformers.js/pull/545#issuecomment-2183625876

//   // Load model, processor, and tokenizer
//   const model_id = 'onnx-community/Florence-2-base-ft'

//   const { model, processor, tokenizer } = await loadModel(model_id, (p) => {
//     onProgress((progress = p * 15), 0, images.length)
//   })

//   // not all prompts will work properly, see the official examples:
//   // https://huggingface.co/microsoft/Florence-2-base-ft/blob/e7a5acc73559546de6e12ec0319cd7cc1fa2437c/processing_florence2.py#L115-L117

//   // Prepare text inputs
//   const prompts = 'Describe with a paragraph what is shown in the image.'
//   // const prompts = 'Decompose the following video frame into era, genre, location, weather, characters, and action. Give the answer in YAML.'

//   const text_inputs = tokenizer(prompts)

//   let i = 1
//   const captions: string[] = []
//   for (const imageInBase64DataUri of images) {
//     console.log('analyzing image:', imageInBase64DataUri.slice(0, 64))
//     // Prepare vision inputs
//     const image = await RawImage.fromURL(imageInBase64DataUri)
//     const vision_inputs = await processor(image)

//     console.log(' - generating caption..')
//     // Generate text
//     const generated_ids = await model.generate({
//       ...text_inputs,
//       ...vision_inputs,
//       max_new_tokens: 100,
//     })

//     // Decode generated text
//     const generated_text = tokenizer.batch_decode(generated_ids, {
//       skip_special_tokens: true,
//     })

//     const caption = `${generated_text[0] || ''}`
//     console.log(' - caption:', caption)

//     const relativeProgress = i / images.length

//     progress += relativeProgress * 75
//     onProgress(progress, i, images.length)
//     captions.push(caption)
//   }
//   return captions
// }
