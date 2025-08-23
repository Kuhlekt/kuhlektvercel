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

// Initialize with default data
async function initializeDefaultData() {
  const defaultData = {
    categories: [
      {
        id: "1",
        name: "Getting Started",
        description: "Basic information to get you started",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            articles: [
              {
                id: "2",
                title: "System Requirements",
                content:
                  "Before you begin, make sure your system meets the following requirements:\n\n- Node.js 18 or higher\n- Modern web browser\n- Internet connection for initial setup\n\nThis knowledge base runs entirely in your browser with data stored locally.",
                categoryId: "2",
                subcategoryId: "2",
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
    auditLog: [
      {
        id: "1",
        action: "system_initialized",
        performedBy: "system",
        username: "system",
        timestamp: new Date().toISOString(),
        details: "Knowledge base initialized with default data",
      },
    ],
    pageVisits: 0,
  }

  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2))
    console.log("✅ Default data initialized successfully")
    return defaultData
  } catch (error) {
    console.error("❌ Error initializing default data:", error)
    return defaultData // Return in-memory data even if file write fails
  }
}

// Load data from file
async function loadData() {
  try {
    await ensureDataDirectory()

    // Try to read existing file
    try {
      const data = await fs.readFile(DATA_FILE, "utf8")
      const parsed = JSON.parse(data)

      console.log("📁 Data loaded from file:", {
        categories: parsed.categories?.length || 0,
        users: parsed.users?.length || 0,
        usernames: parsed.users?.map((u: any) => u.username) || [],
        auditLog: parsed.auditLog?.length || 0,
      })

      return parsed
    } catch (fileError) {
      console.log("🔧 No existing data file, creating default data...")
      return await initializeDefaultData()
    }
  } catch (error) {
    console.error("❌ Error in loadData:", error)
    // Return fallback data
    return await initializeDefaultData()
  }
}

// Save data to file
async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("💾 Data saved successfully")
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("🔍 API GET /api/data - Loading data...")
    const data = await loadData()

    console.log("✅ API GET /api/data - Returning data:", {
      categories: data.categories?.length || 0,
      users: data.users?.length || 0,
      usernames: data.users?.map((u: any) => u.username) || [],
      auditLog: data.auditLog?.length || 0,
    })

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("❌ API GET /api/data - Error:", error)

    // Return minimal fallback data
    const fallbackData = await initializeDefaultData()
    return NextResponse.json(fallbackData)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 API POST /api/data - Saving data...")
    const newData = await request.json()

    // Load current data first
    const currentData = await loadData()

    // Merge with new data
    const updatedData = {
      categories: newData.categories !== undefined ? newData.categories : currentData.categories,
      users: newData.users !== undefined ? newData.users : currentData.users,
      auditLog: newData.auditLog !== undefined ? newData.auditLog : currentData.auditLog,
      pageVisits: newData.pageVisits !== undefined ? newData.pageVisits : currentData.pageVisits,
    }

    await saveData(updatedData)
    console.log("✅ API POST /api/data - Data saved successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ API POST /api/data - Error:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
