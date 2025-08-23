import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Default data structure
const getDefaultData = (): KnowledgeBaseData => ({
  categories: [
    {
      id: "cat-1",
      name: "Getting Started",
      description: "Essential information for new users",
      articles: [
        {
          id: "art-1",
          title: "Welcome to the Knowledge Base",
          content:
            "This is your comprehensive knowledge base system. Here you can find articles, guides, and documentation organized by categories.",
          categoryId: "cat-1",
          author: "System",
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ["welcome", "introduction"],
          views: 0,
        },
      ],
    },
    {
      id: "cat-2",
      name: "User Guide",
      description: "How to use the system effectively",
      articles: [
        {
          id: "art-2",
          title: "How to Search Articles",
          content:
            "Use the search bar at the top of the page to find articles by title, content, or tags. You can also browse by category using the sidebar.",
          categoryId: "cat-2",
          author: "System",
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ["search", "navigation"],
          views: 0,
        },
      ],
    },
    {
      id: "cat-3",
      name: "Administration",
      description: "Admin tools and settings",
      articles: [
        {
          id: "art-3",
          title: "Managing Users",
          content:
            "Administrators can create, edit, and delete user accounts. Users can have different roles: Admin, Editor, or Viewer.",
          categoryId: "cat-3",
          author: "System",
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ["admin", "users"],
          views: 0,
        },
      ],
    },
  ],
  users: [
    {
      id: "user-1",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      password: "admin123",
      createdAt: new Date(),
    },
    {
      id: "user-2",
      username: "editor",
      email: "editor@example.com",
      role: "editor",
      password: "editor123",
      createdAt: new Date(),
    },
    {
      id: "user-3",
      username: "viewer",
      email: "viewer@example.com",
      role: "viewer",
      password: "viewer123",
      createdAt: new Date(),
    },
  ],
  auditLog: [],
  pageVisits: 0,
  lastUpdated: new Date(),
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
async function loadData(): Promise<KnowledgeBaseData> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(data)

    // Convert date strings back to Date objects
    if (parsed.categories) {
      parsed.categories.forEach((cat: any) => {
        if (cat.articles) {
          cat.articles.forEach((art: any) => {
            art.createdAt = new Date(art.createdAt)
            art.updatedAt = new Date(art.updatedAt)
          })
        }
        if (cat.subcategories) {
          cat.subcategories.forEach((sub: any) => {
            if (sub.articles) {
              sub.articles.forEach((art: any) => {
                art.createdAt = new Date(art.createdAt)
                art.updatedAt = new Date(art.updatedAt)
              })
            }
          })
        }
      })
    }

    if (parsed.users) {
      parsed.users.forEach((user: any) => {
        user.createdAt = new Date(user.createdAt)
        if (user.lastLogin) {
          user.lastLogin = new Date(user.lastLogin)
        }
      })
    }

    if (parsed.auditLog) {
      parsed.auditLog.forEach((entry: any) => {
        entry.timestamp = new Date(entry.timestamp)
      })
    }

    if (parsed.lastUpdated) {
      parsed.lastUpdated = new Date(parsed.lastUpdated)
    }

    return parsed
  } catch (error) {
    console.log("No existing data file found, creating default data")
    const defaultData = getDefaultData()
    await saveData(defaultData)
    return defaultData
  }
}

// Save data to file
async function saveData(data: KnowledgeBaseData): Promise<void> {
  try {
    await ensureDataDir()

    // Create backup
    try {
      await fs.access(DATA_FILE)
      const backupFile = path.join(DATA_DIR, `knowledge-base-backup-${Date.now()}.json`)
      await fs.copyFile(DATA_FILE, backupFile)
    } catch {
      // No existing file to backup
    }

    // Update last modified timestamp
    data.lastUpdated = new Date()

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (error) {
    console.error("Error saving data:", error)
    throw new Error("Failed to save data")
  }
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("GET /api/data error:", error)
    return NextResponse.json({ success: false, error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.data) {
      return NextResponse.json({ success: false, error: "No data provided" }, { status: 400 })
    }

    await saveData(body.data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/data error:", error)
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 })
  }
}
