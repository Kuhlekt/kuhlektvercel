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
      name: "Getting Started",
      description: "Basic information to get you started",
      parentId: null,
      order: 0,
      isExpanded: true,
    },
    {
      id: "2",
      name: "User Guide",
      description: "Comprehensive user documentation",
      parentId: null,
      order: 1,
      isExpanded: false,
    },
    {
      id: "3",
      name: "FAQ",
      description: "Frequently asked questions",
      parentId: null,
      order: 2,
      isExpanded: false,
    },
  ],
  articles: [
    {
      id: "1",
      title: "Welcome to Kuhlekt Knowledge Base",
      content: "This is your knowledge base system. You can create, edit, and organize articles here.",
      categoryId: "1",
      tags: ["welcome", "introduction"],
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true,
      views: 0,
    },
    {
      id: "2",
      title: "How to Add Articles",
      content: 'To add a new article, click the "Add Article" button and fill in the required information.',
      categoryId: "2",
      tags: ["tutorial", "articles"],
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true,
      views: 0,
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      email: "admin@kuhlekt.com",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      email: "editor@kuhlekt.com",
      role: "editor",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      email: "viewer@kuhlekt.com",
      role: "viewer",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [],
  settings: {
    siteName: "Kuhlekt Knowledge Base",
    allowRegistration: false,
    requireApproval: true,
    defaultRole: "viewer",
  },
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }

  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
  }
}

export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(DATA_FILE, "utf8")
    const parsedData = JSON.parse(data)

    // Ensure all required properties exist
    const completeData = {
      categories: parsedData.categories || DEFAULT_DATA.categories,
      articles: parsedData.articles || DEFAULT_DATA.articles,
      users: parsedData.users || DEFAULT_DATA.users,
      auditLog: parsedData.auditLog || DEFAULT_DATA.auditLog,
      settings: parsedData.settings || DEFAULT_DATA.settings,
    }

    return NextResponse.json(completeData)
  } catch (error) {
    console.error("Error reading data file:", error)
    return NextResponse.json(DEFAULT_DATA)
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile()
    const newData = await request.json()
    await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error writing data file:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
