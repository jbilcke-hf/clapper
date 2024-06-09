

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      // when the reader has loaded, resolve the Promise with the result
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = (error) => {
      // if there's an error, reject the Promise with the error
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}