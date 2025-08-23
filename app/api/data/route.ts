import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

console.log("📁 API Data Route - Data directory:", DATA_DIR)
console.log("📄 API Data Route - Data file:", DATA_FILE)

// Default data structure
const DEFAULT_DATA: KnowledgeBaseData = {
  categories: [
    {
      id: "cat-1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [
        {
          id: "art-1",
          title: "Welcome to the Knowledge Base",
          content: "This is your first article. You can edit or delete it and create new ones.",
          categoryId: "cat-1",
          authorId: "user-1",
          tags: ["welcome", "introduction"],
          isPublished: true,
          viewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "cat-2",
      name: "Documentation",
      description: "Technical documentation and guides",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [],
    },
    {
      id: "cat-3",
      name: "FAQ",
      description: "Frequently asked questions",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [],
    },
  ],
  articles: [
    {
      id: "art-1",
      title: "Welcome to the Knowledge Base",
      content: "This is your first article. You can edit or delete it and create new ones.",
      categoryId: "cat-1",
      authorId: "user-1",
      tags: ["welcome", "introduction"],
      isPublished: true,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "user-1",
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-2",
      username: "editor",
      password: "editor123",
      email: "editor@example.com",
      role: "editor",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-3",
      username: "viewer",
      password: "viewer123",
      email: "viewer@example.com",
      role: "viewer",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  auditLog: [],
  pageVisits: 0,
}

async function ensureDataFile(): Promise<void> {
  try {
    console.log("🔍 Ensuring data directory exists...")
    await fs.mkdir(DATA_DIR, { recursive: true })
    console.log("✅ Data directory ensured")

    try {
      await fs.access(DATA_FILE)
      console.log("✅ Data file exists")
    } catch {
      console.log("📄 Creating default data file...")
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf-8")
      console.log("✅ Default data file created")
    }
  } catch (error) {
    console.error("❌ Error ensuring data file:", error)
    throw error
  }
}

async function loadData(): Promise<KnowledgeBaseData> {
  try {
    console.log("📖 Loading data from file...")
    await ensureDataFile()

    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    const data = JSON.parse(fileContent)

    // Validate data structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format")
    }

    if (!Array.isArray(data.categories)) {
      console.warn("⚠️ Invalid categories, using defaults")
      data.categories = DEFAULT_DATA.categories
    }

    if (!Array.isArray(data.articles)) {
      console.warn("⚠️ Invalid articles, using defaults")
      data.articles = DEFAULT_DATA.articles
    }

    if (!Array.isArray(data.users)) {
      console.warn("⚠️ Invalid users, using defaults")
      data.users = DEFAULT_DATA.users
    }

    if (!Array.isArray(data.auditLog)) {
      console.warn("⚠️ Invalid audit log, using defaults")
      data.auditLog = DEFAULT_DATA.auditLog
    }

    if (typeof data.pageVisits !== "number") {
      data.pageVisits = 0
    }

    console.log("✅ Data loaded successfully:", {
      categories: data.categories.length,
      articles: data.articles.length,
      users: data.users.length,
      auditLog: data.auditLog.length,
      pageVisits: data.pageVisits,
    })

    return data
  } catch (error) {
    console.error("❌ Error loading data, using defaults:", error)
    return DEFAULT_DATA
  }
}

async function saveData(data: KnowledgeBaseData): Promise<void> {
  try {
    console.log("💾 Saving data to file...")
    await ensureDataFile()

    // Validate data before saving
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format")
    }

    if (!Array.isArray(data.categories)) {
      throw new Error("Categories must be an array")
    }

    if (!Array.isArray(data.articles)) {
      throw new Error("Articles must be an array")
    }

    if (!Array.isArray(data.users)) {
      throw new Error("Users must be an array")
    }

    if (!Array.isArray(data.auditLog)) {
      throw new Error("Audit log must be an array")
    }

    const jsonString = JSON.stringify(data, null, 2)
    await fs.writeFile(DATA_FILE, jsonString, "utf-8")
    console.log("✅ Data saved successfully")
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("🔄 GET /api/data - Loading data...")
    const data = await loadData()
    console.log("✅ GET /api/data - Success")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ GET /api/data - Error:", error)
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
    console.log("💾 POST /api/data - Processing save request...")

    const contentType = request.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      console.error("❌ Invalid content type:", contentType)
      return NextResponse.json({ success: false, error: "Content-Type must be application/json" }, { status: 400 })
    }

    let data: KnowledgeBaseData
    try {
      data = await request.json()
      console.log("📝 Request data received:", {
        categories: data?.categories?.length || 0,
        articles: data?.articles?.length || 0,
        users: data?.users?.length || 0,
        auditLog: data?.auditLog?.length || 0,
      })
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError)
      return NextResponse.json({ success: false, error: "Invalid JSON in request body" }, { status: 400 })
    }

    if (!data) {
      console.error("❌ No data provided")
      return NextResponse.json({ success: false, error: "No data provided" }, { status: 400 })
    }

    await saveData(data)
    console.log("✅ POST /api/data - Success")
    return NextResponse.json({ success: true, message: "Data saved successfully" })
  } catch (error) {
    console.error("❌ POST /api/data - Error:", error)
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
