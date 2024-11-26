import { NextResponse } from "next/server"
import { Program } from "../database/models/Program"

export function explodeStringOnCommas(str: string | null): string[] {
  if (!str || str === null) return []
  if (!str.includes(",")) return [str]
  return str.split(",")
}

export function countSimilarValues(
  firstArray: string[],
  secondArray: string[]
): number {
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

export function getUpToFirst3ProgramNames(programs: Program[]): string[] {
  const upToFirst3Programs = programs.slice(0, 3)

  // return program names
  return upToFirst3Programs.map((program) => program.name)
}

export function setOrIncrementMapValueByKey(
  map: Map<string, number>,
  key: string
): void {
  if (map.has(key)) {
    map.set(key, map.get(key)! + 1)
  } else {
    map.set(key, 1)
  }
}

export function extractDateStringFromISODateTimeUTC(
  isoDateTime: string
): string {
  // Create a Date object from the ISO 8601 string
  const date = new Date(isoDateTime)

  // Extract the date portion in YYYY-MM-DD format
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0") // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

// @TODO: find a better place to store these functions and types
type SuccessResult<T> = {
  data: T
  error: null
}

type ErrorResult = {
  data: null
  error: {
    message: string
    httpStatusCode: number
  }
}

export function buildSuccessResultDTO<T>(data: T): SuccessResult<T> {
  return {
    data,
    error: null,
  }
}

export function buildErrorResultDTO(
  message: string,
  httpStatusCode: number
): ErrorResult {
  return {
    data: null,
    error: {
      message,
      httpStatusCode,
    },
  }
}

export type Result<T> = SuccessResult<T> | ErrorResult

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
