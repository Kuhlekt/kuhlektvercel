import { type NextRequest, NextResponse } from "next/server"
import { updateAffiliate } from "@/lib/affiliate-management"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const success = updateAffiliate(id, updates)

    if (!success) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating affiliate:", error)
    return NextResponse.json({ error: "Failed to update affiliate" }, { status: 500 })
  }
}
