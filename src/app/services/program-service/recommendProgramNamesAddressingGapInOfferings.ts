import { ProgramRepository } from "../../database/repositories/program.repository"
import { ResidentRepository } from "../../database/repositories/resident.repository"
import {
  Result,
  explodeStringOnCommas,
  setOrIncrementMapValueByKey,
} from "../../shared/utils"
import { buildErrorResultDTO, buildSuccessResultDTO } from "../../shared/utils"

export function recommendProgramNamesAddressingGapInOfferings(): Result<
  string[]
> {
  const allResidents = ResidentRepository.getAllResidents()
  if (!allResidents.length) {
    return buildErrorResultDTO(
      "No residents found, cannot recommend programs addressing gap in offerings",
      404
    )
  }
  // residents found

  // just in case check early if there are any programs
  const allPrograms = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot recommend programs addressing gap in offerings",
      404
    )
  }
  // programs found

  // assess most popular hobbies of all residents
  const residentHobbyNamesCountMap = new Map<string, number>()
  allResidents.forEach((resident) => {
    const residentHobbies = explodeStringOnCommas(resident.hobbies)

    // resident has null or empty hobbies
    if (!residentHobbies.length) {
      // set or increment "noHobbies" count
      setOrIncrementMapValueByKey(residentHobbyNamesCountMap, "noHobbies")
      return
    }

    // resident has at least one hobby
    residentHobbies.forEach((hobby) => {
      // set or increment hobby count
      setOrIncrementMapValueByKey(residentHobbyNamesCountMap, hobby)
    })
  })

  // get up to 3 most popular hobbies
  const upTo3MostPopularHobbyNames: string[] = Array.from(
    residentHobbyNamesCountMap.entries()
  )
    .filter(([hobbyName]) => hobbyName !== "noHobbies")
    .sort(
      ([hobbyNameA, hobbyCountA], [hobbyNameB, hobbyCountB]) =>
        hobbyCountB - hobbyCountA // sort by most popular hobby
    )
    .slice(0, 5) // Take up to the first 5 most popular hobbies // @TODO: make the number of picked hobbies configurable
    .map(([hobbyName]) => hobbyName)

  // get programs that match one or more of the most popular hobbies
  const programsWithMostPopularHobbies =
    ProgramRepository.filterProgramsByHobbies(
      allPrograms,
      upTo3MostPopularHobbyNames
    )

  // count how many times each program has occurred by program name
  const programNamesWithMostPopularHobbiesCountMap = new Map<string, number>()
  programsWithMostPopularHobbies.forEach((program) => {
    setOrIncrementMapValueByKey(
      programNamesWithMostPopularHobbiesCountMap,
      program.name
    )
  })

  // sort program names by least occurred program
  const sortedLeastOccurredProgramNamesWithMostPopularHobbies: string[] =
    Array.from(programNamesWithMostPopularHobbiesCountMap.entries())
      .sort(
        ([programNameA, programCountA], [programNameB, programCountB]) =>
          programCountA - programCountB
      )
      .map(([programName]) => programName)

  // recommend 3 least occurred programs
  const recommendedLeastOccuredProgramsWithMostResidentsInterests: string[] =
    sortedLeastOccurredProgramNamesWithMostPopularHobbies.slice(0, 3)

  return buildSuccessResultDTO(
    recommendedLeastOccuredProgramsWithMostResidentsInterests
  )
}
