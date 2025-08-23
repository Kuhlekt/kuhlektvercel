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

// GET - Load data
export async function GET() {
  try {
    console.log("📖 API Route - Loading data from:", DATA_FILE)

    await ensureDataDirectory()

    try {
      const data = await fs.readFile(DATA_FILE, "utf8")
      const parsedData = JSON.parse(data)
      console.log("✅ API Route - Data loaded successfully")
      return NextResponse.json({ success: true, data: parsedData })
    } catch (error) {
      console.log("📝 API Route - No existing data file, creating initial data")

      // Create initial data structure
      const initialData = {
        categories: [
          {
            id: "cat-1",
            name: "Getting Started",
            description: "Basic information and setup guides",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            articleCount: 0,
          },
          {
            id: "cat-2",
            name: "Documentation",
            description: "Technical documentation and guides",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            articleCount: 0,
          },
          {
            id: "cat-3",
            name: "FAQ",
            description: "Frequently asked questions",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            articleCount: 0,
          },
        ],
        articles: [],
        users: [
          {
            id: "user-1",
            username: "admin",
            password: "admin123",
            role: "admin",
            email: "admin@example.com",
            createdAt: new Date().toISOString(),
            isActive: true,
          },
          {
            id: "user-2",
            username: "editor",
            password: "editor123",
            role: "editor",
            email: "editor@example.com",
            createdAt: new Date().toISOString(),
            isActive: true,
          },
          {
            id: "user-3",
            username: "viewer",
            password: "viewer123",
            role: "viewer",
            email: "viewer@example.com",
            createdAt: new Date().toISOString(),
            isActive: true,
          },
        ],
        auditLog: [],
        pageVisits: 0,
        lastUpdated: new Date().toISOString(),
      }

      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2))
      console.log("✅ API Route - Initial data created successfully")
      return NextResponse.json({ success: true, data: initialData })
    }
  } catch (error) {
    console.error("❌ API Route - Error loading data:", error)
    return NextResponse.json({ success: false, error: "Failed to load data" }, { status: 500 })
  }
}

// POST - Save data
export async function POST(request: NextRequest) {
  try {
    console.log("💾 API Route - Saving data...")

    const body = await request.json()
    console.log("📦 API Route - Request body keys:", Object.keys(body))
    console.log("📦 API Route - Request body structure:", JSON.stringify(body, null, 2).substring(0, 500))

    // Handle different data structures
    let dataToSave

    if (body.data) {
      // Data is wrapped in a 'data' property
      dataToSave = body.data
      console.log("📦 API Route - Using wrapped data structure")
    } else if (body.categories || body.users || body.auditLog || body.articles) {
      // Data is directly in the body
      dataToSave = body
      console.log("📦 API Route - Using direct data structure")
    } else {
      console.error("❌ API Route - Invalid data structure:", Object.keys(body))
      return NextResponse.json({ success: false, error: "No valid data provided" }, { status: 400 })
    }

    // Validate required fields
    if (!dataToSave.categories && !dataToSave.users && !dataToSave.auditLog) {
      console.error("❌ API Route - Missing required data fields")
      return NextResponse.json({ success: false, error: "Missing required data fields" }, { status: 400 })
    }

    await ensureDataDirectory()

    // Add metadata
    const dataWithMetadata = {
      ...dataToSave,
      lastUpdated: new Date().toISOString(),
      pageVisits: dataToSave.pageVisits || 0,
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(dataWithMetadata, null, 2))
    console.log("✅ API Route - Data saved successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ API Route - Error saving data:", error)
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 })
  }
}
