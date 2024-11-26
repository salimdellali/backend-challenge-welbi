// 3. Engages multiple isolated residents (those who have not been to a program recently)

import { NextRequest } from "next/server"
import {
  buildNextSuccessResponse,
  buildNextErrorResponseDTO,
} from "../../../shared/utils"
import { recommendProgramNamesEngagingIsolatedResidents } from "../../../services/program-service"

export async function GET(request: NextRequest) {
  const { data, error } = recommendProgramNamesEngagingIsolatedResidents()

  if (error) {
    return buildNextErrorResponseDTO(error.message, error.httpStatusCode)
  }
  return buildNextSuccessResponse(data)
}
