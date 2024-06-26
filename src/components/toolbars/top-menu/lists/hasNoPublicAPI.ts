import { ComputeProvider } from "@aitube/clapper-services"

export function hasNoPublicAPI(model: string) {
  model = model.toLowerCase()
  if (
    model.includes("no public api") ||
    model.includes("no api") ||
    model.includes("not available") ||
    model.includes("no image api") ||
    model.includes("no video api") ||
    model.includes("no music api") ||
    model.includes("no sound api") ||
    model.includes("no voice api") ||
    model.includes("unavailable") ||
    model === ComputeProvider.SUNO ||
    model === ComputeProvider.KUAISHOU ||
    model === ComputeProvider.RUNWAYML ||
    model === ComputeProvider.LUMALABS ||
    model === ComputeProvider.HEDRA ||
    model === ComputeProvider.UDIO
  ) {
    return true
  }
  return false
}