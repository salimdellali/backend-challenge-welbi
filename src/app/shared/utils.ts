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

/**
 *
 * @param isoDateTimeUTC
 * @example "2022-07-01T00:00:00.000Z"
 * @returns Date in "YYYY-MM-DD"
 * @example "2022-07-01"
 */
export function extractDateStringFromISODateTimeUTC(
  isoDateTimeUTC: string
): string {
  // Create a Date object from the ISO 8601 string
  const date = new Date(isoDateTimeUTC)

  // Extract the date portion in YYYY-MM-DD format
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0") // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, "0")

  return `${year}-${month}-${day}` // "YYYY-MM-DD"
}

export const countDaysBetweenISODateTimesUTC = (
  isoDateTimeUTC1: string,
  isoDateTimeUTC2: string
): number => {
  // Convert the ISO date-time strings into Date objects
  const date1 = new Date(isoDateTimeUTC1)
  const date2 = new Date(isoDateTimeUTC2)

  // Calculate the difference in time (milliseconds)
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime())

  // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24)

  // Return the number of days (rounded to the nearest integer)
  return Math.round(diffInDays)
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
