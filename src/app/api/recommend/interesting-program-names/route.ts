import { NextRequest, NextResponse } from "next/server"
import { ResidentService } from "./../../../services"
import {
  buildNextSuccessResponse,
  buildNextErrorResponseDTO,
} from "../../../shared/utils"

export async function GET(request: NextRequest) {
  // @TODO: get the resident name with dynamic route handler for better URL aesthetics
  const residentName = request.nextUrl.searchParams.get("residentname")
  if (!residentName) {
    return buildNextErrorResponseDTO(
      `Resident name is required. Make sure to provide it using the query parameter 'residentname' like this 'api/recommend/interesting-program-names?residentname=<your_resident_name_here>'`,
      400
    )
  }

  const { data, error } =
    ResidentService.recommendInterestingProgramsForResidentByResidentName(
      residentName
    )

  if (error) {
    return buildNextErrorResponseDTO(error.message, error.httpStatusCode)
  }
  return buildNextSuccessResponse(data)
}
