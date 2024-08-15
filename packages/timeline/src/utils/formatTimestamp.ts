export function formatTimestamp(duration: number, {
  hours: showHours,
  minutes: showMinutes,
  seconds: showSeconds,
  milliseconds: showMilliseconds,
}: {
  hours: boolean
  minutes: boolean
  seconds: boolean
  milliseconds: boolean
}) {
  let milliseconds = Math.floor((duration % 1000) / 100)
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  let strHours = (hours < 10) ? "0" + hours : hours;
  let strMinutes = (minutes < 10) ? "0" + minutes : minutes;
  let strSeconds = (seconds < 10) ? "0" + seconds : seconds;
  
  // full padding gives a more "pro" look, but not sure we need it
  // let strMilliseconds = String(milliseconds).padEnd(3, '0')

  let strMilliseconds = String(milliseconds)

  let result = ''
  if (showHours) {
    result += strHours +  ((showMinutes || showSeconds || showMilliseconds) ? ":" : "")
  }
  if (showMinutes) {
    result += strMinutes +  ((showSeconds || showMilliseconds) ? ":" : "")
  }
  if (showSeconds) {
    result += strSeconds + (showMilliseconds ? "" : "")
  }
  if (showMilliseconds) {
    result += '.' + strMilliseconds
  }

  return result
}