import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Complete default data structure
const DEFAULT_DATA = {
  categories: [
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Essential guides to get you up and running",
      icon: "BookOpen",
      articles: [
        {
          id: "welcome-article",
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
      description: "Technical documentation and guides",
      icon: "FileText",
      articles: [
        {
          id: "how-to-create-articles",
          title: "How to Create Articles",
          content:
            "Creating articles in the knowledge base is simple:\n\n1. Click the 'Add Article' button in the navigation\n2. Fill in the article title and content\n3. Select a category\n4. Add relevant tags\n5. Click 'Save Article'\n\nYour article will be immediately available to all users.",
          categoryId: "documentation",
          tags: ["tutorial", "articles", "creation"],
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
  ],
  users: [
    {
      id: "admin-user",
      username: "admin",
      password: "admin123",
      role: "admin",
      email: "admin@example.com",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "editor-user",
      username: "editor",
      password: "editor123",
      role: "editor",
      email: "editor@example.com",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "viewer-user",
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
      id: "init-audit",
      action: "system_initialized",
      performedBy: "system",
      timestamp: new Date().toISOString(),
      details: "Knowledge base system initialized with default data",
    },
  ],
  pageVisits: 0,
}

async function ensureDataFile() {
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Check if data file exists
    try {
      await fs.access(DATA_FILE)
      console.log("✅ Data file exists")
    } catch {
      // File doesn't exist, create it
      console.log("📁 Creating default data file...")
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
      console.log("✅ Default data file created")
    }
  } catch (error) {
    console.error("❌ Error ensuring data file:", error)
    throw error
  }
}

async function loadDataFromFile() {
  try {
    await ensureDataFile()
    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    const data = JSON.parse(fileContent)

    // Validate data structure
    if (!data.categories || !Array.isArray(data.categories)) {
      throw new Error("Invalid categories data")
    }
    if (!data.users || !Array.isArray(data.users)) {
      throw new Error("Invalid users data")
    }
    if (!data.auditLog || !Array.isArray(data.auditLog)) {
      throw new Error("Invalid audit log data")
    }

    console.log("✅ Data loaded from file:", {
      categories: data.categories.length,
      users: data.users.length,
      auditLog: data.auditLog.length,
    })

    return data
  } catch (error) {
    console.error("❌ Error loading data from file:", error)
    console.log("🔄 Falling back to default data...")
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
    return DEFAULT_DATA
  }
}

async function saveDataToFile(data: any) {
  try {
    await ensureDataFile()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("✅ Data saved to file")
  } catch (error) {
    console.error("❌ Error saving data to file:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("📖 GET /api/data - Loading data...")
    const data = await loadDataFromFile()

    return NextResponse.json({
      success: true,
      categories: data.categories,
      users: data.users,
      auditLog: data.auditLog,
      pageVisits: data.pageVisits || 0,
    })
  } catch (error) {
    console.error("❌ GET /api/data - Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 POST /api/data - Processing request...")

    const body = await request.json()
    const { action, data: requestData } = body

    console.log("📝 Action:", action)

    switch (action) {
      case "load": {
        const data = await loadDataFromFile()
        return NextResponse.json({
          success: true,
          categories: data.categories,
          users: data.users,
          auditLog: data.auditLog,
          pageVisits: data.pageVisits || 0,
        })
      }

      case "save": {
        if (!requestData) {
          return NextResponse.json({ success: false, error: "No data provided" }, { status: 400 })
        }

        await saveDataToFile(requestData)
        return NextResponse.json({ success: true })
      }

      case "import": {
        if (!requestData) {
          return NextResponse.json({ success: false, error: "No data provided for import" }, { status: 400 })
        }

        // Validate import data
        if (!requestData.categories || !requestData.users || !requestData.auditLog) {
          return NextResponse.json({ success: false, error: "Invalid import data structure" }, { status: 400 })
        }

        await saveDataToFile(requestData)
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ POST /api/data - Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
