import { ResidentRepository } from "../../database/repositories/resident.repository"
import { ProgramRepository } from "../../database/repositories/program.repository"
import {
  explodeStringOnCommas,
  countSimilarValues,
  buildErrorResultDTO,
  buildSuccessResultDTO,
  getUpToFirst3ProgramNames,
  Result,
} from "../../shared/utils"
import { Resident } from "../../database/models/Resident"
import { Program } from "../../database/models/Program"

export function recommendInterestingProgramNamesForResidentByResidentName(
  residentName: string
): Result<string[]> {
  const resident: Resident | null =
    ResidentRepository.getFirstResidentByName(residentName)
  if (!resident) {
    return buildErrorResultDTO(
      `Resident not found with name: ${residentName}`,
      404
    )
  }

  // resident found
  if (!resident.hobbies) {
    return buildErrorResultDTO(
      "Resident has no hobbies defined, cannot recommend programs",
      404
    )
  }

  // resident might have hobbies
  const residentHobbiesArray: string[] = explodeStringOnCommas(resident.hobbies)
  if (!residentHobbiesArray.length) {
    return buildErrorResultDTO(
      "Resident has empty hobbies, cannot recommend programs",
      404
    )
  }

  // @TODO: maybe return 3 random programs here if no hobbies found, who knows what the resident might like
  // return 3 random programs that at least match the same level of care of the resident

  // resident has at least one hobby
  const allPrograms: Program[] = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot recommend programs",
      404
    )
  }
  // programs found

  const programsWithResidentHobbies: Program[] =
    ProgramRepository.filterProgramsByHobbies(
      allPrograms,
      explodeStringOnCommas(resident.hobbies)
    )
  if (!programsWithResidentHobbies.length) {
    return buildErrorResultDTO(
      "No programs found with resident hobbies, cannot recommend programs",
      404
    )
  }
  // programs with resident hobbies found

  // sort programs with hobbies that are most similar to resident hobbies
  // programs will be sorted from most similar to least similar
  const sortedProgramsByMostSimilarResidentHobbies: Program[] =
    programsWithResidentHobbies.toSorted((programA, programB) => {
      const hobbiesSimilarityScoreA = countSimilarValues(
        explodeStringOnCommas(programA.hobbies),
        residentHobbiesArray
      )
      const hobbiesSimilarityScoreB = countSimilarValues(
        explodeStringOnCommas(programB.hobbies),
        residentHobbiesArray
      )
      return hobbiesSimilarityScoreB - hobbiesSimilarityScoreA // sort by most similar hobbies
    })

  // filter duplicate program names by name
  const uniqueProgramNames: string[] =
    ProgramRepository.filterDuplicateProgramsByProgramName(
      sortedProgramsByMostSimilarResidentHobbies
    ).map((program) => program.name)

  const topProgramNames: string[] =
    getUpToFirst3ProgramNames(uniqueProgramNames)

  // @TODO: refine more the recommendation by randomizing
  // programs with same similarity scores
  return buildSuccessResultDTO(topProgramNames)
}
