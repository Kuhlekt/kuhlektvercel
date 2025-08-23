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
      icon: "BookOpen",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [
        {
          id: "1",
          title: "Welcome to Knowledge Base",
          content:
            "This is your first article in the knowledge base. You can edit or delete this article and add new ones.",
          categoryId: "1",
          tags: ["welcome", "getting-started"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      subcategories: [],
    },
    {
      id: "2",
      name: "FAQ",
      description: "Frequently asked questions",
      icon: "HelpCircle",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [],
      subcategories: [],
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "password",
      role: "admin",
      email: "admin@example.com",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      role: "editor",
      email: "editor@example.com",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      role: "viewer",
      email: "viewer@example.com",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      action: "system_initialized",
      username: "system",
      details: "Knowledge base system initialized with default data",
    },
  ],
  pageVisits: 0,
}

async function ensureDataFile() {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Check if file exists
    try {
      await fs.access(DATA_FILE)
    } catch {
      // File doesn't exist, create it with default data
      console.log("📁 Creating default data file...")
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
      console.log("✅ Default data file created successfully")
    }
  } catch (error) {
    console.error("❌ Error ensuring data file:", error)
    throw error
  }
}

async function readDataFile() {
  try {
    await ensureDataFile()
    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    const data = JSON.parse(fileContent)

    // Ensure all required properties exist
    return {
      categories: Array.isArray(data.categories) ? data.categories : DEFAULT_DATA.categories,
      users: Array.isArray(data.users) ? data.users : DEFAULT_DATA.users,
      auditLog: Array.isArray(data.auditLog) ? data.auditLog : DEFAULT_DATA.auditLog,
      pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : DEFAULT_DATA.pageVisits,
    }
  } catch (error) {
    console.error("❌ Error reading data file:", error)
    return DEFAULT_DATA
  }
}

async function writeDataFile(data: any) {
  try {
    await ensureDataFile()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("✅ Data file written successfully")
  } catch (error) {
    console.error("❌ Error writing data file:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("📖 API: Reading data from file...")
    const data = await readDataFile()
    console.log("✅ API: Data read successfully")

    return NextResponse.json({
      success: true,
      ...data,
    })
  } catch (error) {
    console.error("❌ API: Error reading data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 API: Saving data to file...")
    const body = await request.json()

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data structure",
        },
        { status: 400 },
      )
    }

    // Read current data first
    const currentData = await readDataFile()

    // Merge with new data
    const updatedData = {
      categories: Array.isArray(body.categories) ? body.categories : currentData.categories,
      users: Array.isArray(body.users) ? body.users : currentData.users,
      auditLog: Array.isArray(body.auditLog) ? body.auditLog : currentData.auditLog,
      pageVisits: typeof body.pageVisits === "number" ? body.pageVisits : currentData.pageVisits,
    }

    await writeDataFile(updatedData)
    console.log("✅ API: Data saved successfully")

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
    })
  } catch (error) {
    console.error("❌ API: Error saving data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
