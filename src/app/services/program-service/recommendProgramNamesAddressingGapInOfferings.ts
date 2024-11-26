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

  // Take up to the first 5 most popular hobby names
  // @TODO: make the number of picked hobby names configurable
  const mostPopularHobbyNames: string[] = Array.from(
    residentHobbyNamesCountMap.entries()
  )
    .filter(([hobbyName]) => hobbyName !== "noHobbies")
    .sort(
      ([hobbyNameA, hobbyCountA], [hobbyNameB, hobbyCountB]) =>
        hobbyCountB - hobbyCountA // sort by most popular hobby
    )
    .slice(0, 5)
    .map(([hobbyName]) => hobbyName)

  // get programs that match one or more of the most popular hobbies
  const programsWithMostPopularHobbies =
    ProgramRepository.filterProgramsByHobbies(
      allPrograms,
      mostPopularHobbyNames
    )

  // count how many times each program has occurred by program name
  const programNamesCountWithMostPopularHobbiesMap = new Map<string, number>()
  programsWithMostPopularHobbies.forEach((program) => {
    // set or increment program name count
    setOrIncrementMapValueByKey(
      programNamesCountWithMostPopularHobbiesMap,
      program.name
    )
  })

  // sort program names by least occurred program
  const sortedLeastOccurredProgramNamesWithMostPopularHobbies: string[] =
    Array.from(programNamesCountWithMostPopularHobbiesMap.entries())
      .sort(
        ([programNameA, programCountA], [programNameB, programCountB]) =>
          programCountA - programCountB // sort by least occurred program with most popular hobbies
      )
      .map(([programName, programCount]) => programName)

  // recommend 3 least occurred programs
  const recommendedLeastOccurredProgramsWithMostResidentsInterests: string[] =
    sortedLeastOccurredProgramNamesWithMostPopularHobbies.slice(0, 3)

  return buildSuccessResultDTO(
    recommendedLeastOccurredProgramsWithMostResidentsInterests
  )
}
