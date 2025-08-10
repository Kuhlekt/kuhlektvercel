import { type NextRequest, NextResponse } from "next/server"
import { addAffiliate, removeAffiliate, getAllAffiliates } from "@/lib/affiliate-management"
import { validateAdminPassword } from "@/lib/admin-config"

export async function GET(request: NextRequest) {
  try {
    // Enhanced admin authentication
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !validateAdminPassword(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ affiliates: getAllAffiliates() })
  } catch (error) {
    console.error("Error fetching affiliates:", error)
    return NextResponse.json({ error: "Failed to fetch affiliates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Enhanced admin authentication
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !validateAdminPassword(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, action } = await request.json()

    if (action === "add") {
      const success = addAffiliate(code)
      return NextResponse.json({ success, affiliates: getAllAffiliates() })
    } else if (action === "remove") {
      const success = removeAffiliate(code)
      return NextResponse.json({ success, affiliates: getAllAffiliates() })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error managing affiliates:", error)
    return NextResponse.json({ error: "Failed to manage affiliates" }, { status: 500 })
  }
}
