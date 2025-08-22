import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Default data structure
const defaultData = {
  categories: [
    {
      id: "1",
      name: "Getting Started",
      description: "Essential information for new users",
      articles: [
        {
          id: "1",
          title: "Welcome to Kuhlekt Knowledge Base",
          content:
            "This is your central hub for company knowledge, documentation, and best practices. Here you'll find everything you need to get started and stay productive.",
          categoryId: "1",
          tags: ["welcome", "introduction", "getting-started"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      subcategories: [
        {
          id: "1-1",
          name: "Account Setup",
          description: "How to set up your account",
          articles: [
            {
              id: "2",
              title: "Creating Your First Account",
              content: "Follow these steps to create your account and get started with the knowledge base system.",
              categoryId: "1-1",
              tags: ["account", "setup", "registration"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Documentation",
      description: "Technical documentation and guides",
      articles: [],
      subcategories: [
        {
          id: "2-1",
          name: "API Documentation",
          description: "API reference and examples",
          articles: [],
        },
      ],
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      email: "admin@kuhlekt.com",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      email: "editor@kuhlekt.com",
      role: "editor",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      email: "viewer@kuhlekt.com",
      role: "viewer",
      createdAt: new Date().toISOString(),
    },
  ],
  auditLog: [
    {
      id: "1",
      action: "system_initialized",
      performedBy: "system",
      timestamp: new Date().toISOString(),
      details: "Knowledge base system initialized with default data",
    },
  ],
}

async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create it with default data
    await saveData(defaultData)
    return defaultData
  }
}

async function saveData(data: any) {
  await ensureDataDirectory()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error loading data:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await saveData(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
