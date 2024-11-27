import { Program } from "../../database/models/Program"
import { ProgramRepository } from "../../database/repositories/program.repository"
import {
  Result,
  extractDateStringFromISODateTimeUTC,
  getUpToFirst3ProgramNames,
  setOrIncrementMapValueByKey,
  buildErrorResultDTO,
  buildSuccessResultDTO,
} from "../../shared/utils"

// @TODO: make the picked number of least packed dates configurable
const NUMBER_OF_LEAST_PACKED_DAYS = 5

export function recommendProgramNamesAddressingGapInTime(): Result<string[]> {
  const allPrograms: Program[] = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot recommend programs addressing gap in time",
      404
    )
  }
  // programs found

  // group programs by date
  const groupedProgramNamesByStartDateMap = new Map<
    string, // date
    string[] // array of program names that happened on that date
  >()
  for (const program of allPrograms) {
    const programStartDate: string = extractDateStringFromISODateTimeUTC(
      program.start
    )

    // get or initialize program names per date
    const programNames: string[] =
      groupedProgramNamesByStartDateMap.get(programStartDate) ?? []

    // insert new program name
    programNames.push(program.name)

    // update date entry
    groupedProgramNamesByStartDateMap.set(programStartDate, programNames)
  }

  // sort programs by least number of programs per date
  // programs will be sorted from lowest number of occurred programs per date to highest number of occurred programs per date
  const sortedProgramNamesByNbProgramsPerDate: [
    string, // date
    string[] // array of program names that happened on that date
  ][] = [...groupedProgramNamesByStartDateMap].toSorted(
    ([dateA, programNamesA], [dateB, programsNamesB]) => {
      return programNamesA.length - programsNamesB.length // sort by lowest number of occurred programs per date
    }
  )

  // Take programs of the 5 least packed dates
  const programNamesOfLeastPackedDates: [
    string, // date
    string[] // array of program names that happened on that date
  ][] = sortedProgramNamesByNbProgramsPerDate.slice(
    0,
    NUMBER_OF_LEAST_PACKED_DAYS
  )

  // count program occurrences on least packed dates
  const programNamesOccurrencesOfLeastPackedDatesMap = new Map<string, number>()
  for (const [date, programNames] of programNamesOfLeastPackedDates) {
    for (const programName of programNames) {
      // set or increment program name occurrence
      setOrIncrementMapValueByKey(
        programNamesOccurrencesOfLeastPackedDatesMap,
        programName
      )
    }
  }

  // sort program names by highest number of occurrences
  const sortedProgramNamesByMostOccurrences: string[] = [
    ...programNamesOccurrencesOfLeastPackedDatesMap,
  ]
    .toSorted(
      (
        [programNameA, programOccurrenceA],
        [programNameB, programOccurrenceB]
      ) => {
        return programOccurrenceB - programOccurrenceA // sort by highest number of occurrences
      }
    )
    .map(([programName, programOccurrence]) => programName)

  // get up to 3 most popular program names on least packed dates
  const topProgramNames: string[] = getUpToFirst3ProgramNames(
    sortedProgramNamesByMostOccurrences
  )

  return buildSuccessResultDTO(topProgramNames)
}
