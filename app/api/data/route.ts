import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

// Default data structure
const defaultData: KnowledgeBaseData = {
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
  ],
  articles: [
    {
      id: "1",
      title: "Welcome to Kuhlekt Knowledge Base",
      content:
        "This is your comprehensive knowledge management system. Use the navigation to explore articles, manage content, and access administrative features.",
      categoryId: "1",
      tags: ["welcome", "introduction"],
      author: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true,
      views: 0,
    },
  ],
  auditLog: [],
  settings: {
    siteName: "Kuhlekt Knowledge Base",
    description: "Comprehensive knowledge management system",
    version: "1.0.0",
  },
  stats: {
    totalUsers: 3,
    totalArticles: 1,
    totalCategories: 2,
    totalViews: 0,
    lastUpdated: new Date().toISOString(),
  },
}

async function ensureDataFile(): Promise<KnowledgeBaseData> {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE)
    await fs.mkdir(dataDir, { recursive: true })

    // Try to read existing file
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8")
      const data = JSON.parse(fileContent)

      // Validate data structure
      if (!data.users || !data.categories || !data.articles) {
        throw new Error("Invalid data structure")
      }

      return data
    } catch (error) {
      // File doesn't exist or is invalid, create with default data
      console.log("Creating new data file with default data")
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2))
      return defaultData
    }
  } catch (error) {
    console.error("Error ensuring data file:", error)
    return defaultData
  }
}

async function saveData(data: KnowledgeBaseData): Promise<void> {
  try {
    // Create backup
    const backupFile = DATA_FILE + ".backup"
    try {
      await fs.copyFile(DATA_FILE, backupFile)
    } catch (error) {
      // Backup failed, but continue
      console.warn("Failed to create backup:", error)
    }

    // Update stats
    data.stats = {
      totalUsers: data.users.length,
      totalArticles: data.articles.length,
      totalCategories: data.categories.length,
      totalViews: data.articles.reduce((sum, article) => sum + article.views, 0),
      lastUpdated: new Date().toISOString(),
    }

    // Save data
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Error saving data:", error)
    throw new Error("Failed to save data")
  }
}

export async function GET() {
  try {
    const data = await ensureDataFile()
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/data error:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    // Handle both direct data and wrapped data objects
    const newData = requestData.data || requestData

    if (!newData || typeof newData !== "object") {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    // Validate required fields
    if (!newData.users || !newData.categories || !newData.articles) {
      return NextResponse.json({ error: "Invalid data structure" }, { status: 400 })
    }

    await saveData(newData)

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
      stats: newData.stats,
    })
  } catch (error) {
    console.error("POST /api/data error:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
