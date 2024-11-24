import { Resident } from "../models/Resident"
import { fetchData } from "../instance"

export class ResidentRepository {
  static getAllResidents(): Resident[] {
    const dataset = fetchData()
    return dataset.residents
  }

  static getFirstResidentByName(name: string): Resident | null {
    const allResidents = this.getAllResidents()
    return (
      allResidents.find(
        (resident) => resident.name.toLowerCase() === name.toLowerCase()
      ) || null
    )
  }
}
