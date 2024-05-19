export function pick<T>(items: T[]) {
  return items[Math.floor(Math.random()*items.length)]
}
