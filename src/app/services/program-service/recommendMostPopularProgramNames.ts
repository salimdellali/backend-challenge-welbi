import { Program } from "../../database/models/Program"
import { ProgramRepository } from "../../database/repositories/program.repository"
import {
  buildErrorResultDTO,
  buildSuccessResultDTO,
  Result,
  getUpToFirst3ProgramNames,
} from "../../shared/utils"

export function recommendMostPopularProgramNames(): Result<string[]> {
  const allPrograms: Program[] = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot get most popular programs",
      404
    )
  }
  // programs found

  // sort programs by number of attendees
  // programs will be sorted from most to least popular
  const sortedProgramsByNbAttendees: Program[] = allPrograms.sort((a, b) => {
    return b.attendees.length - a.attendees.length
  })

  // filter duplicate programs by name
  const uniquePrograms: Program[] =
    ProgramRepository.filterDuplicateProgramsByProgramName(
      sortedProgramsByNbAttendees
    )
  const topProgramNames: string[] = getUpToFirst3ProgramNames(uniquePrograms)

  return buildSuccessResultDTO(topProgramNames)
}
