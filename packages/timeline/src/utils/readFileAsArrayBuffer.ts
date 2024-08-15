export async function readFileAsArrayBuffer(input: File | string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    if (typeof input === 'string') {
      // check if it is base64 or not
      if (/^data:.+;base64,/.test(input)) {
        const base64 = input.split(",")[1];
        const binary = window.atob(base64);
        const buffer = new ArrayBuffer(binary.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < binary.length; i++) {
          view[i] = binary.charCodeAt(i);
        }
        resolve(buffer);
        return;
      } else {
        reject('Invalid input string');
        return;
      }
    }

    let reader = new FileReader();
    reader.onload = () => {
      // when the reader has loaded, resolve the Promise with the result
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = (error) => {
      // if there's an error, reject the Promise with the error
      reject(error);
    };
    reader.readAsArrayBuffer(input as File);
  });
}
