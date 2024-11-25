// 4. Addresses a gap in offerings (lots of interest from residents, but no similar programs planned)

import { NextRequest } from "next/server"
import {
  buildNextSuccessResponse,
  buildNextErrorResponseDTO,
} from "../../../shared/utils"
import { recommendProgramNamesAddressingGapInOfferings } from "../../../services/program-service"

export async function GET(request: NextRequest) {
  const { data, error } = recommendProgramNamesAddressingGapInOfferings()

  if (error) {
    return buildNextErrorResponseDTO(error.message, error.httpStatusCode)
  }
  return buildNextSuccessResponse(data)
}
