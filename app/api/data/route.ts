import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Default data structure
const DEFAULT_DATA = {
  categories: [
    {
      id: "1",
      name: "General",
      description: "General knowledge articles",
      parentId: null,
      articles: [
        {
          id: "1",
          title: "Welcome to Kuhlekt Knowledge Base",
          content: "This is your knowledge base system. You can add, edit, and organize articles here.",
          categoryId: "1",
          tags: ["welcome", "introduction"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "1",
        },
      ],
    },
    {
      id: "2",
      name: "Technical",
      description: "Technical documentation and guides",
      parentId: null,
      articles: [],
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      role: "admin",
      email: "admin@kuhlekt.com",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      role: "editor",
      email: "editor@kuhlekt.com",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      role: "viewer",
      email: "viewer@kuhlekt.com",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [
    {
      id: "1",
      action: "system_init",
      userId: "1",
      timestamp: new Date().toISOString(),
      details: "Knowledge base system initialized",
    },
  ],
  pageVisits: 0,
}

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.log("No existing data file, creating default data")
    await saveData(DEFAULT_DATA)
    return DEFAULT_DATA
  }
}

async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error("Error saving data:", error)
    throw new Error("Failed to save data")
  }
}

export async function GET() {
  try {
    const data = await loadData()

    // Return summary data for the client
    const summary = {
      categories: data.categories?.length || 0,
      users: data.users?.length || 0,
      usernames: data.users?.map((u: any) => u.username) || [],
      auditLog: data.auditLog?.length || 0,
      pageVisits: data.pageVisits || 0,
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error loading data:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.action === "save") {
      await saveData(body.data)
      return NextResponse.json({ success: true })
    }

    if (body.action === "load") {
      const data = await loadData()
      return NextResponse.json(data)
    }

    if (body.action === "import") {
      const importData = body.data

      // Validate import data structure
      if (!importData.categories || !importData.users) {
        return NextResponse.json({ error: "Invalid import data structure" }, { status: 400 })
      }

      await saveData(importData)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
