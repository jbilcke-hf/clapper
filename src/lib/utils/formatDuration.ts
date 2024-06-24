export const HOUR = 60 * 60 * 1000; // Converted to milliseconds
export const MINUTE = 60 * 1000; // Converted to milliseconds

export function formatDuration(float_ms: number) {

  let float_s = float_ms / 1000; // Converted to seconds
  
  const hours = Math.floor(float_s / HOUR);
  float_s = float_s % HOUR;
  const minutes = Math.floor(float_s / MINUTE);
  float_s = float_s % MINUTE;
  const seconds = float_s;

  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds, 3)}`;
}

export function twoDigits(number: number, decimal = 0) {
  let [int, dec] = number.toFixed(decimal).split(".");
  dec = dec || "";
  if (dec == "") {
    return int.padStart(2, "0");
  } else {
    return int.padStart(2, "0") + "." + dec;
  }
}