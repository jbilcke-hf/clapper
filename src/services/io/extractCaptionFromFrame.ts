import {
  AutoProcessor,
  AutoTokenizer,
  Moondream1ForConditionalGeneration,
  RawImage,
} from '@xenova/transformers'

export async function extractCaptionFromFrame(
  imageInBase64DataUri: string
): Promise<string> {
  if (!(navigator as any).gpu) {
    throw new Error(`Please enable WebGPU to analyze video frames:
    
1. You need a modern browser such as Google Chrome 113+, Microsoft Edge 113+, Safari 18 (macOS 15), Firefox Nightly

2. You need to enable WebGPU (depends on your browser, see below)

2.1 For Chrome: Perform the following operations in the Chrome / Microsoft Edge address bar
The chrome://flags/#enable-unsafe-webgpu flag must be enabled (not enable-webgpu-developer-features). Linux experimental support also requires launching the browser with --enable-features=Vulkan.

2.2 For Safari 18 (macOS 15): WebGPU is enabled by default

2.3 For Firefox Nightly: Type about:config in the address bar and set 'dom.webgpu.enabled" to true
`)
  }

  // Load processor, tokenizer and model
  const model_id = 'Xenova/moondream2'
  const processor = await AutoProcessor.from_pretrained(model_id)
  const tokenizer = await AutoTokenizer.from_pretrained(model_id)
  const model = await Moondream1ForConditionalGeneration.from_pretrained(
    model_id,
    {
      dtype: {
        embed_tokens: 'fp16', // or 'fp32'
        vision_encoder: 'fp16', // or 'q8'
        decoder_model_merged: 'q4', // or 'q4f16' or 'q8'
      },
      device: 'webgpu',
    }
  )

  // Prepare text inputs
  const prompt = 'Describe this image.'
  const text = `<image>\n\nQuestion: ${prompt}\n\nAnswer:`
  const text_inputs = tokenizer(text)

  // Prepare vision inputs
  const image = await RawImage.fromURL(imageInBase64DataUri)
  const vision_inputs = await processor(image)

  // Generate response
  const output = await model.generate({
    ...text_inputs,
    ...vision_inputs,
    do_sample: false,
    max_new_tokens: 177,
  })
  const decoded = tokenizer.batch_decode(output, { skip_special_tokens: false })
  console.log(decoded)
  // [
  //     '<|endoftext|><image>\n\n' +
  //     'Question: Describe this image.\n\n' +
  //     'Answer: A hand is holding a white book titled "The Little Book of Deep Learning" against a backdrop of a balcony with a railing and a view of a building and trees.<|endoftext|>'
  // ]

  return `${decoded[0] || ''}`
}
