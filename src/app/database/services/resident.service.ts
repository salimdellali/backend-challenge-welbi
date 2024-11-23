import { Resident } from "../models/Resident"
import { fetchData } from "../instance"

export class ResidentsService {
  static getAllResidents(): Resident[] {
    const dataset = fetchData()
    return dataset.residents
  }
}
