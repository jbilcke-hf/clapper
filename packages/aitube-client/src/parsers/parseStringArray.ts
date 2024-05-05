export function parseStringArray(something: any): string[] {
  let result: string[] = []
  if (typeof something === "string") {
    result = [something]
  } else if (Array.isArray(something)) {
    result = something.map(thing => typeof thing === "string" ? thing : "").filter(x => x)
  }
  return result
}