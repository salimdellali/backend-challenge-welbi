import { ResidentRepository } from "../../database/repositories/resident.repository"
import { ProgramRepository } from "../../database/repositories/program.repository"
import {
  explodeStringOnCommas,
  countSimilarValues,
  buildErrorResultDTO,
  buildSuccessResultDTO,
  getUpToFirst3ProgramNames,
  filterDuplicateProgramsByProgramName,
  BuildResultDTOReturnType,
} from "../../shared/utils"

export function recommendInterestingProgramNamesForResidentByResidentName(
  residentName: string
): BuildResultDTOReturnType {
  const resident = ResidentRepository.getFirstResidentByName(residentName)
  if (!resident) {
    return buildErrorResultDTO(
      `Resident with name "${residentName}" not found`,
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
  const residentHobbiesArray = explodeStringOnCommas(resident.hobbies)
  if (!residentHobbiesArray.length) {
    return buildErrorResultDTO(
      "Resident has empty hobbies, cannot recommend programs",
      404
    )
  }

  // @TODO: maybe return 3 random programs here if no hobbies found, who knows what the resident might like
  // return 3 random programs that at least match the same level of care of the resident

  // resident has at least one hobby
  const allPrograms = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot recommend programs",
      404
    )
  }

  // programs found
  const programsWithResidentHobbies = ProgramRepository.filterProgramsByHobbies(
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

  // order programs with hobbies that are most similar to resident hobbies
  // programs will be sorted from most similar to least similar
  const orderedProgramsByMostSimilarResidentHobbies =
    programsWithResidentHobbies.sort((a, b) => {
      const aSimilarityScore = countSimilarValues(
        explodeStringOnCommas(a.hobbies!),
        residentHobbiesArray
      )
      const bSimilarityScore = countSimilarValues(
        explodeStringOnCommas(b.hobbies!),
        residentHobbiesArray
      )
      return bSimilarityScore - aSimilarityScore
    })

  // filter duplicate programs by name
  const uniqueResidentMostInterestingPrograms =
    filterDuplicateProgramsByProgramName(
      orderedProgramsByMostSimilarResidentHobbies
    )

  const recommendedProgramNamesForResident = getUpToFirst3ProgramNames(
    uniqueResidentMostInterestingPrograms
  )

  // @TODO: refine more the recommendation by randomizing
  // programs with same similarity scores
  return buildSuccessResultDTO(recommendedProgramNamesForResident)
}
