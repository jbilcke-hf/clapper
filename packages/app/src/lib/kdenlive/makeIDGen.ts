export function* makeIDGen(first = 1): Generator<number, number> {
  let i = first
  while (true) {
    yield i
    i++
  }
}
