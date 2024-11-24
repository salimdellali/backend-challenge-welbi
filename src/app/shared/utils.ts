export function explodeStringOnCommas(str: string | null): string[] {
  if (!str || str === null) return []
  if (!str.includes(",")) return [str]
  return str.split(",")
}

export function countSimilarValues(
  firstArray: string[],
  secondArray: string[]
) {
  // Use a Set for fast lookup
  const firstArraySet = new Set(firstArray)

  // Count values from the second array that exist in the first array
  const count = secondArray.reduce((acc, value) => {
    if (firstArraySet.has(value)) {
      acc += 1
    }
    return acc
  }, 0)

  return count
}
