import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Default data structure
const DEFAULT_DATA = {
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      role: "admin" as const,
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      role: "editor" as const,
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      role: "viewer" as const,
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: "1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      parentId: null,
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "User Guides",
      description: "Step-by-step user instructions",
      parentId: null,
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Technical Documentation",
      description: "Technical specifications and API documentation",
      parentId: null,
      order: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: "1",
      title: "Welcome to the Knowledge Base",
      content: "This is your knowledge base system. You can create, edit, and organize articles here.",
      categoryId: "1",
      authorId: "1",
      status: "published" as const,
      tags: ["welcome", "introduction"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "How to Create Articles",
      content: 'To create a new article, click the "Add Article" button and fill in the required information.',
      categoryId: "2",
      authorId: "1",
      status: "published" as const,
      tags: ["tutorial", "articles"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
  ],
  auditLog: [
    {
      id: "1",
      action: "system_init",
      userId: "system",
      details: "Knowledge base system initialized",
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1",
    },
  ],
  pageVisits: [],
}

async function ensureDataFile() {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Check if data file exists
    try {
      await fs.access(DATA_FILE)
    } catch {
      // File doesn't exist, create it with default data
      console.log("📁 Creating default data file...")
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
      console.log("✅ Default data file created successfully")
    }
  } catch (error) {
    console.error("❌ Error ensuring data file:", error)
    throw error
  }
}

async function loadData() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(DATA_FILE, "utf8")
    const parsedData = JSON.parse(data)

    // Validate data structure
    if (!parsedData.users || !Array.isArray(parsedData.users)) {
      throw new Error("Invalid data structure: users array missing")
    }
    if (!parsedData.categories || !Array.isArray(parsedData.categories)) {
      throw new Error("Invalid data structure: categories array missing")
    }
    if (!parsedData.articles || !Array.isArray(parsedData.articles)) {
      throw new Error("Invalid data structure: articles array missing")
    }
    if (!parsedData.auditLog || !Array.isArray(parsedData.auditLog)) {
      throw new Error("Invalid data structure: auditLog array missing")
    }
    if (!parsedData.pageVisits || !Array.isArray(parsedData.pageVisits)) {
      parsedData.pageVisits = []
    }

    return parsedData
  } catch (error) {
    console.error("❌ Error loading data:", error)
    // Return default data if file is corrupted
    return DEFAULT_DATA
  }
}

async function saveData(data: any) {
  try {
    await ensureDataFile()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("✅ Data saved successfully")
    return true
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("📊 GET /api/data - Loading data...")
    const data = await loadData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ GET /api/data - Error:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data: requestData } = body

    console.log(`📊 POST /api/data - Action: ${action}`)

    switch (action) {
      case "load":
        const data = await loadData()
        return NextResponse.json(data)

      case "save":
        if (!requestData) {
          return NextResponse.json({ error: "No data provided" }, { status: 400 })
        }
        await saveData(requestData)
        return NextResponse.json({ success: true })

      case "import":
        if (!requestData) {
          return NextResponse.json({ error: "No data provided for import" }, { status: 400 })
        }
        await saveData(requestData)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ POST /api/data - Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
