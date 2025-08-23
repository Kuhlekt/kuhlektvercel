import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Default data structure
const DEFAULT_DATA: KnowledgeBaseData = {
  categories: [
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Essential guides to get you up and running",
      icon: "BookOpen",
      articles: [
        {
          id: "welcome",
          title: "Welcome to the Knowledge Base",
          content:
            "This is your comprehensive knowledge base system. Here you can find guides, documentation, and helpful resources.",
          categoryId: "getting-started",
          tags: ["welcome", "introduction"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      subcategories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "technical",
      name: "Technical Documentation",
      description: "Technical guides and API documentation",
      icon: "Code",
      articles: [],
      subcategories: [
        {
          id: "api-docs",
          name: "API Documentation",
          description: "REST API endpoints and usage examples",
          articles: [
            {
              id: "api-overview",
              title: "API Overview",
              content: "Learn about our REST API endpoints, authentication, and best practices for integration.",
              categoryId: "api-docs",
              tags: ["api", "rest", "documentation"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "admin-1",
      username: "admin",
      password: "admin123",
      role: "admin",
      email: "admin@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "editor-1",
      username: "editor",
      password: "editor123",
      role: "editor",
      email: "editor@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "viewer-1",
      username: "viewer",
      password: "viewer123",
      role: "viewer",
      email: "viewer@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  auditLog: [
    {
      id: "audit-1",
      action: "system_initialized",
      username: "system",
      details: "Knowledge base system initialized with default data",
      timestamp: new Date().toISOString(),
    },
  ],
  pageVisits: 0,
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Load data from file
async function loadData(): Promise<KnowledgeBaseData> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsedData = JSON.parse(data)

    // Ensure all required fields exist
    return {
      categories: parsedData.categories || DEFAULT_DATA.categories,
      users: parsedData.users || DEFAULT_DATA.users,
      auditLog: parsedData.auditLog || DEFAULT_DATA.auditLog,
      pageVisits: parsedData.pageVisits || 0,
    }
  } catch (error) {
    console.log("📁 Creating default data file...")
    await saveData(DEFAULT_DATA)
    return DEFAULT_DATA
  }
}

// Save data to file
async function saveData(data: KnowledgeBaseData): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json({
      success: true,
      categories: data.categories.length,
      users: data.users.length,
      auditLog: data.auditLog.length,
      pageVisits: data.pageVisits,
    })
  } catch (error) {
    console.error("❌ GET /api/data - Error:", error)
    return NextResponse.json({ success: false, error: "Failed to get data summary" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data: requestData } = body

    console.log(`📡 POST /api/data - Action: ${action}`)

    switch (action) {
      case "load": {
        const data = await loadData()
        console.log("✅ Data loaded successfully:", {
          categories: data.categories.length,
          users: data.users.length,
          auditLog: data.auditLog.length,
          pageVisits: data.pageVisits,
        })
        return NextResponse.json({
          success: true,
          ...data,
        })
      }

      case "save": {
        if (!requestData) {
          return NextResponse.json({ success: false, error: "No data provided" }, { status: 400 })
        }

        await saveData(requestData)
        console.log("✅ Data saved successfully")
        return NextResponse.json({ success: true })
      }

      case "import": {
        if (!requestData) {
          return NextResponse.json({ success: false, error: "No data provided for import" }, { status: 400 })
        }

        // Validate import data structure
        const importData: KnowledgeBaseData = {
          categories: requestData.categories || [],
          users: requestData.users || [],
          auditLog: requestData.auditLog || [],
          pageVisits: requestData.pageVisits || 0,
        }

        await saveData(importData)
        console.log("✅ Data imported successfully")
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ POST /api/data - Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
