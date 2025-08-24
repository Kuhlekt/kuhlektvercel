import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/utils/database"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

// Default data structure
const getDefaultData = (): KnowledgeBaseData => ({
  categories: [
    {
      id: "1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Documentation",
      description: "Technical documentation and guides",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "FAQ",
      description: "Frequently asked questions",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: "1",
      title: "Welcome to the Knowledge Base",
      content: "This is your first article in the knowledge base. You can edit this content or create new articles.",
      categoryId: "1",
      author: "System",
      tags: ["welcome", "getting-started"],
      isPublished: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      email: "editor@example.com",
      role: "editor",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      email: "viewer@example.com",
      role: "viewer",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  auditLog: [
    {
      id: "1",
      action: "system_init",
      performedBy: "System",
      timestamp: new Date().toISOString(),
      details: "Knowledge base initialized with default data",
    },
  ],
  pageVisits: 0,
})

// GET - Load data
export async function GET() {
  try {
    console.log("🔍 GET /api/data - Loading data...")

    const data = await database.loadData()

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ GET /api/data error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// POST - Save data
export async function POST(request: NextRequest) {
  try {
    console.log("💾 POST /api/data - Saving data...")

    const body = await request.json()

    // Handle both direct data and wrapped data
    const data = body.data || body

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "No valid data provided",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    await database.saveData(data)

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ POST /api/data error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
