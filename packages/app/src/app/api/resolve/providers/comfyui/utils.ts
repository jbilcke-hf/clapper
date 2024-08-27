import {
  ClapInputCategory,
  ClapInputField,
  ClapInputFields,
  ClapInputValues,
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { PromptBuilder } from '@saintno/comfyui-sdk'
import unionBy from 'lodash/unionBy'

export enum ClapperComfyUiInputIds {
  PROMPT = '@clapper/prompt',
  NEGATIVE_PROMPT = '@clapper/negative/prompt',
  WIDTH = '@clapper/width',
  HEIGHT = '@clapper/height',
  SEED = '@clapper/seed',
  IMAGE = '@clapper/image',
  OUTPUT = '@clapper/output',
  NULL = '@clapper/null',
}

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

type ComfyUIWorkflowApiJson = Record<string, NodeRawData>

type INPUT_TYPES = 'string' | 'number'

export type ComfyUiWorkflowApiNodeInput = {
  id: string
  // Infered primitive type of the input based on its value
  type: INPUT_TYPES
  name: string
  value: any
  node: {
    id: string
    name?: string
    type?: string
  }
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

/**
 * Shortcut methods to query Clapper related data from a workflow
 * @param workflow
 * @returns
 */
export function findPromptInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(positive).*/i,
      type: 'string',
    }),
    workflow.findInput({
      name: /.*(text|prompt).*/i,
      type: 'string',
      nodeOutputToNodeInput: /.*positive.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/prompt.*/i.test(value),
    }),
    'id'
  )
}

export function findNegativePromptInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(text|prompt|negative).*/i,
      type: 'string',
      nodeOutputToNodeInput: /.*negative.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/prompt_negative.*/i.test(value),
    }),
    'id'
  )
}

export function findWidthInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(width).*/i,
      type: 'number',
    }),
    workflow.findInput({
      type: 'number',
      nodeOutputToNodeInput: /.*width.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/width.*/i.test(value),
    }),
    'id'
  )
}

export function findHeightInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(height).*/i,
      type: 'number',
    }),
    workflow.findInput({
      type: 'number',
      nodeOutputToNodeInput: /.*height.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/height.*/i.test(value),
    }),
    'id'
  )
}

export function findSeedInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      name: /.*(seed).*/i,
      type: 'number',
    }),
    workflow.findInput({
      type: 'number',
      nodeOutputToNodeInput: /.*seed.*/i,
    }),
    workflow.findInput({
      value: (value) => /.*\@clapper\/seed.*/i.test(value),
    }),
    'id'
  )
}

export function findImageInputsFromWorkflow(
  workflow: ComfyUIWorkflowApiGraph
): ComfyUiWorkflowApiNodeInput[] {
  return unionBy(
    workflow.findInput({
      value: (value) => /.*\@clapper\/image.*/i.test(value),
    }),
    'id'
  )
}

export const getMainInputIdsByClapWorkflowCategory = (
  category: ClapWorkflowCategory
) => {
  switch (category) {
    case ClapWorkflowCategory.VIDEO_GENERATION: {
      return [
        ClapperComfyUiInputIds.IMAGE,
        ClapperComfyUiInputIds.WIDTH,
        ClapperComfyUiInputIds.HEIGHT,
        ClapperComfyUiInputIds.SEED,
        ClapperComfyUiInputIds.OUTPUT,
      ]
    }
    default: {
      return [
        ClapperComfyUiInputIds.PROMPT,
        ClapperComfyUiInputIds.NEGATIVE_PROMPT,
        ClapperComfyUiInputIds.WIDTH,
        ClapperComfyUiInputIds.HEIGHT,
        ClapperComfyUiInputIds.SEED,
        ClapperComfyUiInputIds.OUTPUT,
      ]
    }
  }
}

export const MainClapWorkflowInputsLabels = {
  [ClapperComfyUiInputIds.PROMPT]: 'Prompt node input',
  [ClapperComfyUiInputIds.NEGATIVE_PROMPT]: 'Negative prompt node input',
  [ClapperComfyUiInputIds.WIDTH]: 'Width node input',
  [ClapperComfyUiInputIds.HEIGHT]: 'Height node input',
  [ClapperComfyUiInputIds.SEED]: 'Seed node input',
  [ClapperComfyUiInputIds.IMAGE]: 'Image node input',
  [ClapperComfyUiInputIds.OUTPUT]: 'Output node',
}

export function getMainInputsFromComfyUiWorkflow(
  workflowString: string,
  category: ClapWorkflowCategory
): {
  inputFields: ClapInputFields
  inputValues: ClapInputValues
} {
  const workflowGraph = ComfyUIWorkflowApiGraph.fromString(workflowString)
  const mainInputsIds = getMainInputIdsByClapWorkflowCategory(category)
  const nodes = workflowGraph.getNodes()
  const textInputs = workflowGraph.findInput({
    type: 'string',
    name: /.*(text|prompt).*/,
  })
  const dimensionInputs = workflowGraph.findInput({
    type: 'number',
    name: /.*(width|height).*/,
  })
  const promptNodeInputs = findPromptInputsFromWorkflow(workflowGraph)
  const negativePromptNodeInputs =
    findNegativePromptInputsFromWorkflow(workflowGraph)
  const widthNodeInputs = findWidthInputsFromWorkflow(workflowGraph)
  const heightNodeInputs = findHeightInputsFromWorkflow(workflowGraph)
  const seedNodeInputs = findSeedInputsFromWorkflow(workflowGraph)
  const imageNodeInputs = findImageInputsFromWorkflow(workflowGraph)
  const outputNode = workflowGraph.getOutputNode()

  const inputValues = {
    [ClapperComfyUiInputIds.PROMPT]: promptNodeInputs?.[0]
      ? {
          id: promptNodeInputs?.[0].id,
          label: `${promptNodeInputs?.[0].id} (from node ${promptNodeInputs?.[0].node.id})`,
        }
      : undefined,
    [ClapperComfyUiInputIds.NEGATIVE_PROMPT]: negativePromptNodeInputs?.[0]
      ? {
          id: negativePromptNodeInputs?.[0].id,
          label: `${negativePromptNodeInputs?.[0].id} (from node ${negativePromptNodeInputs?.[0].node.id})`,
        }
      : undefined,
    [ClapperComfyUiInputIds.WIDTH]: widthNodeInputs?.[0]
      ? {
          id: widthNodeInputs?.[0].id,
          label: `${widthNodeInputs?.[0].id} (from node ${widthNodeInputs?.[0].node.id})`,
        }
      : undefined,
    [ClapperComfyUiInputIds.HEIGHT]: heightNodeInputs?.[0]
      ? {
          id: heightNodeInputs?.[0].id,
          label: `${heightNodeInputs?.[0].id} (from node ${heightNodeInputs?.[0].node.id})`,
        }
      : undefined,
    [ClapperComfyUiInputIds.SEED]: seedNodeInputs?.[0]
      ? {
          id: seedNodeInputs?.[0].id,
          label: `${seedNodeInputs?.[0].id} (from node ${seedNodeInputs?.[0].node.id})`,
        }
      : undefined,
    [ClapperComfyUiInputIds.IMAGE]: imageNodeInputs?.[0]
      ? {
          id: imageNodeInputs?.[0].id,
          label: `${imageNodeInputs?.[0].id} (from node ${imageNodeInputs?.[0].node.id})`,
        }
      : undefined,
    [ClapperComfyUiInputIds.OUTPUT]: outputNode
      ? {
          id: outputNode?.id,
          label: `${outputNode?._meta?.title} (id: ${outputNode?.id})`,
        }
      : undefined,
  }

  const getOptionsItems = (inputs: ComfyUiWorkflowApiNodeInput[]) => {
    return [
      ...inputs,
      {
        id: ClapperComfyUiInputIds.NULL,
        name: 'Unset',
        node: {
          id: null,
        },
      },
    ].map((p) => {
      const item = {
        id: p.id,
        label:
          p.id === ClapperComfyUiInputIds.NULL
            ? `Unset`
            : `${p.name} (from node ${p.node.id})`,
      }
      return {
        ...item,
        value: item,
      }
    })
  }

  const inputFields: any = []
  mainInputsIds.forEach((mainInput) => {
    switch (mainInput) {
      case ClapperComfyUiInputIds.PROMPT: {
        inputFields.push({
          id: ClapperComfyUiInputIds.PROMPT,
          label: MainClapWorkflowInputsLabels[ClapperComfyUiInputIds.PROMPT],
          type: 'nodeInput' as any,
          category: ClapInputCategory.PROMPT,
          description: 'The input where Clapper will put the segment prompt',
          defaultValue: '',
          metadata: {
            options: getOptionsItems(
              unionBy(promptNodeInputs, textInputs, 'id')
            ),
          },
        })
        return
      }
      case ClapperComfyUiInputIds.NEGATIVE_PROMPT: {
        inputFields.push({
          id: ClapperComfyUiInputIds.NEGATIVE_PROMPT,
          label:
            MainClapWorkflowInputsLabels[
              ClapperComfyUiInputIds.NEGATIVE_PROMPT
            ],
          type: 'nodeInput' as any,
          category: ClapInputCategory.PROMPT,
          description:
            'The node input where Clapper will put the segment negative prompt',
          defaultValue: '',
          metadata: {
            options: getOptionsItems(
              unionBy(negativePromptNodeInputs, textInputs, 'id')
            ),
          },
        })
        return
      }
      case ClapperComfyUiInputIds.WIDTH: {
        inputFields.push({
          id: ClapperComfyUiInputIds.WIDTH,
          label: MainClapWorkflowInputsLabels[ClapperComfyUiInputIds.WIDTH],
          type: 'nodeInput' as any,
          category: ClapInputCategory.WIDTH,
          description:
            'The node input where Clapper will put the required image width',
          defaultValue: '',
          metadata: {
            options: getOptionsItems(
              unionBy(widthNodeInputs, dimensionInputs, 'id')
            ),
          },
        })
        return
      }
      case ClapperComfyUiInputIds.HEIGHT: {
        inputFields.push({
          id: ClapperComfyUiInputIds.HEIGHT,
          label: MainClapWorkflowInputsLabels[ClapperComfyUiInputIds.HEIGHT],
          type: 'nodeInput' as any,
          description:
            'The node input where Clapper will put the required image height',
          category: ClapInputCategory.HEIGHT,
          defaultValue: 1000,
          metadata: {
            options: getOptionsItems(
              unionBy(heightNodeInputs, dimensionInputs, 'id')
            ),
          },
        })
        return
      }
      case ClapperComfyUiInputIds.SEED: {
        inputFields.push({
          id: ClapperComfyUiInputIds.SEED,
          label: MainClapWorkflowInputsLabels[ClapperComfyUiInputIds.SEED],
          type: 'nodeInput' as any,
          category: ClapInputCategory.UNKNOWN,
          description: 'The node input where Clapper will set a seed',
          defaultValue: '',
          metadata: {
            options: getOptionsItems(seedNodeInputs),
          },
        })
        return
      }
      case ClapperComfyUiInputIds.IMAGE: {
        inputFields.push({
          id: ClapperComfyUiInputIds.IMAGE,
          label: MainClapWorkflowInputsLabels[ClapperComfyUiInputIds.IMAGE],
          type: 'nodeInput' as any,
          category: ClapInputCategory.UNKNOWN,
          description: 'The node input where Clapper will set an image',
          defaultValue: '',
          metadata: {
            options: getOptionsItems(imageNodeInputs),
            tooltip: {
              message: `
                Clapper doesn't support file/upload node inputs;
                use a string input from where Clapper can load a base64
                data URI string (e.g. the "Load Image From Base64" node's
                "data" input in the default video workflow).
              `,
              type: 'info',
            },
          },
        })
        return
      }
      case ClapperComfyUiInputIds.OUTPUT: {
        inputFields.push({
          id: ClapperComfyUiInputIds.OUTPUT,
          label: MainClapWorkflowInputsLabels[ClapperComfyUiInputIds.OUTPUT],
          type: 'node' as any,
          category: ClapInputCategory.UNKNOWN,
          description: 'The node from which Clapper will get the output image',
          defaultValue: '',
          metadata: {
            options: nodes.map((p) => {
              const item = {
                id: p.id,
                label: `${p._meta?.title || 'Untitled node'} (id: ${p.id})`,
              }
              return {
                ...item,
                value: item,
              }
            }),
          },
        })
        return
      }
    }
  })

  return {
    inputFields,
    inputValues,
  }
}

/**
 * Returns input fields / input values required by ComfyUi
 * @param workflow
 */
export function getInputsFromComfyUiWorkflow(
  workflowString: string,
  category: ClapWorkflowCategory
): {
  inputFields: ClapInputFields
  inputValues: ClapInputValues
} {
  const workflowGraph = ComfyUIWorkflowApiGraph.fromString(workflowString)
  const { inputFields: mainInputFields, inputValues: mainInputValues } =
    getMainInputsFromComfyUiWorkflow(workflowString, category)

  const inputValues = {
    ...mainInputValues,
  } as any

  const inputFields: ClapInputField<{
    options?: {
      id: string
      label: string
      value: any
    }[]
    tooltip?: {
      type: string
      message: string
    }
  }>[] = [
    // Required fields that should be available in the workflow, otherwise
    // Clapper doesn't know how to input its settings (prompts, dimensions, etc)
    {
      id: '@clapper/mainInputs',
      label: 'Main settings',
      type: 'group' as any,
      category: ClapInputCategory.UNKNOWN,
      description: 'Main inputs',
      defaultValue: '',
      inputFields: mainInputFields,
    },
    // Other input fields based on the workflow nodes
    {
      id: '@clapper/otherInputs',
      label: 'Node settings',
      type: 'group' as any,
      category: ClapInputCategory.UNKNOWN,
      description: 'Main inputs',
      defaultValue: '',
      inputFields: workflowGraph
        .getNodesWithInputs()
        // Discard nodes with only inputs connections
        .filter(({ id }) => workflowGraph.getInputsByNodeId(id)?.length)
        .map(({ id, _meta }) => {
          return {
            id: '@clapper/node/' + id,
            label: `${_meta?.title} (id: ${id})`,
            type: 'group' as any,
            category: ClapInputCategory.UNKNOWN,
            description: `Settings for ${_meta?.title}`,
            defaultValue: '',
            inputFields: workflowGraph.getInputsByNodeId(id)?.map((input) => {
              const mainInputKey = Object.keys(inputValues).find(
                (key) => inputValues[key]?.id == input.id
              )
              inputValues[input.id] = input.value
              return {
                id: input.id,
                label: input.name,
                type: input.type as any,
                category: ClapInputCategory.UNKNOWN,
                description: '',
                defaultValue: input.value,
                metadata: {
                  tooltip: MainClapWorkflowInputsLabels[mainInputKey as string]
                    ? {
                        type: 'warning',
                        message: `This value will be overwritten by Clapper because it is
                      used as "${MainClapWorkflowInputsLabels[mainInputKey as string]}".`,
                      }
                    : undefined,
                },
              }
            }),
          }
        }),
    },
  ]

  return {
    inputFields,
    inputValues,
  }
}

/**
 * Takes a workflow graph and converts it to PromptBuilder
 */
export function createPromptBuilder(
  workflowApiGraph: ComfyUIWorkflowApiGraph
): PromptBuilder<any, any, any> {
  const inputs = workflowApiGraph.getInputs()
  const outputNode = workflowApiGraph.getOutputNode()

  const inputKeys = Object.values(inputs)
    .map((input) => input.id)
    .concat([
      ClapperComfyUiInputIds.PROMPT,
      ClapperComfyUiInputIds.NEGATIVE_PROMPT,
      ClapperComfyUiInputIds.WIDTH,
      ClapperComfyUiInputIds.HEIGHT,
      ClapperComfyUiInputIds.SEED,
    ])

  const promptBuilder = new PromptBuilder(
    workflowApiGraph.toJson(),
    inputKeys,
    [ClapperComfyUiInputIds.OUTPUT]
  )

  // We don't need proper names for input keys,
  // as we just use PromptBuilder for its websocket api
  inputKeys.forEach((inputKey) => {
    promptBuilder.setInputNode(inputKey, inputKey)
  })

  if (outputNode) {
    promptBuilder.setOutputNode(ClapperComfyUiInputIds.OUTPUT, outputNode.id)
  }

  return promptBuilder
}

export function convertComfyUiWorkflowApiToClapWorkflow(
  workflowString: string,
  category: ClapWorkflowCategory = ClapWorkflowCategory.IMAGE_GENERATION
): ClapWorkflow {
  try {
    const { inputFields, inputValues } = getInputsFromComfyUiWorkflow(
      workflowString,
      category
    )
    switch (category) {
      case ClapWorkflowCategory.VIDEO_GENERATION: {
        return {
          id: 'comfyui://settings.comfyWorkflowForVideo',
          label: 'Custom Video Workflow',
          description: 'Custom ComfyUI workflow to generate videos',
          tags: ['custom', 'video generation'],
          author: 'You',
          thumbnailUrl: '',
          nonCommercial: false,
          engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
          provider: ClapWorkflowProvider.COMFYUI,
          category,
          data: workflowString,
          schema: '',
          inputFields,
          inputValues,
        }
      }
      default: {
        return {
          id: 'comfyui://settings.comfyWorkflowForImage',
          label: 'Custom Image Workflow',
          description: 'Custom ComfyUI workflow to generate images',
          tags: ['custom', 'image generation'],
          author: 'You',
          thumbnailUrl: '',
          nonCommercial: false,
          engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
          provider: ClapWorkflowProvider.COMFYUI,
          category,
          data: workflowString,
          schema: '',
          inputFields,
          inputValues,
        }
      }
    }
  } catch (e) {
    throw e
  }
}
