let worker: Worker | null = null

function initializeWorker() {
  if (typeof window !== 'undefined' && !worker) {
    worker = new Worker('/captioning.worker.js')
  }
}

export async function captionImages(
  imageDataUrls: string[]
): Promise<string[]> {
  initializeWorker()

  if (!worker) {
    throw new Error(
      'Worker could not be initialized. Are you running in a browser environment?'
    )
  }

  const captions: string[] = []

  for (const imageDataUrl of imageDataUrls) {
    const caption = await new Promise<string>((resolve, reject) => {
      const messageHandler = (event: MessageEvent) => {
        worker!.removeEventListener('message', messageHandler)
        if (event.data.error) {
          reject(new Error(event.data.error))
        } else {
          resolve(event.data.caption)
        }
      }

      worker!.addEventListener('message', messageHandler)
      worker!.postMessage({ imageDataUrl })
    })

    captions.push(caption)
  }

  return captions
}

// Optionally, you can provide a cleanup function
export function terminateWorker() {
  if (worker) {
    worker.terminate()
    worker = null
  }
}
