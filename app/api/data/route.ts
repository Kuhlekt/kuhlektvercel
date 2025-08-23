import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Category, User, AuditLogEntry } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Complete default data structure
const getDefaultData = () => ({
  categories: [
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Essential guides to get you up and running",
      articles: [
        {
          id: "welcome",
          title: "Welcome to the Knowledge Base",
          content:
            "This is your comprehensive knowledge base system. Here you can find documentation, guides, and answers to common questions.\n\nFeatures:\n- Browse articles by category\n- Search across all content\n- User management and authentication\n- Admin dashboard for content management\n\nTo get started, explore the categories on the left or use the search bar above.",
          categoryId: "getting-started",
          tags: ["welcome", "introduction", "overview"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      subcategories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "documentation",
      name: "Documentation",
      description: "Technical documentation and API references",
      articles: [],
      subcategories: [
        {
          id: "api-docs",
          name: "API Documentation",
          description: "REST API endpoints and usage examples",
          articles: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as Category[],
  users: [
    {
      id: "admin-1",
      username: "admin",
      password: "admin123",
      role: "admin" as const,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "editor-1",
      username: "editor",
      password: "editor123",
      role: "editor" as const,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "viewer-1",
      username: "viewer",
      password: "viewer123",
      role: "viewer" as const,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ] as User[],
  auditLog: [
    {
      id: "audit-1",
      action: "system_initialized",
      performedBy: "system",
      timestamp: new Date().toISOString(),
      details: "Knowledge base system initialized with default data",
    },
  ] as AuditLogEntry[],
})

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    console.log("📁 Creating data directory...")
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Load data from file
async function loadData() {
  try {
    await ensureDataDir()

    try {
      const data = await fs.readFile(DATA_FILE, "utf-8")
      const parsed = JSON.parse(data)

      // Validate data structure
      if (!parsed.categories || !parsed.users || !parsed.auditLog) {
        throw new Error("Invalid data structure")
      }

      console.log("✅ Data loaded from file")
      return parsed
    } catch (error) {
      console.log("📁 Creating default data file...")
      const defaultData = getDefaultData()
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2))
      console.log("✅ Default data file created")
      return defaultData
    }
  } catch (error) {
    console.error("❌ Error in loadData:", error)
    throw error
  }
}

// Save data to file
async function saveData(data: any) {
  try {
    await ensureDataDir()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("✅ Data saved to file")
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("📖 GET /api/data - Loading data...")
    const data = await loadData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ GET /api/data - Error:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 POST /api/data - Processing request...")
    const body = await request.json()
    const { action, data: requestData } = body

    console.log("📝 Action:", action)

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
        // Validate imported data
        if (!requestData.categories || !requestData.users || !requestData.auditLog) {
          return NextResponse.json({ error: "Invalid data structure for import" }, { status: 400 })
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
