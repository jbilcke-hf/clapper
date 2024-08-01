import { decode, encode } from 'base64-arraybuffer'
import { PNG } from 'pngjs'

import {
  Filter,
  FilterParams,
  FilterWithParams,
} from '@aitube/clapper-services'

export async function validateInput(dataUri: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = dataUri
  })
}

type RunFilterPipelineParams = {
  images: Array<{ image: string; depthMap?: string }>
  filters: FilterWithParams[]
  debug?: boolean
}

let debounceTimer: NodeJS.Timeout | null = null
let lastCallParams: RunFilterPipelineParams | null = null

export function debouncedRunFilterPipeline(
  params: RunFilterPipelineParams,
  delay: number = 200
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    lastCallParams = params

    debounceTimer = setTimeout(async () => {
      try {
        if (lastCallParams) {
          const result = await runFilterPipeline(lastCallParams)
          resolve(result)
        } else {
          reject(new Error('No parameters available for execution'))
        }
      } catch (error) {
        reject(error)
      } finally {
        debounceTimer = null
        lastCallParams = null
      }
    }, delay)
  })
}

export async function runFilterPipeline({
  images,
  filters,
  debug = false,
}: RunFilterPipelineParams): Promise<string[]> {
  if (debug) {
    console.log('Starting filter pipeline')
  }

  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported in this browser.')
  }

  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) {
    throw new Error('Failed to get GPU adapter.')
  }

  const device = await adapter.requestDevice()
  if (!device) {
    throw new Error('Failed to get GPU device.')
  }

  const processedImages: string[] = []

  for (const { image, depthMap } of images) {
    if (debug) {
      console.log('Processing image:', image.slice(0, 50) + '...')
    }

    if (!(await validateInput(image))) {
      throw new Error('Invalid input image')
    }

    const imgData = await loadImage(image)
    if (debug) {
      console.log(
        'Image loaded, dimensions:',
        imgData.width,
        'x',
        imgData.height
      )
    }

    let texture = device.createTexture({
      size: [imgData.width, imgData.height, 1],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.STORAGE_BINDING,
    })

    device.queue.writeTexture(
      { texture },
      imgData.data,
      { bytesPerRow: imgData.width * 4 },
      { width: imgData.width, height: imgData.height }
    )

    let depthTexture: GPUTexture | null = null
    if (depthMap) {
      const depthImgData = await loadImage(depthMap)
      depthTexture = device.createTexture({
        size: [depthImgData.width, depthImgData.height, 1],
        format: 'r8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      })

      device.queue.writeTexture(
        { texture: depthTexture },
        depthImgData.data,
        { bytesPerRow: depthImgData.width },
        { width: depthImgData.width, height: depthImgData.height }
      )
    }

    for (const { filter, parameters } of filters) {
      if (debug) {
        console.log('Applying filter:', filter.id)
      }
      texture = await applyFilter(
        device,
        texture,
        depthTexture,
        filter,
        parameters
      )
    }

    // In your main processing function
    const resultBuffer = await readTextureToBuffer(device, texture)
    if (debug) {
      console.log('Result buffer size:', resultBuffer.byteLength)
    }

    const imageData = new ImageData(
      new Uint8ClampedArray(resultBuffer),
      texture.width,
      texture.height
    )

    const pngBuffer = await encodePNG(imageData)
    if (debug) {
      console.log('PNG buffer size:', pngBuffer.byteLength)
    }

    const base64 = pngBuffer.toString('base64')
    if (debug) {
      console.log('Base64 length:', base64.length)
    }

    const dataUri = `data:image/png;base64,${base64}`
    if (debug) {
      console.log('Data URI length:', dataUri.length)
    }

    if (debug) {
      console.log('Processed image data URI:', dataUri.slice(0, 50) + '...')
    }

    processedImages.push(dataUri)
  }

  return processedImages
}

export async function loadImage(dataUri: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get 2D context'))
        return
      }
      ctx.drawImage(img, 0, 0)
      resolve(ctx.getImageData(0, 0, img.width, img.height))
    }
    img.onerror = reject
    img.src = dataUri
  })
}

export async function applyFilter(
  device: GPUDevice,
  inputTexture: GPUTexture,
  depthTexture: GPUTexture | null,
  filter: Filter,
  parameters?: FilterParams
): Promise<GPUTexture> {
  const shader = createShaderModule(device, filter.shader)

  // console.log('filter.shader:', filter.shader)

  // Define the pipeline layout explicitly
  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [
      device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            texture: { sampleType: 'float' as GPUTextureSampleType },
          },
          {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            storageTexture: {
              format: 'rgba8unorm' as GPUTextureFormat,
              access: 'write-only' as GPUStorageTextureAccess,
            },
          },
          {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'uniform' as GPUBufferBindingType },
          },
          {
            binding: 3,
            visibility: GPUShaderStage.COMPUTE,
            texture: { sampleType: 'float' as GPUTextureSampleType },
          },
          {
            binding: 4,
            visibility: GPUShaderStage.COMPUTE,
            sampler: { type: 'filtering' as GPUSamplerBindingType },
          },
        ],
      }),
    ],
  })

  const pipeline = device.createComputePipeline({
    layout: pipelineLayout,
    compute: { module: shader, entryPoint: 'main' },
  })

  const outputTexture = device.createTexture({
    size: [inputTexture.width, inputTexture.height, 1],
    format: 'rgba8unorm',
    usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
  })

  // Prepare uniform buffer
  const uniformData: number[] = []
  filter.parameters.forEach((param) => {
    if (param.type === 'number') {
      uniformData.push((parameters?.[param.id] as number) ?? param.defaultValue)
    } else if (param.type === 'string') {
      const value = (parameters?.[param.id] as string) ?? param.defaultValue
      const index = param.allowedValues.indexOf(value)
      uniformData.push(index)
    }
  })

  const uniformTypedArray = new Float32Array(uniformData)
  const uniformBufferSize = uniformTypedArray.byteLength
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(uniformBuffer, 0, uniformTypedArray)

  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
  })

  let depthTextureView: GPUTextureView
  if (depthTexture) {
    depthTextureView = depthTexture.createView()
  } else {
    const dummyDepthTexture = device.createTexture({
      size: [1, 1],
      format: 'rgba8unorm', // Changed from 'r32float' to 'rgba8unorm'
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    })

    const defaultDepthValue = new Uint8Array([255, 255, 255, 255]) // White color (1.0 in normalized space)
    device.queue.writeTexture(
      { texture: dummyDepthTexture },
      defaultDepthValue,
      { bytesPerRow: 4, rowsPerImage: 1 },
      [1, 1]
    )

    depthTextureView = dummyDepthTexture.createView()
  }

  const bindGroupEntries: GPUBindGroupEntry[] = [
    { binding: 0, resource: inputTexture.createView() },
    { binding: 1, resource: outputTexture.createView() },
    { binding: 2, resource: { buffer: uniformBuffer } },
    { binding: 3, resource: depthTextureView },
    { binding: 4, resource: sampler },
  ]

  // console.log('bindGroupEntries:', bindGroupEntries)

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: bindGroupEntries,
  })

  const commandEncoder = device.createCommandEncoder()
  const passEncoder = commandEncoder.beginComputePass()
  passEncoder.setPipeline(pipeline)
  passEncoder.setBindGroup(0, bindGroup)
  passEncoder.dispatchWorkgroups(
    Math.ceil(inputTexture.width / 8),
    Math.ceil(inputTexture.height / 8)
  )
  passEncoder.end()

  device.queue.submit([commandEncoder.finish()])

  return outputTexture
}

export function createShaderModule(
  device: GPUDevice,
  shaderCode: string
): GPUShaderModule {
  return device.createShaderModule({ code: shaderCode })
}

export async function readTextureToBuffer(
  device: GPUDevice,
  texture: GPUTexture
): Promise<ArrayBuffer> {
  const width = texture.width
  const height = texture.height
  const bytesPerRow = Math.ceil((width * 4) / 256) * 256
  const bufferSize = bytesPerRow * height

  const resultBuffer = device.createBuffer({
    size: bufferSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  })

  const commandEncoder = device.createCommandEncoder()
  commandEncoder.copyTextureToBuffer(
    { texture },
    { buffer: resultBuffer, bytesPerRow },
    { width, height }
  )

  device.queue.submit([commandEncoder.finish()])

  await resultBuffer.mapAsync(GPUMapMode.READ)
  const arrayBuffer = resultBuffer.getMappedRange().slice(0)
  resultBuffer.unmap()

  // Remove padding
  const unpaddedBuffer = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) {
    const srcOffset = y * bytesPerRow
    const dstOffset = y * width * 4
    unpaddedBuffer.set(
      new Uint8Array(arrayBuffer, srcOffset, width * 4),
      dstOffset
    )
  }

  return unpaddedBuffer.buffer
}

export function encodePNG(imageData: ImageData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const png = new PNG({
      width: imageData.width,
      height: imageData.height,
    })

    // Copy the image data to the PNG
    png.data = Buffer.from(imageData.data)

    // Use a BufferList to accumulate chunks
    const chunks: Buffer[] = []

    png
      .pack()
      .on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })
      .on('end', () => {
        // Concatenate all chunks into a single buffer
        const result = Buffer.concat(chunks)
        // console.log('Total PNG size:', result.length);
        resolve(result)
      })
      .on('error', (err: Error) => {
        reject(err)
      })
  })
}
