
/**
 * Convert a Data URI to a Blob
 * 
 * @param dataURI 
 * @param defaultContentType (Optional) you can pass a default content
 * @returns 
 */
export function dataUriToBlob(dataURI = "", defaultContentType = ""): Blob {
  dataURI = dataURI.replace(/^data:/, '');

  const type = dataURI.match(/(?:image|application|video|audio|text)\/[^;]+/)?.[0] || defaultContentType;
  const base64 = dataURI.replace(/^[^,]+,/, '');
  const arrayBuffer = new ArrayBuffer(base64.length);
  const typedArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < base64.length; i++) {
    typedArray[i] = base64.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type });
}