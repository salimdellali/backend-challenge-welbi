"use server"

import { NextResponse } from "next/server"
import { ResidentsService } from "../database/services/resident.service"

export async function GET() {
  return NextResponse.json({ residents: ResidentsService.getAllResidents() })
}
