import { Program } from "../models/Program"
import { fetchData } from "../instance"
import { Resident } from "../models/Resident"
import { explodeStringOnCommas } from "../../shared/utils"

export class ProgramRepository {
  static getAllPrograms(): Program[] {
    const dataset = fetchData()
    return dataset.programs
  }

  static filterProgramsByUserId(
    programs: Program[],
    requestedUserId: string
  ): Program[] {
    const isUserIdInProgram = (userId: string, program: Program) => {
      const attendees = program.attendees
      return attendees.find((attendee) => attendee.userId === userId)
    }

    return programs.filter((program) =>
      isUserIdInProgram(requestedUserId, program)
    )
  }

  /**
   * filters programs that match one of the levels of care provided
   * @example if only "independent" is requested, return programs that have "independent", regardless if there are other levels of care present
   * @example if "independent" and "assisted living" are requested. return programs that have ["independent" or "assisted living"], regardless if there are other levels of care
   */
  static filterProgramsByLevelsOfCare(
    programs: Program[],
    requestedLevelsOfCare: Resident["levelOfCare"][]
  ): Program[] {
    return programs.filter((program) => {
      const programLevelsOfCareArray = program.levelsOfCare.split(
        ","
      ) as Resident["levelOfCare"][]
      return programLevelsOfCareArray.some((programLevelOfCare) =>
        requestedLevelsOfCare.includes(programLevelOfCare)
      )
    })
  }

  /**
   * filters programs that match exactly the requested levels of care. No more, no less
   * @example if only "independent" is requested, return programs that have only "independent" as level of care
   * @example if "independent" and "assisted living" are requested, return only programs that have exactly ["independent" and "assisted living"] an no other level of care
   */
  static filterProgramsByExactLevelsOfCare(
    programs: Program[],
    requestedLevelsOfCare: Resident["levelOfCare"][]
  ): Program[] {
    return programs.filter((program) => {
      const programLevelsOfCareArray = program.levelsOfCare.split(
        ","
      ) as Resident["levelOfCare"][]
      return programLevelsOfCareArray.every((programLevelOfCare) =>
        requestedLevelsOfCare.includes(programLevelOfCare)
      )
    })
  }

  /**
   * filters programs that match one of the hobbies provided
   * @example if only "socializing" is requested, return programs that have "socializing", regardless if there are other hobbies present
   * @example if "socializing" and "drinking" are requested. return programs that have ["socializing" or "drinking"], regardless if there are other hobbies present
   */
  static filterProgramsByHobbies(
    programs: Program[],
    requestedHobbies: string[]
  ): Program[] {
    return programs.filter((program) => {
      const programHobbies = explodeStringOnCommas(program.hobbies!)
      return programHobbies.some((programLevelOfCare) =>
        requestedHobbies.includes(programLevelOfCare)
      )
    })
  }
}
