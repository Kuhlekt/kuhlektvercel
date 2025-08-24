import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, updateDatabase, initializeDatabase } from "@/lib/database"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

// GET - Load data
export async function GET() {
  try {
    console.log("🔍 GET /api/data - Loading data...")

    // Initialize database if needed
    const data = getDatabase()

    console.log("✅ Data loaded successfully:", {
      categories: data.categories?.length || 0,
      articles: data.articles?.length || 0,
      users: data.users?.length || 0,
      auditLog: data.auditLog?.length || 0,
      pageVisits: data.pageVisits || 0,
    })

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ GET /api/data error:", error)

    // Fallback: reinitialize database
    try {
      const fallbackData = initializeDatabase()
      return NextResponse.json({
        success: true,
        data: fallbackData,
        timestamp: new Date().toISOString(),
        warning: "Fallback data loaded after error",
      })
    } catch (fallbackError) {
      console.error("❌ Fallback initialization failed:", fallbackError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to load data and fallback failed",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }
  }
}

// POST - Save data
export async function POST(request: NextRequest) {
  try {
    console.log("💾 POST /api/data - Saving data...")

    const body = await request.json()
    console.log("📦 Request body received:", {
      hasData: !!body.data,
      hasCategories: !!body.categories,
      hasUsers: !!body.users,
      hasArticles: !!body.articles,
      hasAuditLog: !!body.auditLog,
    })

    // Handle both direct data and wrapped data
    const dataToSave = body.data || body

    if (!dataToSave || typeof dataToSave !== "object") {
      console.error("❌ Invalid data structure")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data structure provided",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    // Validate that we have at least some data
    const hasValidData = dataToSave.categories || dataToSave.articles || dataToSave.users || dataToSave.auditLog

    if (!hasValidData) {
      console.error("❌ No valid data fields provided")
      return NextResponse.json(
        {
          success: false,
          error: "No valid data fields provided",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    // Update the database
    const updatedData = updateDatabase(dataToSave as Partial<KnowledgeBaseData>)

    console.log("✅ Data saved successfully:", {
      categories: updatedData.categories.length,
      articles: updatedData.articles.length,
      users: updatedData.users.length,
      auditLog: updatedData.auditLog.length,
    })

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
      stats: updatedData.stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ POST /api/data error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save data",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
