import { NextResponse } from "next/server"

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

// @TODO: find a better place to store these functions
export function buildSuccessResultDTO<T>(data: T) {
  return {
    data,
    error: null,
  }
}

export function buildErrorResultDTO(message: string, httpStatusCode: number) {
  return {
    data: null,
    error: {
      message,
      httpStatusCode,
    },
  }
}

export function buildNextSuccessResponse<T>(data: T) {
  return NextResponse.json(buildSuccessResultDTO(data), { status: 200 })
}

export function buildNextErrorResponseDTO(
  message: string,
  httpStatusCode: number
) {
  return NextResponse.json(buildErrorResultDTO(message, httpStatusCode), {
    status: httpStatusCode,
  })
}
