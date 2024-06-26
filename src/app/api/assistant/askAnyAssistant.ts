"use server"

import { ClapSegmentCategory } from "@aitube/clap"
import { RunnableLike } from "@langchain/core/runnables"
import { ChatPromptValueInterface } from "@langchain/core/prompt_values"
import { AIMessage, AIMessageChunk, HumanMessage } from "@langchain/core/messages"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGroq } from "@langchain/groq"
import { ChatAnthropic } from "@langchain/anthropic"
import { ChatCohere } from "@langchain/cohere"
import { ChatMistralAI } from "@langchain/mistralai"
import { ChatVertexAI } from "@langchain/google-vertexai"
// Hugging Face will be supported once the following package becomes available
// import { ChatHuggingFace } from "@langchain/huggingface"

import { AssistantRequest, AssistantResponse, ComputeProvider } from "@aitube/clapper-services"

import { SimplifiedSegmentData, simplifiedSegmentDataZ } from "./types"
import { examples, humanTemplate, systemTemplate } from "./templates"

const parser = StructuredOutputParser.fromZodSchema(simplifiedSegmentDataZ)

const formatInstructions = parser.getFormatInstructions()

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

  fullScene = "",

  actionLine = "",

  // used to provide more context
  entities = {},

  // used to provide more context
  projectInfo = "",

  history = [],
}: AssistantRequest): Promise<AssistantResponse> {

  const provider = settings.assistantProvider

  if (!provider) { throw new Error(`Missing assistant provider`)}

  let coerceable: undefined | RunnableLike<ChatPromptValueInterface, AIMessageChunk> =
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

  if (!coerceable) { throw new Error(`Provider ${provider} is not supported yet. If a LangChain bridge exists for this provider, then you can add it to Clapper.`)}

  const chatPrompt = ChatPromptTemplate.fromMessages(
    [
      ["system", systemTemplate],
      new MessagesPlaceholder("chatHistory"),
      ["human", humanTemplate],
    ]
  )

  // we don't give the whole thing to the LLM as to not confuse it,
  // and also to keep things tight and performant
  const inputData: SimplifiedSegmentData[] = segments.map((segment) => ({
    prompt: segment.prompt,
    category: segment.category,
  } as SimplifiedSegmentData))

  // console.log("INPUT:", JSON.stringify(inputData, null, 2))

  const chain = chatPrompt.pipe(coerceable).pipe(parser)

  try {
    const result = await chain.invoke({
      formatInstructions,
      examples,
      projectInfo,
      fullScene,
      actionLine,
      userPrompt: prompt,
      chatHistory: history.map(({
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
      }),
      inputData: JSON.stringify(inputData),
    })

    // console.log("OUTPUT:", JSON.stringify(result, null, 2))

    /*
    this whole code doesn't work well actually..

    let match: SegmentData | undefined = segments[result.index] || undefined

    // LLM gave an object, but the index is wrong
    if (!match) {
      match = segments.find(s => s.category === result.category) || undefined
    }
    */
    
    // let's create a new segment then!
    const categoryName: ClapSegmentCategory =
      result?.category && Object.keys(ClapSegmentCategory).includes(result.category.toUpperCase())
      ? (result.category as ClapSegmentCategory)
      : ClapSegmentCategory.GENERIC

    return {
      prompt: result?.prompt || "",
      categoryName,
      llmOutput: "",
    }
  } catch (err1) {

    // a common scenario is when the output from the LLM is just not a JSON
    // this can happen quite often, for instance if the user tried to bypass
    // our prompt, or if they are just asking generic questions
    const errObj = err1 as any
    try {
      const keys = Object.keys(errObj)
      if (errObj.llmOutput) {
        return {
          prompt: "",
          categoryName: ClapSegmentCategory.GENERIC,
          llmOutput: `${errObj.llmOutput || ""}`,
        }
      }
    } catch (err2) {
      // err2 is just the error for when the LLM failed to reply
      console.error(`----<${err1}>----`)
    }

    return {
      prompt: "",
      categoryName: ClapSegmentCategory.GENERIC,
      llmOutput: ""
    }
  }
}