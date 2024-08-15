export function generateSeed() {
  return Math.floor(Math.random() * Math.pow(2, 31));
}