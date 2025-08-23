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
const getDefaultData = () => ({
  categories: [
    {
      id: "cat-1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-2",
      name: "Technical Documentation",
      description: "Detailed technical guides and references",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-3",
      name: "FAQ",
      description: "Frequently asked questions and answers",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  articles: [],
  users: [
    {
      id: "user-1",
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "user-2",
      username: "editor",
      password: "editor123",
      email: "editor@example.com",
      role: "editor",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "user-3",
      username: "viewer",
      password: "viewer123",
      email: "viewer@example.com",
      role: "viewer",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [],
  pageVisits: 0,
})

export async function GET() {
  try {
    await ensureDataDirectory()

    try {
      const data = await fs.readFile(DATA_FILE, "utf8")
      const parsedData = JSON.parse(data)

      // Ensure all required fields exist
      const completeData = {
        ...getDefaultData(),
        ...parsedData,
      }

      return NextResponse.json({ success: true, data: completeData })
    } catch (error) {
      // File doesn't exist or is invalid, create with default data
      const defaultData = getDefaultData()
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2))
      return NextResponse.json({ success: true, data: defaultData })
    }
  } catch (error) {
    console.error("Error loading data:", error)
    return NextResponse.json({ success: false, error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDirectory()

    const body = await request.json()
    console.log("📥 POST /api/data - Received body:", JSON.stringify(body, null, 2))

    // Handle different data structures
    let dataToSave

    if (body.data) {
      // Data is wrapped in a 'data' property
      dataToSave = body.data
    } else if (body.categories || body.users || body.articles || body.auditLog) {
      // Data properties are at root level
      dataToSave = body
    } else {
      console.error("❌ No valid data structure found in request body")
      return NextResponse.json({ success: false, error: "No data provided" }, { status: 400 })
    }

    // Validate required fields
    if (!dataToSave.categories && !dataToSave.users && !dataToSave.articles && !dataToSave.auditLog) {
      console.error("❌ No valid data fields found")
      return NextResponse.json({ success: false, error: "Invalid data structure" }, { status: 400 })
    }

    // Load existing data and merge
    let existingData = getDefaultData()
    try {
      const existingFile = await fs.readFile(DATA_FILE, "utf8")
      existingData = JSON.parse(existingFile)
    } catch {
      // File doesn't exist, use defaults
    }

    // Merge data
    const mergedData = {
      ...existingData,
      ...dataToSave,
      // Ensure pageVisits is preserved if not provided
      pageVisits: dataToSave.pageVisits !== undefined ? dataToSave.pageVisits : existingData.pageVisits,
    }

    console.log("💾 Saving merged data:", {
      categories: mergedData.categories?.length || 0,
      articles: mergedData.articles?.length || 0,
      users: mergedData.users?.length || 0,
      auditLog: mergedData.auditLog?.length || 0,
      pageVisits: mergedData.pageVisits,
    })

    await fs.writeFile(DATA_FILE, JSON.stringify(mergedData, null, 2))

    return NextResponse.json({ success: true, data: mergedData })
  } catch (error) {
    console.error("❌ Error saving data:", error)
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 })
  }
}
