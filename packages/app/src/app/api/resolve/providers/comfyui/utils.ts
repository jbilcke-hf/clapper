import { PromptBuilder } from '@saintno/comfyui-sdk'

type NodeRawData = {
  inputs?: Record<string, unknown>
  class_type?: string
  _meta?: {
    title: string
  }
}

type NodeData = NodeRawData & {
  id: string
}

type ComfyUIWorkflowApiRaw = Record<string, NodeRawData>

type INPUT_TYPES = 'string' | 'number'

type NodeInput = {
  // Infered primitive type of the input based on its value
  type: INPUT_TYPES
  name: string
  value: any
  key: string
  nodeId: string
}

type PromptClapperInput = {
  // Infered clapper input type based on input value, input node relationships, etc
  type?: 'positive' | 'negative'
  nodeId: string
  name: string
  value: any
}

/**
 * Utils to query ComfyUI workflow-api nodes data
 */
export class ComfyUIWorkflowApiUtils {
  private workflow: ComfyUIWorkflowApiRaw
  private adjList: Record<string, string[]>
  private dependencyList: Record<string, { from: string; inputName: string }[]>
  private dependantList: Record<string, { to: string; inputName: string }[]>
  private inDegree: Record<string, number>

  constructor(workflow: ComfyUIWorkflowApiRaw) {
    this.workflow = workflow
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

    for (const nodeId of Object.keys(this.workflow)) {
      adjList[nodeId] = []
      dependencyList[nodeId] = []
      dependantList[nodeId] = []
      inDegree[nodeId] = 0
    }

    for (const [nodeId, nodeData] of Object.entries(this.workflow)) {
      const completeNodeData: NodeData = { id: nodeId, ...nodeData }
      if (completeNodeData.inputs) {
        for (const [inputName, value] of Object.entries(
          completeNodeData.inputs
        )) {
          if (Array.isArray(value)) {
            const dependency = value[0] as string
            adjList[dependency].push(nodeId)
            dependencyList[nodeId].push({ from: dependency, inputName })
            dependantList[dependency].push({ to: nodeId, inputName })
            inDegree[nodeId] += 1
          }
        }
      }
    }

    return { adjList, dependencyList, dependantList, inDegree }
  }

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
  getNodesWithInputs(): NodeData[] {
    const nodesWithInputs: NodeData[] = []
    for (const [nodeId, nodeData] of Object.entries(this.workflow)) {
      if (nodeData.inputs && Object.keys(nodeData.inputs).length > 0) {
        const completeNodeData: NodeData = { id: nodeId, ...nodeData }
        nodesWithInputs.push(completeNodeData)
      }
    }
    return nodesWithInputs
  }

  /**
   * Get all inputs in the workflow.
   */
  getInputs(): NodeInput[] {
    const nodesWithInputs = this.getNodesWithInputs()
    let inputs: any[] = []

    for (const node of nodesWithInputs) {
      const inputSchemas = this.getInputsByNodeId(node.id)
      if (inputSchemas?.length) {
        inputs = inputs.concat(...inputSchemas)
      }
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
    if (sortedOrder.length === Object.keys(this.workflow).length) {
      const outputNodeId = sortedOrder[sortedOrder.length - 1]
      return { id: outputNodeId, ...this.workflow[outputNodeId] }
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
  getInputsByNodeId(nodeId: string): NodeInput[] | null {
    const nodeData = this.workflow[nodeId]
    if (!nodeData || !nodeData.inputs) {
      return null
    }

    const inputs: NodeInput[] = []

    for (const [name, value] of Object.entries(nodeData.inputs)) {
      if (Array.isArray(value)) continue

      // TODO: Handle more types
      let inputType: INPUT_TYPES =
        typeof value === 'string' ? 'string' : 'number'

      inputs.push({
        type: inputType,
        name: name,
        value: value,
        key: `${nodeId}.inputs.${name}`,
        nodeId,
      })
    }

    return inputs.length > 0 ? inputs : null
  }

  /**
   * Search for the main inputs for Clapper
   * e.g. prompt, negative prompt
   */
  detectMainInputs(): PromptClapperInput[] {
    const nodesWithInputs = this.getNodesWithInputs()
    const mainInputs: PromptClapperInput[] = []

    for (const node of nodesWithInputs) {
      const { id: nodeId, inputs, class_type, _meta } = node
      const nodeInputs = this.getInputsByNodeId(node.id)

      if (nodeInputs) {
        for (const nodeInput of nodeInputs) {
          // Based on the type or input name
          const isStringInput = nodeInput.type === 'string'
          const nameContainsTextOrPrompt =
            nodeInput.name.includes('text') || nodeInput.name.includes('prompt')
          // Based on the node type
          const classIsCLIPTextEncode = class_type === 'CLIPTextEncode'
          // Based on the node title
          const titleContainsPrompt = _meta?.title
            ?.toLowerCase()
            .includes('prompt')
          // Based on Clapper string tokens
          const hasClapperTokens =
            isStringInput &&
            nodeInput.value?.toLowerCase().includes('@clapper/')

          if (
            (isStringInput && nameContainsTextOrPrompt) ||
            classIsCLIPTextEncode ||
            titleContainsPrompt ||
            hasClapperTokens
          ) {
            mainInputs.push({
              name: nodeInput.name,
              value: nodeInput.value,
              nodeId: nodeInput.nodeId,
            })
          }
        }
      }
    }

    return mainInputs
  }

  /**
   * Detect positive prompt inputs in the workflow
   */
  detectPositivePromptInput(): PromptClapperInput[] {
    const mainInputs = this.detectMainInputs()
    const positivePromptInputs = mainInputs
      .filter((input) => {
        const deps = this.dependantList[input.nodeId]
        return deps.some((dep) => dep.inputName === 'positive')
      })
      .map((input) => {
        input.type = 'positive'
        return input
      })

    return positivePromptInputs
  }

  /**
   * Detect negative prompt inputs in the workflow
   */
  detectNegativePromptInput(): PromptClapperInput[] {
    const mainInputs = this.detectMainInputs()
    const negativePromptInputs = mainInputs
      .filter((input) => {
        const deps = this.dependantList[input.nodeId]
        return deps.some((dep) => dep.inputName === 'negative')
      })
      .map((input) => {
        input.type = 'negative'
        return input
      })

    return negativePromptInputs
  }

  /**
   * Takes a workflow and converts it to PromptBuilder
   */
  createPromptBuilder(): PromptBuilder<any, any, any> {
    const positivePrompts = this.detectPositivePromptInput()
    const negativePrompts = this.detectNegativePromptInput()
    const inputs = this.getInputs()
    const outputNode = this.getOutputNode()

    const promptBuilder = new PromptBuilder(
      this.workflow,
      inputs.map((input) => input.name),
      ['output']
    )

    const processed: Record<string, boolean> = {}

    positivePrompts.forEach((input) => {
      processed['positive'] = true
      promptBuilder.setInputNode(
        'positive',
        `${input.nodeId}.inputs.${input.name}`
      )
      promptBuilder.input('positive', input.value)
    })

    negativePrompts.forEach((input) => {
      processed['negative'] = true
      promptBuilder.setInputNode(
        'negative',
        `${input.nodeId}.inputs.${input.name}`
      )
      promptBuilder.input('negative', input.value)
    })

    inputs.forEach((input) => {
      promptBuilder.setInputNode(input.name, input.key)
      if (!processed[input.key]) {
        promptBuilder.input(input.name, input.value)
      }
    })

    if (outputNode) {
      promptBuilder.setOutputNode('output', outputNode.id)
    }

    return promptBuilder
  }
}
