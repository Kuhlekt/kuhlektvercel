import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, updateDatabase } from "@/lib/database"

export async function GET() {
  try {
    console.log("📡 API: GET /api/data - Loading data...")

    const data = getDatabase()

    console.log("✅ API: Data loaded successfully:", {
      categories: data.categories?.length || 0,
      users: data.users?.length || 0,
      auditLog: data.auditLog?.length || 0,
      pageVisits: data.pageVisits || 0,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("❌ API: Error loading data:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📡 API: POST /api/data - Saving data...")

    const body = await request.json()

    // Validate the data structure
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data format",
        },
        { status: 400 },
      )
    }

    console.log("📊 API: Data structure received:", {
      categories: body.categories?.length || 0,
      users: body.users?.length || 0,
      auditLog: body.auditLog?.length || 0,
      pageVisits: body.pageVisits,
    })

    // Update the database
    updateDatabase(body)

    console.log("✅ API: Data saved successfully")

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
    })
  } catch (error) {
    console.error("❌ API: Error saving data:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
