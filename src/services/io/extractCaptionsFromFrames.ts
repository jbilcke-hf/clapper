import {
  AutoProcessor,
  AutoTokenizer,
  Florence2ForConditionalGeneration,
  RawImage,
} from '@xenova/transformers'

export async function extractCaptionsFromFrames(
  images: string[] = [],
  onProgress: (
    progress: number,
    storyboardIndex: number,
    nbStoryboards: number
  ) => void
): Promise<string[]> {
  if (!(navigator as any).gpu) {
    throw new Error(`Please enable WebGPU to analyze video frames:
    
1. You need a modern browser such as Google Chrome 113+, Microsoft Edge 113+, Safari 18 (macOS 15), Firefox Nightly

2. You need to enable WebGPU (depends on your browser, see below)

2.1 For Chrome: Perform the following operations in the Chrome / Microsoft Edge address bar
The chrome://flags/#enable-unsafe-webgpu flag must be enabled (not enable-webgpu-developer-features).
Linux experimental support also requires launching the browser with --enable-features=Vulkan.

2.2 For Safari 18 (macOS 15): WebGPU is enabled by default

2.3 For Firefox Nightly: Type about:config in the address bar and set 'dom.webgpu.enabled" to true
`)
  }

  let progress = 0
  onProgress(progress, 0, images.length)
  // for code example, see:
  // https://github.com/xenova/transformers.js/pull/545#issuecomment-2183625876

  // Load model, processor, and tokenizer
  const model_id = 'onnx-community/Florence-2-base-ft'
  const model = await Florence2ForConditionalGeneration.from_pretrained(
    model_id,
    {
      dtype: 'fp32',
    }
  )

  onProgress((progress = 5), 0, images.length)

  const processor = await AutoProcessor.from_pretrained(model_id)

  onProgress((progress = 10), 0, images.length)

  const tokenizer = await AutoTokenizer.from_pretrained(model_id)

  onProgress((progress = 15), 0, images.length)

  // not all prompts will work properly, see the official examples:
  // https://huggingface.co/microsoft/Florence-2-base-ft/blob/e7a5acc73559546de6e12ec0319cd7cc1fa2437c/processing_florence2.py#L115-L117

  // Prepare text inputs
  const prompts = 'Describe with a paragraph what is shown in the image.'
  const text_inputs = tokenizer(prompts)

  let i = 1
  const captions: string[] = []
  for (const imageInBase64DataUri of images) {
    console.log('analyzing image:', imageInBase64DataUri.slice(0, 64))
    // Prepare vision inputs
    const image = await RawImage.fromURL(imageInBase64DataUri)
    const vision_inputs = await processor(image)

    console.log(' - generating caption..')
    // Generate text
    const generated_ids = await model.generate({
      ...text_inputs,
      ...vision_inputs,
      max_new_tokens: 100,
    })

    // Decode generated text
    const generated_text = tokenizer.batch_decode(generated_ids, {
      skip_special_tokens: true,
    })

    const caption = `${generated_text[0] || ''}`
    console.log(' - caption:', caption)

    const relativeProgress = i / images.length

    progress += relativeProgress * 75
    onProgress(progress, i, images.length)
    captions.push(caption)
  }
  return captions
}
