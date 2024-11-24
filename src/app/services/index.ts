import { ResidentRepository } from "../database/repositories/resident.repository"
import { ProgramRepository } from "../database/repositories/program.repository"
import {
  explodeStringOnCommas,
  countSimilarValues,
  buildErrorResultDTO,
  buildSuccessResultDTO,
} from "../shared/utils"

export class ResidentService {
  static recommendInterestingProgramsForResidentByResidentName(
    residentName: string
  ) {
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

    // resident has at least one hobby
    const allPrograms = ProgramRepository.getAllPrograms()
    if (!allPrograms.length) {
      return buildErrorResultDTO(
        "No programs found, cannot recommend programs",
        404
      )
    }

    // programs found
    const programsWithResidentHobbies =
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

    // filter unique programs
    const seen = new Set()
    const uniqueResidentMostInterestingPrograms =
      orderedProgramsByMostSimilarResidentHobbies.filter((program) => {
        if (seen.has(program.name)) {
          return false // skip duplicates
        }
        seen.add(program.name) // mark `name` as seen
        return true // keep the first occurrence
      })

    // get the first 3 most interesting programs
    const recommendedProgramsForResident =
      uniqueResidentMostInterestingPrograms.length > 3
        ? uniqueResidentMostInterestingPrograms.slice(0, 3)
        : uniqueResidentMostInterestingPrograms

    // return program names
    const recommendedProgramNamesForResident =
      recommendedProgramsForResident.map((program) => program.name)

    // @TODO: refine more the recommendation by randomizing
    // programs with same similarity scores

    return buildSuccessResultDTO(recommendedProgramNamesForResident)
  }
}
