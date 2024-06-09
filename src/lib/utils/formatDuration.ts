export const HOUR = 60 * 60;
export const MINUTE = 60;

export function formatDuration(float_s: number) {
  const hours = Math.floor(float_s / HOUR);
  float_s = float_s - hours * HOUR;
  const minutes = Math.floor(float_s / MINUTE);
  const seconds = float_s - minutes * MINUTE;
  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds, 5)}`;
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