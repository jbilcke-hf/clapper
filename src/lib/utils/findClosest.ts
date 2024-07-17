export function findClosest(
  target: number,
  numbers: number[]
): number | undefined {
  // Check if the numbers array is empty
  if (numbers.length === 0) {
    // throw new Error("The numbers array is empty.");
    return undefined
  }

  // Sort the numbers based on their distance to the target
  numbers.sort((a, b) => Math.abs(target - a) - Math.abs(target - b))

  // Return the number closest to the target
  return numbers[0]
}
