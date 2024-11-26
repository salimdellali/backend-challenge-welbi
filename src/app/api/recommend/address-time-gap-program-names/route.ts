// 5. Addresses a gap in time (a reasonable day and time with few programs offered)

import { NextRequest } from "next/server"
import {
  buildNextSuccessResponse,
  buildNextErrorResponseDTO,
} from "../../../shared/utils"
import { recommendProgramNamesAddressingGapInTime } from "../../../services/program-service"

export async function GET(request: NextRequest) {
  const { data, error } = recommendProgramNamesAddressingGapInTime()

  if (error) {
    return buildNextErrorResponseDTO(error.message, error.httpStatusCode)
  }
  return buildNextSuccessResponse(data)
}
