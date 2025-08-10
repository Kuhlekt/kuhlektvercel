import { type NextRequest, NextResponse } from "next/server"
import { isValidAffiliate } from "@/lib/affiliate-management"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    const isValid = isValidAffiliate(code)

    return NextResponse.json({ isValid })
  } catch (error) {
    console.error("Error validating affiliate:", error)
    return NextResponse.json({ isValid: true }) // Default to valid on error
  }
}
