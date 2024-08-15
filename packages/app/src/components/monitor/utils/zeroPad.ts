export function zeroPad(num: number, size = 2) {
  return String(num).padStart(size, '0')
}
