import { RenderingStrategy } from "@/types"

export function parseRenderingStrategy(input: any, defaultStrategy?: RenderingStrategy): RenderingStrategy {
  
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(RenderingStrategy).includes(unknownString as RenderingStrategy)) {
    return unknownString as RenderingStrategy
  }

  let strategy: RenderingStrategy = defaultStrategy || RenderingStrategy.ON_DEMAND

  unknownString = unknownString.toLowerCase()

  if (unknownString === "on_demand") {
    strategy = RenderingStrategy.ON_DEMAND
  }
  else if (unknownString === "on_screen_only") {
    strategy = RenderingStrategy.ON_SCREEN_ONLY
  }
  else if (unknownString === "on_screen_then_surrounding") {
    strategy = RenderingStrategy.ON_SCREEN_THEN_SURROUNDING
  }
  else if (unknownString === "on_screen_then_all") {
    strategy = RenderingStrategy.ON_SCREEN_THEN_ALL
  } else {
    strategy = RenderingStrategy.ON_DEMAND
  }
  return strategy
}