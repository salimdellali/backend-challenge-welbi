// 1. Something that Darla Blanda would like feature

import { NextRequest } from "next/server"
import { recommendInterestingProgramNamesForResidentByResidentName } from "../../../services/program-service"
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
    recommendInterestingProgramNamesForResidentByResidentName(residentName)

  if (error) {
    return buildNextErrorResponseDTO(error.message, error.httpStatusCode)
  }
  return buildNextSuccessResponse(data)
}
