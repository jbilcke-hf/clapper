import { GradioApiInfo, GradioEndpoint, SupportedFields } from "../types"
import { identifyField } from "./identifyField"
import { getDefaultFields } from "./getDefaultFields"
import { getAdaptationScore } from "./getAdaptationScore"

/**
 * Find the main entrypoint (main entry endpoint) of a Gradio API
 */
export function findMainGradioEndpoint({
  gradioApiInfo,
}: {
  gradioApiInfo: GradioApiInfo
}): GradioEndpoint | undefined {
  const endpoints: GradioEndpoint[] = [
    ...Object.entries(gradioApiInfo.named_endpoints)
      .map(([name, endpoint]) => ({ isNamed: true, name, endpoint, fields: {}, score: 0 })),
    ...Object.entries(gradioApiInfo.unnamed_endpoints)
      .map(([name, endpoint]) => ({ isNamed: true, name, endpoint, fields: {}, score: 0 })),  
  ]

  // generally the main entry point will be called "/run", "/call", "/predict" etc
  // and contain stuff we usually expect: a text prompt, or image etc
  const sortableEndpoints = endpoints.map(({ isNamed, name, endpoint, score }) => {
    console.log(`found endpoint: ${name}`)

    // const isContinuous = !!endpoint.type?.continuous
    // const isGenerator = !!endpoint.type?.generator
    // const canCancel = !!endpoint.type?.cancel
    
    let gradioFields: Record<string, Partial<SupportedFields>> = {}
    let allGradioFields = getDefaultFields()
    for (const gradioParameter of endpoint.parameters) {
      const gradioParameterField = identifyField(
        gradioParameter.parameter_name,
        gradioParameter.parameter_default
      )
      gradioFields[gradioParameter.parameter_name] = gradioParameterField
      allGradioFields = { ...allGradioFields, ...gradioParameterField }
    }
  
    score = getAdaptationScore(allGradioFields)
    console.log(`allGradioFields:`, allGradioFields)
    console.log(`score:`, score)

    return {
      isNamed,
      name,
      endpoint,
      fields: gradioFields,
      score,
    }
  })

  return  sortableEndpoints.sort((a, b) => {
    return b.score - a.score
  }).at(0)
}