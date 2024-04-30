import sharp from "sharp"

export type ResizeImageParams = {
  input: string
  width?: number
  height?: number
  debug?: boolean
  asBase64?: boolean // TODO: not implemented yet!
};

/**
 * Resize an image to a given width and height.
 * The input image can be a file path or a data URI (base64)
 * The image ratio will be preserved if only one side is given.
 * The image format (WebP, Jpeg, PNG) will be preserved.
 * This function always return a base64 string (data URI with the mime type)
 * 
 * @param param0 
 * @returns 
 */
export async function resizeImage({ input, width, height, debug, asBase64 }: ResizeImageParams): Promise<string> {
  let inputBuffer: Buffer;

  // Test if input is a data URI
  const dataUriPattern = /^data:([a-zA-Z]+\/[a-zA-Z]+);base64,(.*)$/;
  const matches = input.match(dataUriPattern);

  if (matches) {
    const [, mimeType, base64Data] = matches;
    if (!/^image\/(png|jpeg|webp)$/.test(mimeType)) {
      throw new Error(`Unsupported image format. Expected PNG, JPEG, or WebP.`);
    }
    inputBuffer = Buffer.from(base64Data, "base64");
  } else {
    // Assuming input is a file path
    inputBuffer = await sharp(input).toBuffer();
  }

  const sharpInstance = sharp(inputBuffer)
    .resize(width, height, {
      fit: "inside",
      withoutEnlargement: true
    });

  const outputBuffer = await sharpInstance.toBuffer();
  const outputMimeType = await sharpInstance.metadata().then(meta => meta.format);
  
  if (!outputMimeType) {
    throw new Error("Failed to determine the image mime type after resizing.");
  }

  const prefix = `data:image/${outputMimeType};base64,`;
  const outputBase64 = outputBuffer.toString("base64");
  return `${prefix}${outputBase64}`;
}