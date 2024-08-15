export function deduplicate(items: string[]): string[] {
  return Object.keys(items.reduce((acc, item) => ({ ...acc, [item]: item }), {}))
}