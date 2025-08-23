import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Default data structure
const getDefaultData = (): KnowledgeBaseData => ({
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      role: "admin",
      email: "admin@kuhlekt.com",
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      role: "editor",
      email: "editor@kuhlekt.com",
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      role: "viewer",
      email: "viewer@kuhlekt.com",
      createdAt: new Date().toISOString(),
      isActive: true,
    },
  ],
  categories: [
    {
      id: "1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Technical Documentation",
      description: "Detailed technical guides and references",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "FAQ",
      description: "Frequently asked questions",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: "1",
      title: "Welcome to Kuhlekt Knowledge Base",
      content:
        "This is your comprehensive knowledge base system. You can create, edit, and organize articles to share information with your team.",
      categoryId: "1",
      authorId: "1",
      tags: ["welcome", "introduction"],
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
    },
    {
      id: "2",
      title: "How to Create Articles",
      content:
        'To create a new article, click the "Add Article" button and fill in the required information including title, content, and category.',
      categoryId: "1",
      authorId: "1",
      tags: ["tutorial", "articles"],
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
    },
  ],
  auditLog: [],
  pageVisits: 0,
  lastUpdated: new Date().toISOString(),
})

async function ensureDataFile(): Promise<KnowledgeBaseData> {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Check if file exists
    try {
      const data = await fs.readFile(DATA_FILE, "utf8")
      const parsedData = JSON.parse(data)

      // Validate data structure
      if (!parsedData.users || !parsedData.categories || !parsedData.articles) {
        throw new Error("Invalid data structure")
      }

      return parsedData
    } catch (error) {
      // File doesn't exist or is invalid, create default
      console.log("Creating default data file...")
      const defaultData = getDefaultData()
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2))
      return defaultData
    }
  } catch (error) {
    console.error("Error ensuring data file:", error)
    return getDefaultData()
  }
}

export async function GET() {
  try {
    console.log("📖 GET /api/data - Loading data...")
    const data = await ensureDataFile()

    console.log("✅ Data loaded successfully:", {
      users: data.users?.length || 0,
      categories: data.categories?.length || 0,
      articles: data.articles?.length || 0,
      auditLog: data.auditLog?.length || 0,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Error in GET /api/data:", error)
    return NextResponse.json(
      { error: "Failed to load data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 POST /api/data - Saving data...")
    const newData: KnowledgeBaseData = await request.json()

    // Validate required fields
    if (!newData.users || !newData.categories || !newData.articles) {
      return NextResponse.json({ error: "Invalid data structure" }, { status: 400 })
    }

    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Update timestamp
    newData.lastUpdated = new Date().toISOString()

    // Write data to file
    await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2))

    console.log("✅ Data saved successfully")
    return NextResponse.json({ success: true, message: "Data saved successfully" })
  } catch (error) {
    console.error("❌ Error in POST /api/data:", error)
    return NextResponse.json(
      { error: "Failed to save data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
