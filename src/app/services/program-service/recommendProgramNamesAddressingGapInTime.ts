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
  const groupedProgramsByStartDateMap = new Map<string, Program[]>()
  for (const program of allPrograms) {
    const programStartDate = extractDateStringFromISODateTimeUTC(program.start)

    if (!groupedProgramsByStartDateMap.has(programStartDate)) {
      groupedProgramsByStartDateMap.set(programStartDate, [])
    }
    groupedProgramsByStartDateMap.get(programStartDate)!.push(program)
  }

  // sort programs by least number of programs per date
  // programs will be sorted from lowest number of occurred programs per date to highest number of occurred programs per date
  const sortedProgramsByNbProgramsPerDate: [string, Program[]][] = Array.from(
    groupedProgramsByStartDateMap.entries()
  ).sort(([dateA, programsA], [dateB, programsB]) => {
    return programsA.length - programsB.length
  })

  // Take programs of the 5 least packed dates
  // @TODO: make the number of least packed dates configurable
  const programsOfLeastPackedDates: [string, Program[]][] =
    sortedProgramsByNbProgramsPerDate.slice(0, 5)

  // count program occurrences on least packed dates
  const programNamesOccurrencesOfLeastPackedDatesMap = new Map<string, number>()
  programsOfLeastPackedDates.forEach(([date, programs]) => {
    programs.forEach((program) => {
      setOrIncrementMapValueByKey(
        programNamesOccurrencesOfLeastPackedDatesMap,
        program.name
      )
    })
  })

  // get up to 3 most popular program names on least packed dates
  const recommendedProgramNamesOnLeastPackedDates = Array.from(
    programNamesOccurrencesOfLeastPackedDatesMap.entries()
  )
    .sort(
      (
        [programNameA, programOccurrencesA],
        [programNameB, programOccurrencesB]
      ) => {
        return programOccurrencesB - programOccurrencesA // sort by highest number of occurrences
      }
    )
    .slice(0, 3)
    .map(([programName, programOccurrence]) => programName)

  return buildSuccessResultDTO(recommendedProgramNamesOnLeastPackedDates)
}
