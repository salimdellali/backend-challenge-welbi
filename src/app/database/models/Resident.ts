const enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

enum LevelOfCare {
  ASSISTED_LIVING = "Assisted Living",
  INDEPENDENT = "Independent",
  LONG_TERM_CARE = "Long Term Care",
  MEMORY_CARE = "Memory Care",
}

export type Resident = {
  userId: string // UUID
  name: string
  gender: null | Gender
  birthday: string // ISO date string
  moveInDate: string // ISO date string
  levelOfCare: null | LevelOfCare
  hobbies: null | string // 0, 1 or many hobbies comma separated
  roomNumber: string
}
