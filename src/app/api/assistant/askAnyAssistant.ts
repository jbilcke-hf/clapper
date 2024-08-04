'use server'

import { ClapSegmentCategory } from '@aitube/clap'
import { RunnableLike } from '@langchain/core/runnables'
import { ChatPromptValueInterface } from '@langchain/core/prompt_values'
import {
  AIMessage,
  AIMessageChunk,
  HumanMessage,
} from '@langchain/core/messages'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { ChatGroq } from '@langchain/groq'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatCohere } from '@langchain/cohere'
import { ChatMistralAI } from '@langchain/mistralai'
import { ChatVertexAI } from '@langchain/google-vertexai'
// Hugging Face will be supported once the following package becomes available
// import { ChatHuggingFace } from "@langchain/huggingface"

import {
  AssistantInput,
  AssistantAction,
  AssistantMessage,
  AssistantRequest,
  AssistantSceneSegment,
  AssistantStorySentence,
  ComputeProvider,
} from '@aitube/clapper-services'

import { examples, humanTemplate, systemTemplate } from './templates'
import { isValidNumber } from '@/lib/utils'
import { assistantMessageParser, formatInstructions } from './parser'
import { parseRawInputToAction } from '@/services/assistant/parseRawInputToAction'

/**
 * Query the preferred language model on the user prompt + the segments of the current scene
 *
 * @param userPrompt
 * @param segments
 * @returns
 */
export async function askAnyAssistant({
  settings,

  prompt,

  // the slice to edit
  segments = [],

  fullScene = '',

  actionLine = '',

  // used to provide more context
  entities = {},

  // used to provide more context
  projectInfo = '',

  history = [],
}: AssistantRequest): Promise<AssistantMessage> {
  const provider = settings.assistantProvider

  if (!provider) {
    throw new Error(`Missing assistant provider`)
  }

  let coerceable:
    | undefined
    | RunnableLike<ChatPromptValueInterface, AIMessageChunk> =
    provider === ComputeProvider.GROQ
      ? new ChatGroq({
          apiKey: settings.groqApiKey,
          modelName: settings.assistantModel,
          // temperature: 0.7,
        })
      : provider === ComputeProvider.OPENAI
        ? new ChatOpenAI({
            openAIApiKey: settings.openaiApiKey,
            modelName: settings.assistantModel,
            // temperature: 0.7,
          })
        : provider === ComputeProvider.ANTHROPIC
          ? new ChatAnthropic({
              anthropicApiKey: settings.anthropicApiKey,
              modelName: settings.assistantModel,
              // temperature: 0.7,
            })
          : provider === ComputeProvider.COHERE
            ? new ChatCohere({
                apiKey: settings.cohereApiKey,
                model: settings.assistantModel,
                // temperature: 0.7,
              })
            : provider === ComputeProvider.MISTRALAI
              ? new ChatMistralAI({
                  apiKey: settings.mistralAiApiKey,
                  modelName: settings.assistantModel,
                  // temperature: 0.7,
                })
              : provider === ComputeProvider.GOOGLE
                ? new ChatVertexAI({
                    apiKey: settings.googleApiKey,
                    modelName: settings.assistantModel,
                    // temperature: 0.7,
                  })
                : undefined

  if (!coerceable) {
    throw new Error(
      `Provider ${provider} is not supported yet. If a LangChain bridge exists for this provider, then you can add it to Clapper.`
    )
  }

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    new MessagesPlaceholder('chatHistory'),
    ['human', humanTemplate],
  ])

  //const storySentences: AssistantStorySentence[] = fullScene.split(/(?:. |\n)/).map(storySentence => {
  //})

  const storySentences: AssistantStorySentence[] = [
    {
      sentenceId: 0,
      sentence: fullScene,
    },
    {
      sentenceId: 1,
      sentence: actionLine,
    },
  ]

  // we don't give the whole thing to the LLM as to not confuse it,
  // and also to keep things tight and performant
  const sceneSegments: AssistantSceneSegment[] = segments.map((segment, i) => ({
    segmentId: i,
    prompt: segment.prompt,
    startTimeInMs: segment.startTimeInMs,
    endTimeInMs: segment.endTimeInMs,
    category: segment.category,
  }))

  // TODO put this into a type
  const inputData: AssistantInput = {
    directorRequest: prompt,
    storySentences,
    sceneSegments,
  }

  // console.log("INPUT:", JSON.stringify(inputData, null, 2))

  const chain = chatPrompt.pipe(coerceable).pipe(assistantMessageParser)

  const assistantMessage: AssistantMessage = {
    comment: '',
    action: AssistantAction.NONE,
    updatedStorySentences: [],
    updatedSceneSegments: [],
  }
  try {
    const rawResponse = await chain.invoke({
      formatInstructions,
      examples,
      projectInfo,
      inputData: JSON.stringify(inputData),
      chatHistory: history.map(
        ({
          eventId,
          senderId,
          senderName,
          roomId,
          roomName,
          sentAt,
          message,
          isCurrentUser,
        }) => {
          if (isCurrentUser) {
            return new HumanMessage(message)
          } else {
            return new AIMessage(message)
          }
        }
      ),
    })

    console.log(
      'LLM replied this rawResponse:',
      JSON.stringify(rawResponse, null, 2)
    )

    // this is a fallback in case of LLM failure
    if (!rawResponse) {
      // complete failure
    } else if (typeof rawResponse === 'string') {
      assistantMessage.action = parseRawInputToAction(rawResponse)
      if (assistantMessage.action === AssistantAction.NONE) {
        assistantMessage.comment = rawResponse
      }
    } else {
      assistantMessage.comment =
        typeof rawResponse.comment === 'string' ? rawResponse.comment : ''

      assistantMessage.action = Object.keys(AssistantAction).includes(
        `${rawResponse.action || ''}`.toUpperCase()
      )
        ? rawResponse.action
        : AssistantAction.NONE

      let i = 0
      for (const segment of rawResponse.updatedSceneSegments || []) {
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
    }
  } catch (err) {
    let errorPlainText = `${err}`
    errorPlainText =
      errorPlainText.split(`Error: Failed to parse. Text: "`).pop() ||
      errorPlainText
    errorPlainText =
      errorPlainText.split(`". Error: SyntaxError`).shift() || errorPlainText

    if (errorPlainText) {
      console.log(
        `result wasn't a JSON, switching to the fallback LLM response parser..`
      )
      assistantMessage.comment = errorPlainText
      assistantMessage.action = AssistantAction.NONE
      assistantMessage.updatedSceneSegments = []
      assistantMessage.updatedStorySentences = []
    } else {
      throw new Error(
        `couldn't process the request or parse the response (${err})`
      )
    }
  }

  return assistantMessage
}
