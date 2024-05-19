// used to detect anomalies such as lines with only "3." "42." in it,
// possibly indicating a chapter or something
export function onlyContainsStrangeNumber(text: string) {
  return text.match(/\S*\d+\.\S*/gi)
}