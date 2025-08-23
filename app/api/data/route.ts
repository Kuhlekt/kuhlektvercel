import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Category, User, AuditLogEntry } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Default data structure
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
        },
      ],
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
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Load data from file
async function loadData() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(data)

    // Validate data structure
    if (!parsed.categories || !parsed.users || !parsed.auditLog) {
      throw new Error("Invalid data structure")
    }

    return parsed
  } catch (error) {
    console.log("📁 Creating default data file...")
    const defaultData = getDefaultData()
    await saveData(defaultData)
    return defaultData
  }
}

// Save data to file
async function saveData(data: any) {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ API Error (GET):", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data: requestData } = body

    console.log("📝 API Request:", { action, hasData: !!requestData })

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
    console.error("❌ API Error (POST):", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
