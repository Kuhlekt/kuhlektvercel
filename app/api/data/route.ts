import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
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

// Initialize with default data if file doesn't exist
async function initializeData() {
  const defaultData = {
    categories: [
      {
        id: "1",
        name: "Getting Started",
        description: "Basic information to get you started",
        articles: [
          {
            id: "1",
            title: "Welcome to the Knowledge Base",
            content:
              "This is your first article in the knowledge base. You can edit, delete, or create new articles using the admin interface.",
            categoryId: "1",
            tags: ["welcome", "introduction"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        subcategories: [
          {
            id: "2",
            name: "Installation",
            description: "How to install and set up",
            articles: [
              {
                id: "2",
                title: "System Requirements",
                content:
                  "Before you begin, make sure your system meets the following requirements:\n\n- Node.js 18 or higher\n- Modern web browser\n- Internet connection for initial setup",
                categoryId: "2",
                tags: ["requirements", "setup"],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
      {
        id: "3",
        name: "Troubleshooting",
        description: "Common issues and solutions",
        articles: [
          {
            id: "3",
            title: "Common Issues",
            content:
              "Here are some common issues you might encounter:\n\n1. Login problems - Check your username and password\n2. Slow loading - Clear your browser cache\n3. Missing content - Refresh the page",
            categoryId: "3",
            tags: ["troubleshooting", "issues"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        subcategories: [],
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
        lastLogin: new Date().toISOString(),
      },
      {
        id: "2",
        username: "editor",
        password: "editor123",
        email: "editor@kuhlekt.com",
        role: "editor",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      {
        id: "3",
        username: "viewer",
        password: "viewer123",
        email: "viewer@kuhlekt.com",
        role: "viewer",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    ],
    auditLog: [
      {
        id: "1",
        action: "article_created",
        performedBy: "admin",
        timestamp: new Date().toISOString(),
        articleId: "1",
        articleTitle: "Welcome to the Knowledge Base",
        categoryId: "1",
        details: "Initial article created during setup",
      },
    ],
    pageVisits: 0,
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2))
  return defaultData
}

// Load data from file
async function loadData() {
  await ensureDataDirectory()

  try {
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.log("Data file not found, initializing with default data")
    return await initializeData()
  }
}

// Save data to file
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
