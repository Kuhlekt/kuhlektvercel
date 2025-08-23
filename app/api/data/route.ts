import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

// Default data structure
const DEFAULT_DATA = {
  categories: [
    {
      id: "1",
      name: "General",
      description: "General knowledge articles",
      parentId: null,
      articles: [],
    },
    {
      id: "2",
      name: "Technical",
      description: "Technical documentation",
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
      email: "admin@example.com",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      role: "editor",
      email: "editor@example.com",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      role: "viewer",
      email: "viewer@example.com",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [
    {
      id: "1",
      action: "system_init",
      userId: "system",
      timestamp: new Date().toISOString(),
      details: "System initialized with default data",
    },
  ],
  pageVisits: 0,
}

async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.log("No existing data file, using defaults")
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
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error loading data:", error)
    return NextResponse.json(DEFAULT_DATA)
  }
}

export async function POST(request: NextRequest) {
  try {
    const newData = await request.json()

    // Validate data structure
    if (!newData || typeof newData !== "object") {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    await saveData(newData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
