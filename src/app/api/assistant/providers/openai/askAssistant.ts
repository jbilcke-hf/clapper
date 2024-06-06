"use server"

import { ClapSegmentCategory, ClapScene, } from "@aitube/clap"
import { ChatOpenAI } from "@langchain/openai"

import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { AssistantRequest, AssistantResponse } from "@/types"
import { SimplifiedSegmentData, simplifiedSegmentDataZ } from "../../types"
import { examples, humanTemplate, systemTemplate } from "../../templates"


const parser = StructuredOutputParser.fromZodSchema(simplifiedSegmentDataZ)

const formatInstructions = parser.getFormatInstructions()


/**
 * Query the preferred language model on the user prompt + the segments of the current scene
 * @param userPrompt 
 * @param segments 
 * @returns 
 */
export async function queryAssistant({
  settings,

  prompt,

  // the slice to edit
  segments = [],

  fullScene = "",

  actionLine = "",

  // used to provide more context
  entities = {},

  // used to provide more context
  projectInfo = ""
}: AssistantRequest): Promise<AssistantResponse> {

    // TODO: 
  const model = new ChatOpenAI({
    openAIApiKey: settings.openaiApiKey,
    modelName: settings.openaiModelForAssistant,
    temperature: 0.7,
  })

  const chatPrompt = ChatPromptTemplate.fromMessages(
    [
      ["system", systemTemplate],
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

  const chain = chatPrompt.pipe(model).pipe(parser)

  try {
    const result = await chain.invoke({
      formatInstructions,
      examples,
      projectInfo,
      fullScene,
      actionLine,
      userPrompt: prompt,
      inputData,
    })

    console.log("OUTPUT:", JSON.stringify(result, null, 2))

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
      // console.log("keys:", keys)
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