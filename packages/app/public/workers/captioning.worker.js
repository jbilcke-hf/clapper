importScripts('https://cdn.jsdelivr.net/npm/@xenova/transformers@3.0.0');

const { AutoProcessor, AutoTokenizer, Moondream1ForConditionalGeneration, RawImage } = transformers;

let processor;
let tokenizer;
let model;

async function initializeModel() {
  const model_id = 'Xenova/moondream2';
  processor = await AutoProcessor.from_pretrained(model_id);
  tokenizer = await AutoTokenizer.from_pretrained(model_id);
  model = await Moondream1ForConditionalGeneration.from_pretrained(model_id, {
    dtype: {
      embed_tokens: 'fp16',
      vision_encoder: 'fp16',
      decoder_model_merged: 'q4',
    },
    device: 'webgpu',
  });
}

async function captionImage(imageDataUrl) {
  if (!processor || !tokenizer || !model) {
    await initializeModel();
  }

  const prompt = 'Describe this image.';
  const text = `<image>\n\nQuestion: ${prompt}\n\nAnswer:`;
  const text_inputs = tokenizer(text);

  const image = await RawImage.fromURL(imageDataUrl);
  const vision_inputs = await processor(image);

  const output = await model.generate({
    ...text_inputs,
    ...vision_inputs,
    do_sample: false,
    max_new_tokens: 64,
  });

  const decoded = tokenizer.batch_decode(output, { skip_special_tokens: true });
  return decoded[0].trim();
}

self.addEventListener('message', async (event) => {
  const { imageDataUrl } = event.data;
  try {
    const caption = await captionImage(imageDataUrl);
    self.postMessage({ caption });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
});