import { decode, encode } from 'base64-arraybuffer'

import { ColorGradingFilter } from './types'

export async function applyColorGrading({
  images,
  filters,
}: {
  images: Array<{ image: string; depthMap?: string }>
  filters: Array<{
    filter: ColorGradingFilter
    parameters?: Record<string, string | number>
  }>
}): Promise<string[]> {
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
    const imgData = await loadImage(image)
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
      texture = await applyFilter(
        device,
        texture,
        depthTexture,
        filter,
        parameters
      )
    }

    const resultBuffer = await readTextureToBuffer(device, texture)
    const base64 = encode(resultBuffer)
    processedImages.push(`data:image/png;base64,${base64}`)
  }

  return processedImages
}

async function loadImage(dataUri: string): Promise<ImageData> {
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

async function applyFilter(
  device: GPUDevice,
  inputTexture: GPUTexture,
  depthTexture: GPUTexture | null,
  filter: ColorGradingFilter,
  parameters?: Record<string, string | number>
): Promise<GPUTexture> {
  const shader = createShaderModule(device, filter.shader)
  const pipeline = device.createComputePipeline({
    layout: 'auto',
    compute: { module: shader, entryPoint: 'main' },
  })

  const outputTexture = device.createTexture({
    size: [inputTexture.width, inputTexture.height, 1],
    format: 'rgba8unorm',
    usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
  })

  // Automatically calculate uniform buffer size and create typed array
  const uniformData: number[] = []
  filter.parameters.forEach((param) => {
    if (param.type === 'number') {
      uniformData.push(
        (parameters?.[param.name] as number) ?? param.defaultValue
      )
    } else if (param.type === 'string') {
      // For string parameters, we'll use the index of the value in allowedValues
      const value = (parameters?.[param.name] as string) ?? param.defaultValue
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

  const bindGroupEntries: GPUBindGroupEntry[] = [
    { binding: 0, resource: inputTexture.createView() },
    { binding: 1, resource: outputTexture.createView() },
    { binding: 2, resource: { buffer: uniformBuffer } },
    { binding: 4, resource: sampler },
  ]

  if (depthTexture) {
    bindGroupEntries.push({ binding: 3, resource: depthTexture.createView() })
  } else {
    // Create a dummy 1x1 depth texture if no depth texture is provided
    const dummyDepthTexture = device.createTexture({
      size: [1, 1],
      format: 'r32float',
      usage: GPUTextureUsage.TEXTURE_BINDING,
    })
    bindGroupEntries.push({
      binding: 3,
      resource: dummyDepthTexture.createView(),
    })
  }

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

function createShaderModule(
  device: GPUDevice,
  shaderCode: string
): GPUShaderModule {
  return device.createShaderModule({ code: shaderCode })
}

async function readTextureToBuffer(
  device: GPUDevice,
  texture: GPUTexture
): Promise<ArrayBuffer> {
  const bufferSize = texture.width * texture.height * 4
  const resultBuffer = device.createBuffer({
    size: bufferSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  })

  const commandEncoder = device.createCommandEncoder()
  commandEncoder.copyTextureToBuffer(
    { texture },
    { buffer: resultBuffer, bytesPerRow: texture.width * 4 },
    { width: texture.width, height: texture.height }
  )

  device.queue.submit([commandEncoder.finish()])

  await resultBuffer.mapAsync(GPUMapMode.READ)
  const arrayBuffer = resultBuffer.getMappedRange().slice(0)
  resultBuffer.unmap()

  return arrayBuffer
}
