import {
  ClapInputCategory,
  ClapInputFields,
  ClapInputValues,
  ClapWorkflowCategory,
} from '@aitube/clap'
import unionBy from 'lodash/unionBy'

import {
  findHeightInputsFromWorkflow,
  findImageInputsFromWorkflow,
  findNegativePromptInputsFromWorkflow,
  findPromptInputsFromWorkflow,
  findSeedInputsFromWorkflow,
  findWidthInputsFromWorkflow,
  MainClapWorkflowInputsLabels,
} from './utils'
import { ClapperComfyUiInputIds, ComfyUiWorkflowApiNodeInput } from './types'
import { ComfyUIWorkflowApiGraph } from './graph'
import { getMainInputIdsByClapWorkflowCategory } from './getMainInputIdsByClapWorkflowCategory'

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
