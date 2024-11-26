import { Program } from "../../database/models/Program"
import { ProgramRepository } from "../../database/repositories/program.repository"
import {
  Result,
  extractDateStringFromISODateTimeUTC,
  setOrIncrementMapValueByKey,
} from "../../shared/utils"
import { buildErrorResultDTO, buildSuccessResultDTO } from "../../shared/utils"

export function recommendProgramNamesAddressingGapInTime(): Result<string[]> {
  const allPrograms = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot recommend programs addressing gap in time",
      404
    )
  }
  // programs found

  // group programs by date
  const groupedProgramNamesByStartDateMap = new Map<string, string[]>()
  for (const program of allPrograms) {
    const programStartDate = extractDateStringFromISODateTimeUTC(program.start)

    if (!groupedProgramNamesByStartDateMap.has(programStartDate)) {
      groupedProgramNamesByStartDateMap.set(programStartDate, [])
    }
    groupedProgramNamesByStartDateMap.get(programStartDate)!.push(program.name)
  }

  // sort programs by least number of programs per date
  // programs will be sorted from lowest number of occurred programs per date to highest number of occurred programs per date
  const sortedProgramNamesByNbProgramsPerDate: [string, string[]][] =
    Array.from(groupedProgramNamesByStartDateMap.entries()).sort(
      ([dateA, programNamesA], [dateB, programsNamesB]) => {
        return programNamesA.length - programsNamesB.length
      }
    )

  // Take programs of the 5 least packed dates
  // @TODO: make the number of least packed dates configurable
  const programNamesOfLeastPackedDates: [string, string[]][] =
    sortedProgramNamesByNbProgramsPerDate.slice(0, 5)

  // count program occurrences on least packed dates
  const programNamesOccurrencesOfLeastPackedDatesMap = new Map<string, number>()
  programNamesOfLeastPackedDates.forEach(([date, programNames]) => {
    programNames.forEach((programName) => {
      // set or increment program name occurrence
      setOrIncrementMapValueByKey(
        programNamesOccurrencesOfLeastPackedDatesMap,
        programName
      )
    })
  })

  // get up to 3 most popular program names on least packed dates
  const recommendedProgramNamesOnLeastPackedDates: string[] = Array.from(
    programNamesOccurrencesOfLeastPackedDatesMap.entries()
  )
    .sort(
      (
        [programNameA, programOccurrenceA],
        [programNameB, programOccurrenceB]
      ) => {
        return programOccurrenceB - programOccurrenceA // sort by highest number of occurrences
      }
    )
    .slice(0, 3)
    .map(([programName, programOccurrence]) => programName)

  return buildSuccessResultDTO(recommendedProgramNamesOnLeastPackedDates)
}
