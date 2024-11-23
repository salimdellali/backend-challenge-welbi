import { readFileSync } from "fs"
import { join } from "path"
import { Resident } from "./models/Resident"
import { Program } from "./models/Program"

type Dataset = {
  residents: Resident[]
  programs: Program[]
}

class Database {
  private static instance: Database | null = null
  private readonly data: Dataset

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.data = this.readDatasetFromLocalFile()
  }

  // Private method to read and parse the JSON file
  private readDatasetFromLocalFile(): Dataset {
    try {
      const datasetPath = join(
        process.cwd(),
        "src",
        "app",
        "database",
        "backend.json"
      )
      const datasetContentAsJSON = readFileSync(datasetPath, "utf-8")
      return JSON.parse(datasetContentAsJSON)
    } catch (error) {
      const errorMessage = "Error reading dataset"
      console.error(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  // Method to get the singleton instance
  public static getInstance(): Database {
    if (this.instance === null) {
      this.instance = new Database()
    }
    return this.instance
  }

  // Method to get the actual data
  public getData(): Dataset {
    return this.data
  }
}

// Export the singleton instance accessor
export const fetchData = (): Dataset => Database.getInstance().getData()
