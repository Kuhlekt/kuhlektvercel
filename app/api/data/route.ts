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
              "This is your first article in the knowledge base. You can edit, delete, or create new articles using the admin interface.\n\nTo get started:\n1. Login with admin/admin123\n2. Navigate to the Admin section\n3. Explore the different management options",
            categoryId: "1",
            tags: ["welcome", "introduction", "getting-started"],
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
                  "Before you begin, make sure your system meets the following requirements:\n\n- Node.js 18 or higher\n- Modern web browser\n- Internet connection for initial setup\n\nThis knowledge base runs entirely in your browser with data stored locally.",
                categoryId: "2",
                tags: ["requirements", "setup", "installation"],
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
              "Here are some common issues you might encounter:\n\n1. **Login problems** - Check your username and password\n   - Default admin: admin/admin123\n   - Default editor: editor/editor123\n   - Default viewer: viewer/viewer123\n\n2. **Slow loading** - Clear your browser cache\n\n3. **Missing content** - Refresh the page or check the data management section\n\n4. **Import/Export issues** - Ensure you're using valid JSON files",
            categoryId: "3",
            tags: ["troubleshooting", "issues", "help"],
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
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      {
        id: "2",
        username: "editor",
        password: "editor123",
        email: "editor@kuhlekt.com",
        role: "editor",
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      {
        id: "3",
        username: "viewer",
        password: "viewer123",
        email: "viewer@kuhlekt.com",
        role: "viewer",
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    ],
    auditLog: [
      {
        id: "1",
        action: "system_initialized",
        performedBy: "system",
        username: "system",
        timestamp: new Date().toISOString(),
        details: "Knowledge base initialized with default data",
      },
      {
        id: "2",
        action: "article_created",
        performedBy: "system",
        username: "system",
        timestamp: new Date().toISOString(),
        articleId: "1",
        articleTitle: "Welcome to the Knowledge Base",
        categoryId: "1",
        details: "Initial welcome article created during setup",
      },
    ],
    pageVisits: 0,
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2))
  console.log(
    "✅ Initialized default data with users:",
    defaultData.users.map((u) => ({ username: u.username, role: u.role })),
  )
  return defaultData
}

// Load data from file
async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(data)

    console.log("📊 Loaded data from file:", {
      categories: parsed.categories?.length || 0,
      users: parsed.users?.length || 0,
      usernames: parsed.users?.map((u: any) => u.username) || [],
      auditLog: parsed.auditLog?.length || 0,
      pageVisits: parsed.pageVisits || 0,
    })

    return parsed
  } catch (error) {
    console.log("🔄 No existing data file found, initializing with default data")
    return await initializeData()
  }
}

// Save data to file
async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8")

    console.log("💾 Saved data to file:", {
      categories: data.categories?.length || 0,
      users: data.users?.length || 0,
      usernames: data.users?.map((u: any) => u.username) || [],
      auditLog: data.auditLog?.length || 0,
      pageVisits: data.pageVisits || 0,
    })
  } catch (error) {
    console.error("❌ Error saving data to file:", error)
    throw error
  }
}

// GET - Load data
export async function GET() {
  try {
    console.log("🔍 GET /api/data - Loading data...")
    const data = await loadData()
    console.log("✅ GET /api/data - Data loaded successfully")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Error in GET /api/data:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

// POST - Save data
export async function POST(request: NextRequest) {
  try {
    console.log("📝 POST /api/data - Saving data...")
    const body = await request.json()

    console.log("📊 Received data to save:", {
      categories: body.categories?.length || 0,
      users: body.users?.length || 0,
      usernames: body.users?.map((u: any) => u.username) || [],
      auditLog: body.auditLog?.length || 0,
      pageVisits: body.pageVisits || 0,
    })

    // Load existing data
    const existingData = await loadData()

    // Merge with new data (only update provided fields)
    const updatedData = {
      categories: body.categories !== undefined ? body.categories : existingData.categories,
      users: body.users !== undefined ? body.users : existingData.users,
      auditLog: body.auditLog !== undefined ? body.auditLog : existingData.auditLog,
      pageVisits: body.pageVisits !== undefined ? body.pageVisits : existingData.pageVisits,
    }

    await saveData(updatedData)
    console.log("✅ POST /api/data - Data saved successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error in POST /api/data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
