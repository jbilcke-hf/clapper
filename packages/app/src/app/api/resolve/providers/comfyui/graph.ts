import {
  ComfyUIWorkflowApiJson,
  ComfyUiWorkflowApiNodeInput,
  INPUT_TYPES,
  NodeData,
} from './types'

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
    this.json = structuredClone(workflow)
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
          if (Array.isArray(value)) {
            const dependencyNodeId = value[0] as string
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
   * TODO: multiple outputs.
   */
  getOutputNode(): NodeData | null {
    const { adjList, inDegree } = this
    const queue: string[] = []
    const sortedOrder: string[] = []

    for (const nodeId of Object.keys(inDegree)) {
      if (inDegree[nodeId] === 0) {
        queue.push(nodeId)
      }
    }

    while (queue.length > 0) {
      const currentNode = queue.shift()!
      sortedOrder.push(currentNode)
      for (const neighbor of adjList[currentNode]) {
        inDegree[neighbor] -= 1
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor)
        }
      }
    }

    // Last node in sortedOrder is the output node
    // TODO: handle multiple outputs
    if (sortedOrder.length === Object.keys(this.json).length) {
      const outputNodeId = sortedOrder[sortedOrder.length - 1]
      return { id: outputNodeId, ...this.json[outputNodeId] }
    } else {
      // If there are cycles, fail
      throw new Error(
        'The provided workflow has cycles, impossible to get the output node.'
      )
    }
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
      if (Array.isArray(value)) continue

      // TODO: Handle more types
      let inputType: INPUT_TYPES =
        typeof value === 'string' ? 'string' : 'number'

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
    if (!workflowString) throw new Error('Invalid workflow.')
    const workflowRaw = JSON.parse(workflowString)
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
