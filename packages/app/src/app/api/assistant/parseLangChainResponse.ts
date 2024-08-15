import { parseRawInputToAction } from '@/services/assistant/parseRawInputToAction'
import { ClapSegmentCategory, isValidNumber } from '@aitube/clap'
import { AssistantAction, AssistantMessage } from '@aitube/clapper-services'

export function parseLangChainResponse(
  langChainResponse?: AssistantMessage
): AssistantMessage {
  const assistantMessage: AssistantMessage = {
    comment: '',
    action: AssistantAction.NONE,
    updatedStoryBlocks: [],
    updatedSceneSegments: [],
  }
  /*
  console.log(
    'LangChain replied this:',
    JSON.stringify(langChainResponse, null, 2)
  )
    */

  // this is a fallback in case of langChain failure
  if (!langChainResponse) {
    // complete failure
    console.log(`error caused by LangChain`)
  } else if (typeof langChainResponse === 'string') {
    assistantMessage.action = parseRawInputToAction(langChainResponse)
    if (assistantMessage.action === AssistantAction.NONE) {
      assistantMessage.comment = langChainResponse
    }
  } else {
    assistantMessage.comment =
      typeof langChainResponse.comment === 'string'
        ? langChainResponse.comment
        : ''

    assistantMessage.action = Object.keys(AssistantAction).includes(
      `${langChainResponse.action || ''}`.toUpperCase()
    )
      ? langChainResponse.action
      : AssistantAction.NONE

    let i = 0
    for (const segment of langChainResponse.updatedSceneSegments || []) {
      i++
      const segmentId = isValidNumber(segment.segmentId)
        ? segment.segmentId!
        : i

      const category: ClapSegmentCategory =
        segment.category &&
        Object.keys(ClapSegmentCategory).includes(
          segment.category.toUpperCase()
        )
          ? (segment.category as ClapSegmentCategory)
          : ClapSegmentCategory.GENERIC

      const startTimeInMs: number = isValidNumber(segment.startTimeInMs)
        ? segment.startTimeInMs
        : 0
      const endTimeInMs: number = isValidNumber(segment.endTimeInMs)
        ? segment.endTimeInMs
        : 0

      const prompt = segment?.prompt || ''

      // we assume no prompt is an error
      if (prompt) {
        assistantMessage.updatedSceneSegments.push({
          segmentId,
          prompt,
          startTimeInMs,
          endTimeInMs,
          category,
        })
      }
    }

    i = 0
    for (const block of langChainResponse.updatedStoryBlocks || []) {
      i++
      const blockId = isValidNumber(block.blockId) ? block.blockId! : i

      // TODO: rename block.block to block.text or block.content it would be better
      const textBlock = `${block.block || ''}`
      // we assume no prompt is an error
      if (textBlock) {
        assistantMessage.updatedStoryBlocks.push({
          blockId,
          block: textBlock,
        })
      }
    }
  }

  return assistantMessage
}
