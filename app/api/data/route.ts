import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Load data from file
async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.log("📁 Creating new data file with initial data...")

    // Return initial data structure
    const initialData = {
      categories: [
        {
          id: "1",
          name: "Getting Started",
          description: "Basic information and setup guides",
          icon: "BookOpen",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          articles: [
            {
              id: "1",
              title: "Welcome to Knowledge Base",
              content: "This is your knowledge base system. You can add, edit, and organize articles here.",
              categoryId: "1",
              tags: ["welcome", "introduction"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          subcategories: [],
        },
        {
          id: "2",
          name: "Administration",
          description: "Admin tools and management",
          icon: "Settings",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          articles: [],
          subcategories: [],
        },
      ],
      users: [
        {
          id: "1",
          username: "admin",
          password: "admin123",
          role: "admin",
          email: "admin@example.com",
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
        {
          id: "2",
          username: "editor",
          password: "editor123",
          role: "editor",
          email: "editor@example.com",
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
        {
          id: "3",
          username: "viewer",
          password: "viewer123",
          role: "viewer",
          email: "viewer@example.com",
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
      ],
      auditLog: [
        {
          id: "1",
          action: "system_initialized",
          timestamp: new Date().toISOString(),
          username: "system",
          performedBy: "system",
          details: "Knowledge base system initialized",
        },
      ],
      pageVisits: 0,
    }

    // Save initial data
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2))
    return initialData
  }
}

// Save data to file
async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("📖 API GET /api/data - Loading data...")
    const data = await loadData()

    console.log("✅ API GET /api/data - Data loaded successfully:", {
      categories: data.categories?.length || 0,
      users: data.users?.length || 0,
      auditLog: data.auditLog?.length || 0,
      pageVisits: data.pageVisits || 0,
    })

    return NextResponse.json({
      success: true,
      ...data,
    })
  } catch (error) {
    console.error("❌ API GET /api/data - Error:", error)
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
    console.log("💾 API POST /api/data - Saving data...")

    const body = await request.json()

    if (!body || typeof body !== "object") {
      throw new Error("Invalid request body")
    }

    // Load current data
    const currentData = await loadData()

    // Merge with new data
    const updatedData = {
      categories: body.categories || currentData.categories || [],
      users: body.users || currentData.users || [],
      auditLog: body.auditLog || currentData.auditLog || [],
      pageVisits: typeof body.pageVisits === "number" ? body.pageVisits : currentData.pageVisits || 0,
    }

    // Save updated data
    await saveData(updatedData)

    console.log("✅ API POST /api/data - Data saved successfully")

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
    })
  } catch (error) {
    console.error("❌ API POST /api/data - Error:", error)
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
