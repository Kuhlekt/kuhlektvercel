import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

console.log("📁 Data directory:", DATA_DIR)
console.log("📄 Data file:", DATA_FILE)

// Default data structure
const DEFAULT_DATA = {
  categories: [
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Essential guides to get you up and running",
      articles: [
        {
          id: "welcome",
          title: "Welcome to the Knowledge Base",
          content:
            "This is your comprehensive knowledge base system. Here you can find documentation, guides, and answers to common questions.\n\nFeatures:\n- Browse articles by category\n- Search across all content\n- User management and authentication\n- Admin dashboard for content management\n\nTo get started, explore the categories on the left or use the search bar above.",
          categoryId: "getting-started",
          tags: ["welcome", "introduction", "overview"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      subcategories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "documentation",
      name: "Documentation",
      description: "Technical documentation and API references",
      articles: [
        {
          id: "how-to-add-articles",
          title: "How to Add Articles",
          content:
            "Adding articles to the knowledge base is simple:\n\n1. Click 'Add Article' in the navigation\n2. Fill in the title and content\n3. Select a category\n4. Add relevant tags\n5. Click 'Save Article'\n\nYour article will be immediately available.",
          categoryId: "documentation",
          tags: ["tutorial", "articles"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      subcategories: [
        {
          id: "api-docs",
          name: "API Documentation",
          description: "REST API endpoints and usage examples",
          articles: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "faq",
      name: "FAQ",
      description: "Frequently asked questions",
      articles: [],
      subcategories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "admin-1",
      username: "admin",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "editor-1",
      username: "editor",
      password: "editor123",
      role: "editor",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "viewer-1",
      username: "viewer",
      password: "viewer123",
      role: "viewer",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [
    {
      id: "audit-1",
      action: "system_initialized",
      performedBy: "system",
      timestamp: new Date().toISOString(),
      details: "Knowledge base system initialized with default data",
    },
  ],
}

async function ensureDataFile() {
  try {
    console.log("🔍 Checking data directory...")

    // Ensure data directory exists
    try {
      await fs.access(DATA_DIR)
      console.log("✅ Data directory exists")
    } catch {
      console.log("📁 Creating data directory...")
      await fs.mkdir(DATA_DIR, { recursive: true })
      console.log("✅ Data directory created")
    }

    // Check if data file exists
    try {
      await fs.access(DATA_FILE)
      console.log("✅ Data file exists")
    } catch {
      console.log("📄 Creating default data file...")
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
      console.log("✅ Default data file created")
    }
  } catch (error) {
    console.error("❌ Error ensuring data file:", error)
    throw error
  }
}

async function loadData() {
  try {
    console.log("📖 Loading data from file...")
    await ensureDataFile()

    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    const data = JSON.parse(fileContent)

    // Validate data structure
    if (!data.categories || !Array.isArray(data.categories)) {
      console.warn("⚠️ Invalid categories data, using defaults")
      data.categories = DEFAULT_DATA.categories
    }

    if (!data.users || !Array.isArray(data.users)) {
      console.warn("⚠️ Invalid users data, using defaults")
      data.users = DEFAULT_DATA.users
    }

    if (!data.auditLog || !Array.isArray(data.auditLog)) {
      console.warn("⚠️ Invalid audit log data, using defaults")
      data.auditLog = DEFAULT_DATA.auditLog
    }

    console.log("✅ Data loaded successfully:", {
      categories: data.categories.length,
      users: data.users.length,
      auditLog: data.auditLog.length,
    })

    return data
  } catch (error) {
    console.error("❌ Error loading data, using defaults:", error)
    return DEFAULT_DATA
  }
}

async function saveData(data: any) {
  try {
    console.log("💾 Saving data to file...")
    await ensureDataFile()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("✅ Data saved successfully")
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("🔄 GET /api/data - Loading data...")
    const data = await loadData()
    console.log("✅ GET /api/data - Success")
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ GET /api/data - Error:", error)
    return NextResponse.json(
      { error: "Failed to load data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 POST /api/data - Processing request...")

    const contentType = request.headers.get("content-type")
    console.log("📋 Content-Type:", contentType)

    if (!contentType?.includes("application/json")) {
      console.error("❌ Invalid content type:", contentType)
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 })
    }

    let data
    try {
      data = await request.json()
      console.log("📝 Request data received, keys:", Object.keys(data || {}))
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    if (!data) {
      console.error("❌ No data provided")
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    // Validate required fields
    if (!data.categories || !Array.isArray(data.categories)) {
      console.error("❌ Invalid categories data")
      return NextResponse.json({ error: "Invalid categories data" }, { status: 400 })
    }

    if (!data.users || !Array.isArray(data.users)) {
      console.error("❌ Invalid users data")
      return NextResponse.json({ error: "Invalid users data" }, { status: 400 })
    }

    await saveData(data)
    console.log("✅ POST /api/data - Success")
    return NextResponse.json({ success: true, message: "Data saved successfully" })
  } catch (error) {
    console.error("❌ POST /api/data - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to save data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
