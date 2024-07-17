export function splitElapsedTime(elapsedTime: number) {
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60)).toFixed(0)
  elapsedTime %= 1000 * 60 * 60
  const minutes = Math.floor(elapsedTime / (1000 * 60)).toFixed(0)
  elapsedTime %= 1000 * 60
  const seconds = Math.floor(elapsedTime / 1000).toFixed(0)
  const milliseconds = (elapsedTime % 1000).toFixed(0)
  return {
    hours: parseInt(hours),
    minutes: parseInt(minutes),
    seconds: parseInt(seconds),
    milliseconds: parseInt(milliseconds),
  }
}
