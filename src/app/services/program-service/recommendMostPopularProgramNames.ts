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
  const sortedProgramsByNbAttendees: Program[] = allPrograms.toSorted(
    (programA, programB) => {
      return programB.attendees.length - programA.attendees.length // sort by most number of attendees
    }
  )

  // filter duplicate program names by name
  const uniqueProgramNames: string[] =
    ProgramRepository.filterDuplicateProgramsByProgramName(
      sortedProgramsByNbAttendees
    ).map((program) => program.name)

  const topProgramNames: string[] =
    getUpToFirst3ProgramNames(uniqueProgramNames)

  return buildSuccessResultDTO(topProgramNames)
}
