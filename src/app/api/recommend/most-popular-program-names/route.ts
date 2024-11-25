// 2. Engages the highest number of residents feature

import { NextRequest } from "next/server"
import {
  buildNextSuccessResponse,
  buildNextErrorResponseDTO,
} from "../../../shared/utils"
import { recommendMostPopularProgramNames } from "../../../services/program-service"

export async function GET(request: NextRequest) {
  const { data, error } = recommendMostPopularProgramNames()
  if (error) {
    return buildNextErrorResponseDTO(error.message, error.httpStatusCode)
  }
  return buildNextSuccessResponse(data)
}
