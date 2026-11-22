import {
  ComfyUIWorkflowApiJson,
  ComfyUiWorkflowApiNodeInput,
  INPUT_TYPES,
  NodeData,
  NodeRawData,
} from './types'

const MAX_WORKFLOW_JSON_BYTES = 5 * 1024 * 1024
const MAX_SANITIZE_DEPTH = 64
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

const OUTPUT_NODE_CLASS_PATTERNS = [
  /^(SaveImage|PreviewImage|SaveAnimatedWEBP|SaveAnimatedPNG)$/i,
  /^(VHS_VideoCombine|SaveVideo|SaveWEBM)$/i,
  /^(SaveAudio|PreviewAudio|VHS_Audio|SaveAudioMP3|SaveAudioWAV)$/i,
  /(Save|Preview|Output|Combine)/i,
]

const GUI_NODE_WIDGET_MAPPINGS: Record<string, string[]> = {
  KSampler: [
    'seed',
    'control_after_generate',
    'steps',
    'cfg',
    'sampler_name',
    'scheduler',
    'denoise',
  ],
  KSamplerAdvanced: [
    'add_noise',
    'noise_seed',
    'control_after_generate',
    'steps',
    'cfg',
    'sampler_name',
    'scheduler',
    'start_at_step',
    'end_at_step',
    'return_with_leftover_noise',
  ],
  RandomNoise: ['noise_seed', 'control_after_generate'],
  CLIPTextEncode: ['text'],
  T5TextEncode: ['text'],
  EmptyLatentImage: ['width', 'height', 'batch_size'],
  EmptySD3LatentImage: ['width', 'height', 'batch_size'],
  CheckpointLoaderSimple: ['ckpt_name'],
  ImageOnlyCheckpointLoader: ['ckpt_name'],
  UNETLoader: ['unet_name', 'weight_dtype'],
  VAELoader: ['vae_name'],
  DualCLIPLoader: ['clip_name1', 'clip_name2', 'type'],
  CLIPLoader: ['clip_name', 'type'],
  LoraLoader: ['lora_name', 'strength_model', 'strength_clip'],
  SaveImage: ['filename_prefix'],
  SaveAudio: ['filename_prefix'],
  LoadImage: ['image', 'upload'],
  LoadImageFromBase64: ['data'],
  SVD_img2vid_Conditioning: [
    'width',
    'height',
    'video_frames',
    'motion_bucket_id',
    'fps',
    'augmentation_level',
  ],
}

export function sanitizeJsonObject(value: unknown, depth = 0): any {
  if (depth > MAX_SANITIZE_DEPTH) {
    throw new Error('Workflow JSON exceeds maximum nesting depth.')
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeJsonObject(item, depth + 1))
  }
  if (value !== null && typeof value === 'object') {
    const clean: Record<string, any> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (DANGEROUS_KEYS.has(k)) continue
      clean[k] = sanitizeJsonObject(v, depth + 1)
    }
    return clean
  }
  return value
}

export function isComfyUiGuiWorkflow(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return false
  }
  const obj = raw as Record<string, unknown>
  return Array.isArray(obj.nodes) && Array.isArray(obj.links)
}

export function convertComfyUiGuiToApiFormat(
  guiWorkflow: Record<string, any>
): ComfyUIWorkflowApiJson {
  const nodes = Array.isArray(guiWorkflow.nodes) ? guiWorkflow.nodes : []
  const links = Array.isArray(guiWorkflow.links) ? guiWorkflow.links : []

  // Map link_id -> [origin_node_id, origin_slot]
  const linkMap: Record<number, [string, number]> = {}
  for (const link of links) {
    if (Array.isArray(link) && link.length >= 5) {
      const [linkId, originNodeId, originSlot] = link
      linkMap[Number(linkId)] = [String(originNodeId), Number(originSlot)]
    }
  }

  const apiWorkflow: ComfyUIWorkflowApiJson = {}

  for (const node of nodes) {
    if (!node || typeof node !== 'object' || node.id === undefined) continue
    const nodeType = String(node.type || '')
    // Skip pure UI virtual routing nodes
    if (nodeType === 'Reroute') continue

    const nodeId = String(node.id)
    const inputs: Record<string, unknown> = {}
    const linkedInputNames = new Set<string>()
    let widgetIdx = 0
    const widgetsValues = Array.isArray(node.widgets_values)
      ? node.widgets_values
      : []

    if (Array.isArray(node.inputs)) {
      for (const input of node.inputs) {
        if (!input || typeof input.name !== 'string') continue
        if (input.link != null && linkMap[Number(input.link)]) {
          inputs[input.name] = linkMap[Number(input.link)]
          linkedInputNames.add(input.name)
          if (input.widget) {
            widgetIdx += 1
          }
        } else if (input.widget && widgetIdx < widgetsValues.length) {
          inputs[input.name] = widgetsValues[widgetIdx]
          widgetIdx += 1
        }
      }
    }

    const knownWidgetNames = GUI_NODE_WIDGET_MAPPINGS[nodeType]
    if (knownWidgetNames && widgetsValues.length > 0) {
      for (
        let i = 0;
        i < knownWidgetNames.length && i < widgetsValues.length;
        i++
      ) {
        const wName = knownWidgetNames[i]
        if (wName === 'control_after_generate') continue
        if (!linkedInputNames.has(wName) && inputs[wName] === undefined) {
          inputs[wName] = widgetsValues[i]
        }
      }
    } else if (widgetIdx < widgetsValues.length) {
      for (let i = widgetIdx; i < widgetsValues.length; i++) {
        const val = widgetsValues[i]
        if (
          typeof val === 'string' &&
          inputs.text === undefined &&
          /TextEncode|Prompt/i.test(nodeType)
        ) {
          inputs.text = val
        } else {
          inputs[`widget_${i}`] = val
        }
      }
    }

    apiWorkflow[nodeId] = {
      inputs,
      class_type: nodeType,
      _meta: {
        title: String(node.title || nodeType || `Node ${nodeId}`),
      },
    }
  }

  return apiWorkflow
}

export class ComfyUIWorkflowApiGraphEdge {
  source: ComfyUIWorkflowApiGraphNode
  target: ComfyUIWorkflowApiGraphNode
  relationship: string
  metadata?: any

  constructor(
    source: ComfyUIWorkflowApiGraphNode,
    target: ComfyUIWorkflowApiGraphNode,
    relationship: string,
    metadata?: any
  ) {
    this.source = source
    this.target = target
    this.relationship = relationship
    this.metadata = metadata
  }
}

export class ComfyUIWorkflowApiGraphNode {
  id: string
  inputs?: Record<string, any> = {}
  _meta?: Record<string, any> = {}
  class_type?: string = ''
  outboundEdges: ComfyUIWorkflowApiGraphEdge[] = []
  inboundEdges: ComfyUIWorkflowApiGraphEdge[] = []

  constructor(id: string, inputs?: Record<string, any>, meta?: any) {
    this.id = id
  }

  addOutboundEdge(
    targetNode: ComfyUIWorkflowApiGraphNode,
    relationship: string,
    metadata?: any
  ) {
    const edge = new ComfyUIWorkflowApiGraphEdge(
      this,
      targetNode,
      relationship,
      metadata
    )
    this.outboundEdges.push(edge)
    targetNode.inboundEdges.push(edge)
  }

  addInboundEdge(
    sourceNode: ComfyUIWorkflowApiGraphNode,
    relationship: string,
    metadata?: any
  ) {
    const edge = new ComfyUIWorkflowApiGraphEdge(
      sourceNode,
      this,
      relationship,
      metadata
    )
    this.inboundEdges.push(edge)
    sourceNode.outboundEdges.push(edge)
  }

  getOutboundEdges(): ComfyUIWorkflowApiGraphEdge[] {
    return this.outboundEdges
  }

  getInboundEdges(): ComfyUIWorkflowApiGraphEdge[] {
    return this.inboundEdges
  }

  toJson(): Record<string, any> {
    return structuredClone({
      inputs: this.inputs,
      class_type: this.class_type,
      _meta: this._meta,
    })
  }
}

/**
 * Utils to query ComfyUI workflow-api nodes data
 */
export class ComfyUIWorkflowApiGraph {
  private json: ComfyUIWorkflowApiJson
  private nodes: Record<string, ComfyUIWorkflowApiGraphNode> = {}
  private adjList: Record<string, string[]> = {}
  private dependencyList: Record<
    string,
    { from: string; inputName: string }[]
  > = {}
  private dependantList: Record<string, { to: string; inputName: string }[]> =
    {}
  private inDegree: Record<string, number> = {}

  constructor(workflow: ComfyUIWorkflowApiJson) {
    if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow)) {
      throw new Error('Invalid workflow.')
    }
    const sanitized = sanitizeJsonObject(workflow)
    const normalized: ComfyUIWorkflowApiJson = isComfyUiGuiWorkflow(sanitized)
      ? convertComfyUiGuiToApiFormat(sanitized)
      : sanitized

    const nodeIds = Object.keys(normalized)
    if (nodeIds.length === 0) {
      throw new Error('Invalid workflow: workflow contains no nodes.')
    }

    for (const nodeId of nodeIds) {
      const nodeVal = normalized[nodeId] as NodeRawData
      if (
        !nodeVal ||
        typeof nodeVal !== 'object' ||
        Array.isArray(nodeVal) ||
        (nodeVal.inputs === undefined && nodeVal.class_type === undefined)
      ) {
        throw new Error('Invalid workflow: malformed node data.')
      }
    }

    this.json = structuredClone(normalized)
    const { adjList, dependencyList, dependantList, inDegree } =
      this.buildGraphData()
    this.adjList = adjList
    this.dependencyList = dependencyList
    this.dependantList = dependantList
    this.inDegree = inDegree
    const hasCycles = this.detectCycles()
    if (hasCycles) {
      throw new Error(
        'The provided workflow has cycles, impossible to get the output node.'
      )
    }
  }

  /**
   * Create a graph structure in an adjacent list
   * representation with additional data arrays
   * for dev purposes.
   * @param workflow
   * @returns
   */
  private buildGraphData() {
    const adjList: Record<string, string[]> = {}
    const dependencyList: Record<
      string,
      { from: string; inputName: string }[]
    > = {}
    const dependantList: Record<string, { to: string; inputName: string }[]> =
      {}
    const inDegree: Record<string, number> = {}

    for (const nodeId of Object.keys(this.json)) {
      const node = new ComfyUIWorkflowApiGraphNode(nodeId)
      node.inputs = this.json[nodeId].inputs
      node._meta = this.json[nodeId]._meta
      node.class_type = this.json[nodeId].class_type
      this.nodes[nodeId] = node

      adjList[nodeId] = []
      dependencyList[nodeId] = []
      dependantList[nodeId] = []
      inDegree[nodeId] = 0
    }

    for (const node of Object.values(this.nodes)) {
      if (node.inputs) {
        for (const [inputName, value] of Object.entries(node.inputs)) {
          if (Array.isArray(value) && value.length >= 1) {
            const dependencyNodeId = String(value[0])
            if (!this.nodes[dependencyNodeId]) {
              continue
            }
            adjList[dependencyNodeId].push(node.id)
            dependencyList[node.id].push({ from: dependencyNodeId, inputName })
            node.addInboundEdge(this.nodes[dependencyNodeId], inputName)
            dependantList[dependencyNodeId].push({ to: node.id, inputName })
            inDegree[node.id] += 1
          }
        }
      }
    }

    return { adjList, dependencyList, dependantList, inDegree }
  }

  /**
   * Check for corrupted workflows with loops
   */
  private detectCycles(): boolean {
    const visited: Record<string, boolean> = {}
    const recursionStack: Record<string, boolean> = {}
    const dfs = (nodeId: string): boolean => {
      if (!visited[nodeId]) {
        visited[nodeId] = true
        recursionStack[nodeId] = true
        for (const neighbor of this.adjList[nodeId]) {
          if (!visited[neighbor] && dfs(neighbor)) {
            return true
          } else if (recursionStack[neighbor]) {
            return true
          }
        }
      }

      recursionStack[nodeId] = false
      return false
    }

    for (const nodeId of Object.keys(this.adjList)) {
      if (dfs(nodeId)) {
        return true
      }
    }

    return false
  }

  getGraphData() {
    const { adjList, dependencyList, dependantList, inDegree } = this
    return { adjList, dependencyList, dependantList, inDegree }
  }

  /**
   * Get all nodes that have inputs.
   */
  getNodesWithInputs(): ComfyUIWorkflowApiGraphNode[] {
    const nodesWithInputs: ComfyUIWorkflowApiGraphNode[] = []
    for (const node of Object.values(this.nodes)) {
      if (node.inputs && Object.keys(node.inputs).length > 0) {
        nodesWithInputs.push(node)
      }
    }
    return nodesWithInputs
  }

  getNodes(): ComfyUIWorkflowApiGraphNode[] {
    return Object.values(structuredClone(this.nodes))
  }

  getNodesDict(): Record<string, ComfyUIWorkflowApiGraphNode> {
    return structuredClone(this.nodes)
  }

  /**
   * Returns a copy of all inputs in the workflow.
   */
  getInputs(): Record<string, ComfyUiWorkflowApiNodeInput> {
    const nodesWithInputs = this.getNodesWithInputs()
    const inputs = {}

    for (const node of nodesWithInputs) {
      const inputSchemas = this.getInputsByNodeId(node.id)
      inputSchemas?.forEach((inputSchema) => {
        inputs[`${inputSchema.node.id}.inputs.${inputSchema.name}`] =
          inputSchema
      })
    }

    return inputs
  }

  /**
   * Topological sort of the graph (Kahn's Algorithm) to get the final output node.
   * Prioritizes terminal output node classes (SaveImage, VHS_VideoCombine, SaveAudio, etc.)
   * and clones inDegree so repeated calls are idempotent.
   */
  getOutputNode(): NodeData | null {
    const { adjList } = this
    const inDegreeCopy = { ...this.inDegree }
    const queue: string[] = []
    const sortedOrder: string[] = []

    for (const nodeId of Object.keys(inDegreeCopy)) {
      if (inDegreeCopy[nodeId] === 0) {
        queue.push(nodeId)
      }
    }

    while (queue.length > 0) {
      const currentNode = queue.shift()!
      sortedOrder.push(currentNode)
      for (const neighbor of adjList[currentNode]) {
        inDegreeCopy[neighbor] -= 1
        if (inDegreeCopy[neighbor] === 0) {
          queue.push(neighbor)
        }
      }
    }

    if (sortedOrder.length !== Object.keys(this.json).length) {
      throw new Error(
        'The provided workflow has cycles, impossible to get the output node.'
      )
    }

    if (sortedOrder.length === 0) {
      return null
    }

    // Prefer sink nodes (no outbound edges) matching known output classes
    const sinkNodeIds = sortedOrder.filter(
      (nodeId) => (adjList[nodeId]?.length || 0) === 0
    )
    const candidatePools = [
      [...sinkNodeIds].reverse(),
      [...sortedOrder].reverse(),
    ]

    for (const pool of candidatePools) {
      for (const pattern of OUTPUT_NODE_CLASS_PATTERNS) {
        const matchedId = pool.find((nodeId) =>
          pattern.test(this.json[nodeId]?.class_type || '')
        )
        if (matchedId) {
          return { id: matchedId, ...this.json[matchedId] }
        }
      }
    }

    const fallbackId =
      sinkNodeIds[sinkNodeIds.length - 1] || sortedOrder[sortedOrder.length - 1]
    return { id: fallbackId, ...this.json[fallbackId] }
  }

  /**
   * Get all value inputs of a given node in the workflow.
   * Ignore input connections (e.g. inputs with value ['3', 0])
   * @param nodeId the id of the node
   */
  getInputsByNodeId(nodeId: string): ComfyUiWorkflowApiNodeInput[] | null {
    const nodeData = this.nodes[nodeId]
    if (!nodeData || !nodeData.inputs) {
      return null
    }

    const inputs: ComfyUiWorkflowApiNodeInput[] = []

    for (const [name, value] of Object.entries(nodeData.inputs)) {
      if (Array.isArray(value) || value === null || value === undefined) {
        continue
      }
      if (
        typeof value !== 'string' &&
        typeof value !== 'number' &&
        typeof value !== 'boolean'
      ) {
        continue
      }

      const inputType: INPUT_TYPES =
        typeof value === 'string'
          ? 'string'
          : typeof value === 'boolean'
            ? 'boolean'
            : 'number'

      inputs.push({
        type: inputType,
        name: name,
        value: value,
        id: `${nodeId}.inputs.${name}`,
        node: {
          id: nodeId,
          type: nodeData.class_type,
          name: nodeData?._meta?.title,
        },
      })
    }

    return inputs.length > 0 ? inputs : null
  }

  /**
   * A simple search of workflow inputs
   * @param query
   */
  findInput(query: {
    // By type of node input
    type?: string | RegExp
    // By name of node input
    name?: string | RegExp
    // Based on the node
    nodeType?: string | RegExp
    nodeName?: string | RegExp
    // If any output of the node containing the input
    // is targeting another node's input with the given
    // name
    nodeOutputToNodeInput?: string | RegExp
    // By value
    value?: (value) => boolean
  }): ComfyUiWorkflowApiNodeInput[] {
    const inputs = this.getInputs()

    // Helper function to match string or RegExp
    const matches = (
      value: string | undefined,
      query: string | RegExp | undefined
    ): boolean => {
      if (!query) return true
      if (typeof query === 'string') {
        return value === query
      } else if (query instanceof RegExp) {
        return query.test(value || '')
      }
      return false
    }

    return Object.values(inputs).filter(
      (input) =>
        (matches(input.type, query.type) &&
          matches(input.name, query.name) &&
          matches(input.node.name, query.nodeName) &&
          matches(input.node.type, query.nodeType) &&
          (!query.nodeOutputToNodeInput ||
            this.nodes[input.node.id].outboundEdges.some((edge) =>
              matches(edge.relationship, query.nodeOutputToNodeInput)
            )) &&
          !query.value) ||
        query.value?.(input.value)
    )
  }

  setInputValue(
    inputKey: string,
    value: any,
    options?: {
      ignoreErrors?: boolean
    }
  ) {
    const inputs = this.getInputs()
    if (!options?.ignoreErrors && !inputs[inputKey]) {
      throw new Error("Input doesn't exist in the workflow")
    }
    const input = inputs[inputKey]
    if (!input) return
    if (!this.nodes[input.node.id].inputs) this.nodes[input.node.id].inputs = {}
    this.nodes[input.node.id].inputs![input.name] = value
  }

  toJson(): Record<string, any> {
    const nodes = this.nodes
    const nodesJson = {}
    for (const key of Object.keys(nodes)) {
      nodesJson[key] = nodes[key].toJson()
    }
    return nodesJson
  }

  toString() {
    return JSON.stringify(this.toJson())
  }

  static fromString(
    workflowString: string | undefined
  ): ComfyUIWorkflowApiGraph {
    if (!workflowString || typeof workflowString !== 'string') {
      throw new Error('Invalid workflow.')
    }
    if (workflowString.length > MAX_WORKFLOW_JSON_BYTES) {
      throw new Error('Workflow JSON exceeds maximum allowed size (5 MB).')
    }
    const workflowRaw = sanitizeJsonObject(JSON.parse(workflowString))
    return new ComfyUIWorkflowApiGraph(workflowRaw)
  }

  static isValidWorkflow(workflowString: string | undefined): boolean {
    try {
      ComfyUIWorkflowApiGraph.fromString(workflowString)
      return true
    } catch {}
    return false
  }
}
