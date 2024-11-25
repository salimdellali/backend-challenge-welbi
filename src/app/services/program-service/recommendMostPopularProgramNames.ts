import { ProgramRepository } from "../../database/repositories/program.repository"
import {
  buildErrorResultDTO,
  buildSuccessResultDTO,
  BuildResultDTOReturnType,
  filterDuplicateProgramsByProgramName,
  getUpToFirst3ProgramNames,
} from "../../shared/utils"

export function recommendMostPopularProgramNames(): BuildResultDTOReturnType {
  const allPrograms = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot get most popular programs",
      404
    )
  }
  // programs found

  // sort programs by number of attendees
  // programs will be sorted from most to least popular
  const sortedProgramsByNbAttendees = allPrograms.sort((a, b) => {
    return b.attendees.length - a.attendees.length
  })

  // filter duplicate programs by name
  const uniqueSortedProgramsByProgramName =
    filterDuplicateProgramsByProgramName(sortedProgramsByNbAttendees)

  const recommendedMostPopularProgramNames = getUpToFirst3ProgramNames(
    uniqueSortedProgramsByProgramName
  )

  return buildSuccessResultDTO(recommendedMostPopularProgramNames)
}
