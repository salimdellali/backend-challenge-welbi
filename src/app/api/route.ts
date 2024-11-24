import { NextResponse } from "next/server"
import { ResidentService } from "../services"

export async function GET() {
  // @TODO: escape and verify input is a valid name
  const { data, error } =
    ResidentService.recommendInterestingProgramsForResidentByResidentName(
      "Randal Rau"
      // "Darla Blanda"
    )

  return NextResponse.json({
    data,
    error,
  })
}
