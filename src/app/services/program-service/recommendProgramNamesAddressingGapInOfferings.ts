import { Program } from "../../database/models/Program"
import { Resident } from "../../database/models/Resident"
import { ProgramRepository } from "../../database/repositories/program.repository"
import { ResidentRepository } from "../../database/repositories/resident.repository"
import {
  Result,
  explodeStringOnCommas,
  getUpToFirst3ProgramNames,
  setOrIncrementMapValueByKey,
} from "../../shared/utils"
import { buildErrorResultDTO, buildSuccessResultDTO } from "../../shared/utils"

// @TODO: make the picked number of hobbies configurable
const NUMBER_OF_TOP_HOBBIES = 5

export function recommendProgramNamesAddressingGapInOfferings(): Result<
  string[]
> {
  const allResidents: Resident[] = ResidentRepository.getAllResidents()
  if (!allResidents.length) {
    return buildErrorResultDTO(
      "No residents found, cannot recommend programs addressing gap in offerings",
      404
    )
  }
  // residents found

  // just in case check early if there are any programs
  const allPrograms: Program[] = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot recommend programs addressing gap in offerings",
      404
    )
  }
  // programs found

  // assess most popular hobbies of all residents
  const allResidentHobbiesCountMap = new Map<string, number>()
  for (const resident of allResidents) {
    const residentHobbies = explodeStringOnCommas(resident.hobbies)

    // resident has null or empty hobbies
    if (!residentHobbies.length) {
      // set or increment "noHobbies" count
      setOrIncrementMapValueByKey(allResidentHobbiesCountMap, "NO_HOBBIES")
      continue
    }

    // resident has at least one hobby
    for (const hobby of residentHobbies) {
      // set or increment hobby count
      setOrIncrementMapValueByKey(allResidentHobbiesCountMap, hobby)
    }
  }

  // Take up to the first 5 most popular hobbies
  const mostPopularHobbies: string[] = [...allResidentHobbiesCountMap]
    .filter(([hobby, hobbyCount]) => hobby !== "NO_HOBBIES") // remove noise
    .sort(
      ([hobbyA, hobbyCountA], [hobbyB, hobbyCountB]) =>
        hobbyCountB - hobbyCountA // sort by most popular hobby
    )
    .slice(0, NUMBER_OF_TOP_HOBBIES)
    .map(([hobby, hobbyCount]) => hobby)

  // get programs that match one or more of the most popular hobbies
  const programsWithMostPopularHobbies: Program[] =
    ProgramRepository.filterProgramsByHobbies(allPrograms, mostPopularHobbies)

  if (!programsWithMostPopularHobbies.length) {
    return buildErrorResultDTO(
      "No programs found matching the most popular hobbies, cannot recommend programs addressing gap in offerings",
      404
    )
  }

  // count how many times each program has occurred by program name
  const programNamesCountWithMostPopularHobbiesMap = new Map<string, number>()
  for (const program of programsWithMostPopularHobbies) {
    // set or increment program name count
    setOrIncrementMapValueByKey(
      programNamesCountWithMostPopularHobbiesMap,
      program.name
    )
  }

  // sort program names by least occurred program
  const sortedProgramNamesByLeastOccurred: string[] = [
    ...programNamesCountWithMostPopularHobbiesMap,
  ]
    .sort(
      ([programNameA, programCountA], [programNameB, programCountB]) =>
        programCountA - programCountB // sort by least occurred program with most popular hobbies
    )
    .map(([programName, programCount]) => programName)

  // recommend 3 least occurred programs
  const topProgramNames: string[] = getUpToFirst3ProgramNames(
    sortedProgramNamesByLeastOccurred
  )

  return buildSuccessResultDTO(topProgramNames)
}
