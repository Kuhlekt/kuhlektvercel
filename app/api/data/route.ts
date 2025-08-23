import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")
const BACKUP_DIR = path.join(DATA_DIR, "backups")

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

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }

  try {
    await fs.access(BACKUP_DIR)
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true })
  }
}

// Load data from file
async function loadData(): Promise<KnowledgeBaseData> {
  try {
    await ensureDataDirectory()

    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8")
      const data = JSON.parse(fileContent)

      // Validate data structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data structure")
      }

      // Ensure all required properties exist
      const validData: KnowledgeBaseData = {
        categories: Array.isArray(data.categories) ? data.categories : [],
        articles: Array.isArray(data.articles) ? data.articles : [],
        users: Array.isArray(data.users) ? data.users : [],
        auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
        pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : 0,
      }

      return validData
    } catch (error) {
      console.log("📁 Data file not found or invalid, creating default data")
      const defaultData = getDefaultData()
      await saveData(defaultData)
      return defaultData
    }
  } catch (error) {
    console.error("❌ Error loading data:", error)
    return getDefaultData()
  }
}

// Save data to file
async function saveData(data: KnowledgeBaseData): Promise<void> {
  try {
    await ensureDataDirectory()

    // Create backup if file exists
    try {
      await fs.access(DATA_FILE)
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const backupFile = path.join(BACKUP_DIR, `knowledge-base-${timestamp}.json`)
      const existingData = await fs.readFile(DATA_FILE, "utf-8")
      await fs.writeFile(backupFile, existingData)

      // Keep only last 10 backups
      const backupFiles = await fs.readdir(BACKUP_DIR)
      const sortedBackups = backupFiles
        .filter((f) => f.startsWith("knowledge-base-") && f.endsWith(".json"))
        .sort()
        .reverse()

      if (sortedBackups.length > 10) {
        for (const oldBackup of sortedBackups.slice(10)) {
          await fs.unlink(path.join(BACKUP_DIR, oldBackup))
        }
      }
    } catch {
      // No existing file to backup
    }

    // Save new data
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("💾 Data saved successfully")
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw new Error("Failed to save data")
  }
}

// GET - Load data
export async function GET() {
  try {
    console.log("🔍 Loading data from file system...")
    const data = await loadData()

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
    console.log("💾 Saving data to file system...")

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

    // Validate required fields
    const validData: KnowledgeBaseData = {
      categories: Array.isArray(data.categories) ? data.categories : [],
      articles: Array.isArray(data.articles) ? data.articles : [],
      users: Array.isArray(data.users) ? data.users : [],
      auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
      pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : 0,
    }

    await saveData(validData)

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
