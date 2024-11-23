enum Mode {
  RECREATION = "RECREATION",
  ONEONONE = "ONEONONE",
}

export type Program = {
  id: string // UUID
  name: string
  start: string // ISO date string
  end: string // ISO date string
  mode: Mode // Modes of the program
  dimensions: string // 1 or many dimensions comma separated, can be specific strings like "Physical", "Intellectual", etc.
  facilitators: string // 1 or many facilitators comma separated
  hobbies: null | string // 0, 1 or many hobbies comma separated
  levelsOfCare: string // 1 or many levels of care comma separated
  attendees: {
    userId: string // foreign key to Resident.userId
  }[]
}
