import { ProgramRepository } from "../../database/repositories/program.repository"
import {
  Result,
  countDaysBetweenISODateTimesUTC,
  getUpToFirst3ProgramNames,
  setOrIncrementMapValueByKey,
} from "../../shared/utils"
import { buildErrorResultDTO, buildSuccessResultDTO } from "../../shared/utils"

// @TODO: make the picked number of isolation days configurable
const NUMBER_OF_ISOLATION_DAYS = 15

export function recommendProgramNamesEngagingIsolatedResidents(): Result<
  string[]
> {
  const allPrograms = ProgramRepository.getAllPrograms()
  if (!allPrograms.length) {
    return buildErrorResultDTO(
      "No programs found, cannot recommend programs engaging isolated residents",
      404
    )
  }
  // programs found

  // map each resident with an array of attended programs with respective dates
  const residentProgramNamesAttendanceWithDateMap = new Map<
    string, // userId
    { programName: string; attendanceDateTimeUTC: string }[] // list of program names with attendance dates
  >()
  for (const program of allPrograms) {
    for (const attendee of program.attendees) {
      // get or initialize program names with dates array
      const residentProgramsAttendance =
        residentProgramNamesAttendanceWithDateMap.get(attendee.userId) ?? []

      // insert new attendance
      residentProgramsAttendance.push({
        programName: program.name,
        attendanceDateTimeUTC: program.start,
      })

      // update resident entry
      residentProgramNamesAttendanceWithDateMap.set(
        attendee.userId,
        residentProgramsAttendance
      )
    }
  }
  // we have a map containing each resident with an array of programs they have attended with the respective attendance date

  // for each resident, find program names that they have attended after exceeding ISOLATION_PERIOD_IN_DAYS period
  const programNamesAttendedByIsolatedResidents: string[] = []
  for (const programsAttended of residentProgramNamesAttendanceWithDateMap.values()) {
    for (let i = 0; i < programsAttended.length - 1; i++) {
      const {
        programName: previousProgramName,
        attendanceDateTimeUTC: prevDate,
      } = programsAttended[i]

      const { programName: nextProgramName, attendanceDateTimeUTC: nextDate } =
        programsAttended[i + 1]

      // check if the gap between the 2 dates is greater or equal to ISOLATION_PERIOD_IN_DAYS
      if (
        countDaysBetweenISODateTimesUTC(prevDate, nextDate) >=
        NUMBER_OF_ISOLATION_DAYS
      ) {
        // nextProgramName is a program that an isolated resident have attended, add it to the list
        programNamesAttendedByIsolatedResidents.push(nextProgramName)
      }
    }
  }
  // we have a list of program names that have been attended by isolated residents

  // count how many times a program has occurred
  const programNamesOccurrencesMap = new Map<string, number>()
  for (const programName of programNamesAttendedByIsolatedResidents) {
    setOrIncrementMapValueByKey(programNamesOccurrencesMap, programName)
  }

  // sort programs names by most occurred,
  const sortedProgramNamesByMostOccurred: string[] = [
    ...programNamesOccurrencesMap,
  ]
    .sort(
      (
        [programNameA, programOccurrenceA],
        [programNameB, programOccurrenceB]
      ) => {
        return programOccurrenceB - programOccurrenceA
      }
    )
    .map(([programName, programOccurrence]) => programName)

  // get up to 3 most popular program names engaging isolated residents
  const topProgramNames: string[] = getUpToFirst3ProgramNames(
    sortedProgramNamesByMostOccurred
  )

  return buildSuccessResultDTO(topProgramNames)
}
